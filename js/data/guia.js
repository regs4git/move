// Guia: lista de temas (cada um é uma ficha). id único; título; blocos de conteúdo:
//  {p:'texto'}  {list:['item',...]}  {note:'nota'}  {alert:['item',...]}  {img:'id', alt:'descrição'}
// {img} mostra assets/img/<id>.webp; enquanto o ficheiro não existir aparece um espaço reservado.
window.MP_GUIA = [
  { id: 'joelho', titulo: 'Joelho recurvado', blocks: [
    { img: 'g01', alt: 'Joelhos em extensão neutra e em hiperextensão' },
    { p: 'O teu joelho estende-se um pouco além da linha recta e tende a «bloquear» para trás, sobretudo quando estás muito tempo de pé. Não precisas de andar com os joelhos dobrados: o objectivo é ganhares controlo.' },
    { img: 'g02', alt: 'Alinhamento corporal, vista lateral' },
    { list: [
      'Em pé, mantém os joelhos «macios», sem os empurrar para trás.',
      'Os músculos da coxa (frente e trás), os glúteos e os gémeos ajudam a estabilizar o joelho.',
      'Os exercícios de força e de equilíbrio treinam esse controlo.'
    ] },
    { note: 'Há poucos estudos sobre exercícios para joelho recurvado em adultos. As recomendações vêm sobretudo da prática clínica: fortalecer, treinar o equilíbrio e evitar bloquear o joelho. Força e controlo podem melhorar a função sem alterar a anatomia.' }
  ] },
  { id: 'pe', titulo: 'Pé plano flexível', blocks: [
    { p: 'No pé plano flexível o arco baixa quando carregas peso e recupera quando o pé está livre. É frequente nos adultos e nem sempre causa problemas.' },
    { list: [
      'Se os pés se cansam, ajuda treinar os músculos do pé e do tornozelo e usar calçado estável.',
      'O short foot é o exercício mais estudado para o arco.',
      'Palmilhas podem aliviar o cansaço, mas a evidência é limitada e não são obrigatórias.'
    ] },
    { note: 'Os estudos têm resultados mistos: numa meta-análise, só os programas com mais de 6 semanas mostraram melhoria. Treinar melhora o controlo e a resistência, mas não garante que o arco mude de forma.' }
  ] },
  { id: 'lombar', titulo: 'Lombar e discos', blocks: [
    { p: 'O desgaste nos discos é comum e nem sempre corresponde à intensidade da dor. Não significa que a coluna seja frágil nem que tenhas de deixar o exercício.' },
    { list: [
      'As orientações clínicas (NICE) recomendam, como primeiro passo, manteres-te activa e fazeres exercício, de qualquer tipo: força, aeróbico, alongamentos ou yoga.',
      'Manter as actividades normais, adaptadas à dor, é melhor do que repouso prolongado.',
      'Cintas e ortóteses do pé não são recomendadas para tratar a dor lombar.',
      'Quando tens dor, reduz as cargas e os movimentos que a agravam, sobretudo dobrar ou rodar a lombar com peso. É temporário.'
    ] },
    { note: 'Se o teu fisioterapeuta te der uma indicação, ela tem prioridade sobre este guia.' }
  ] },
  { id: 'trabalho', titulo: 'Trabalhar muitas horas de pé', blocks: [
    { img: 'g04', alt: 'Postura em pé ao balcão: correcta e incorrecta' },
    { list: [
      'Evita manter os joelhos bloqueados para trás.',
      'Alterna o apoio entre os pés e dá alguns passos.',
      'Senta-te um momento sempre que possível.',
      'Um apoio baixo e firme para um pé pode aliviar a lombar. Não uses se te desequilibrar ou incomodar.',
      'Um banco alto e um tapete antifadiga podem ajudar.'
    ] },
    { img: 'g05', alt: 'Apoio de um pé num degrau baixo' }
  ] },
  { id: 'calcado', titulo: 'Calçado e palmilhas', blocks: [
    { list: [
      'Escolhe calçado confortável, com calcanhar estável e espaço para os dedos.',
      'Palmilhas podem ajudar quando há dor ou cansaço, mas não corrigem necessariamente o arco.'
    ] }
  ] },
  { id: 'casa', titulo: 'Em casa e a dormir', blocks: [
    { list: [
      'Reduz os períodos contínuos de pé e adapta as alturas de trabalho.',
      'Ao dormir de lado, experimenta uma almofada entre os joelhos. De costas, uma almofada por baixo dos joelhos. Só se aliviar.',
      'Evita alongamentos agressivos da parte de trás da coxa em joelhos hipermóveis e não forces a lombar em flexão profunda.'
    ] }
  ] },
  { id: 'desporto', titulo: 'Desporto e actividade', blocks: [
    { list: [
      'Caminhar em piso regular é uma boa base. Ajusta a duração ao cansaço do trabalho.',
      'Bicicleta estática: boa opção, com o selim e a resistência bem ajustados.',
      'Natação: crawl e costas costumam ser mais confortáveis. Bruços e mariposa exigem mais da lombar e do pescoço, por isso evita-os no início e vê como te sentes.',
      'Corrida, saltos e mudanças bruscas de direcção não estão proibidos para sempre, mas pede mais controlo dos joelhos e da lombar.'
    ] },
    { note: 'Treinar com intensidade não está proibido. Ajusta ao que toleras.' }
  ] },
  { id: 'alertas', titulo: 'Sinais de alerta', blocks: [
    { p: 'Pára o exercício e pede avaliação se tiveres:' },
    { list: [
      'dor que agrava de forma persistente ou sintomas novos;',
      'dor que desce pela perna, com dormência ou perda de força.'
    ] },
    { alert: [
      'Vai de imediato a uma urgência se tiveres:',
      'dificuldade ou perda de controlo ao urinar ou ao evacuar;',
      'dormência na zona genital, no ânus ou nas nádegas;',
      'fraqueza nas pernas que piora depressa.'
    ] }
  ] },
  { id: 'fontes', titulo: 'Em que se baseia', blocks: [
    { list: [
      'NICE NG59: dor lombar e ciática (exercício e manter actividade).',
      'Meta-análises sobre o exercício short foot no pé plano (por exemplo Int J Environ Res Public Health, 2022).',
      'Para o joelho recurvado, prática clínica: não há estudos fortes em adultos.'
    ] },
    { note: 'Este guia é informativo e não substitui a avaliação do teu fisioterapeuta ou médico.' }
  ] }
];
