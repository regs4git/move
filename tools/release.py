#!/usr/bin/env python3
"""Prepara uma entrega do Move+.

Uso (a partir da raiz do repositório):
    python3 tools/release.py 1.1.1 "notas da versão"   # nova versão
    python3 tools/release.py                           # só regenera imagens e listas, mantém a versão

O que faz:
  1. Converte tools/imagens/<id>.png|jpg|webp para assets/img/<id>.webp (máx. 1024 px de largura).
  2. Escreve js/data/imagens.js com as imagens existentes (as restantes ficam como espaço reservado).
  3. Escreve version.js (versão + lista de ficheiros para offline) e version.json.
Requer: pip install pillow
"""
import json, re, sys, datetime
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, DST = ROOT / 'tools' / 'imagens', ROOT / 'assets' / 'img'
EXCLUDE_DIRS = {'tools', '.git', '.github'}
EXCLUDE_FILES = {'sw.js', 'README.md', '.gitignore', 'version.json'}

def convert_images():
    DST.mkdir(parents=True, exist_ok=True)
    for f in sorted(SRC.glob('*')):
        if f.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}:
            continue
        id_ = f.stem.lower()
        out = DST / f'{id_}.webp'
        if out.exists() and out.stat().st_mtime >= f.stat().st_mtime:
            continue
        im = Image.open(f).convert('RGB')
        if im.width > 1024:
            im = im.resize((1024, round(im.height * 1024 / im.width)), Image.LANCZOS)
        im.save(out, 'WEBP', quality=82, method=6)
        print(f'imagem: {f.name} -> {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)')
    ids = sorted(p.stem for p in DST.glob('*.webp'))
    (ROOT / 'js' / 'data' / 'imagens.js').write_text(
        '// Gerado por tools/release.py — não editar.\nwindow.MP_IMAGES = ' + json.dumps(ids) + ';\n', encoding='utf-8')
    return ids

def current_version():
    m = re.search(r"APP_VERSION\s*=\s*'([^']+)'", (ROOT / 'version.js').read_text()) if (ROOT / 'version.js').exists() else None
    return m.group(1) if m else '0.0.0'

def file_list():
    files = ['./']
    for p in sorted(ROOT.rglob('*')):
        rel = p.relative_to(ROOT)
        if p.is_dir() or rel.parts[0] in EXCLUDE_DIRS or rel.name in EXCLUDE_FILES or rel.name.startswith('.'):
            continue
        files.append('./' + rel.as_posix())
    return files

def main():
    ids = convert_images()
    version = sys.argv[1] if len(sys.argv) > 1 else current_version()
    notes = sys.argv[2] if len(sys.argv) > 2 else ''
    files = file_list()
    (ROOT / 'version.js').write_text(
        '// Gerado por tools/release.py — não editar.\n'
        f"self.APP_VERSION = '{version}';\nself.APP_FILES = {json.dumps(files, indent=2)};\n", encoding='utf-8')
    (ROOT / 'version.json').write_text(json.dumps(
        {'version': version, 'published': datetime.date.today().isoformat(), 'notes': notes}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'versão {version}; {len(files)} ficheiros em cache; {len(ids)} imagem(ns).')

main()
