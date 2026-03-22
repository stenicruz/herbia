// Configurações de Rede
export const HOST = '192.168.0.104';
export const PORT = 3333;

// Configuração da IA (Servidor Flask/Python)
export const IA_URL = 'http://127.0.0.1:8000/predict';



// Estes dados irão pra bd
export const mapeamentoIA = {
  // === TOMATE (4 classes) ===
  'Tomate__Pinta_Bacteriana': {
    planta: 'Tomateiro',
    doenca: 'Pinta Bacteriana',
    estado: 'Doente',
    descricao: 'A sua planta tem manchas escuras pequenas nas folhas causadas por uma bactéria. As manchas têm uma borda amarela à volta. Esta doença espalha-se facilmente quando as folhas ficam molhadas.',
    caseiro: 'Não molhe as folhas quando rega — regue sempre pela base da planta. Retire e queime as folhas com manchas. Não trabalhe na planta quando está molhada para não espalhar a doença.',
    convencional: 'Pulverize com produtos à base de Cobre (Oxicloreto de Cobre). Em casos graves, associe com Mancozebe. Consulte um técnico agrícola para dosagem.'
  },
  'Tomate__Ferrugem_Precoce': {
    planta: 'Tomateiro',
    doenca: 'Mancha de Alternária',
    estado: 'Doente',
    descricao: 'A sua planta tem manchas castanhas redondas com anéis como um alvo nas folhas de baixo. A doença começa nas folhas velhas e sobe para cima. Aparece mais quando o tempo alterna entre chuva e sol.',
    caseiro: 'Retire as folhas afectadas da parte de baixo da planta. Coloque palha no chão à volta da planta para evitar que a terra salpique para as folhas. Regue sempre pela base.',
    convencional: 'Pulverize com Mancozebe ou Clorotalonil. Se a doença estiver avançada, use fungicidas sistémicos como Difenoconazol. Repita a cada 7-10 dias.'
  },
  'Tomate__Ferrugem_Tardia': {
    planta: 'Tomateiro',
    doenca: 'Míldio (Doença da Batata e Tomate)',
    estado: 'Doente',
    descricao: 'ATENÇÃO — Esta é uma doença muito grave! As folhas ficam com manchas gordurosas e escuras, e por baixo aparece um pó branco. Pode destruir toda a sua plantação em menos de 10 dias se não agir rapidamente.',
    caseiro: 'Retire imediatamente todas as folhas e ramos com manchas e queime-os longe da plantação. Aumente o espaço entre plantas para circular ar. Nunca regue por cima das folhas.',
    convencional: 'Trate urgentemente com fungicidas específicos: Metalaxil-M ou Mandipropamido. Alterne entre produtos diferentes para evitar resistência. Consulte um técnico agrícola com urgência.'
  },
  'Tomate__Saudavel': {
    planta: 'Tomateiro',
    doenca: 'Saudável',
    estado: 'Saudável',
    descricao: 'Boa notícia! A sua planta de tomate está saudável. As folhas estão verdes e sem manchas. Continue com os seus cuidados habituais.',
    caseiro: 'Continue a regar pela base, amarre os ramos para não caírem e retire os rebentos laterais regularmente. Visite a plantação pelo menos 2 vezes por semana para detectar problemas cedo.',
    convencional: 'N/A'
  },

  // === MILHO (4 classes) ===
  'Milho__Mancha_Cinzenta': {
    planta: 'Milho',
    doenca: 'Mancha Cinzenta das Folhas',
    estado: 'Doente',
    descricao: 'As folhas do seu milho têm manchas rectangulares cinzentas ou castanhas entre os nervos das folhas. Esta doença reduz a capacidade da planta de fazer fotossíntese e pode baixar muito a produção.',
    caseiro: 'Não plante milho no mesmo campo dois anos seguidos — alterne com outras culturas. Após a colheita, enterre ou queime os restos da planta para eliminar o fungo.',
    convencional: 'Pulverize com fungicidas Triazóis (Propiconazol ou Tebuconazol) assim que aparecerem as primeiras manchas nas folhas de baixo.'
  },
  'Milho__Ferrugem': {
    planta: 'Milho',
    doenca: 'Ferrugem do Milho',
    estado: 'Doente',
    descricao: 'As folhas do seu milho têm pequenas pústulas (bolhinhas) castanho-avermelhadas espalhadas em ambos os lados. É uma doença de fungo que aparece mais quando as noites são frescas e húmidas.',
    caseiro: 'Se possível, use sementes de variedades resistentes à ferrugem na próxima época. Garanta que a planta tem boa nutrição com potássio e fósforo para ser mais resistente.',
    convencional: 'Pulverize com fungicidas Triazóis ou a mistura Triazol + Estrobilurina quando a doença aparecer nas folhas de cima.'
  },
  'Milho__Doenca_Foliar': {
    planta: 'Milho',
    doenca: 'Helmintosporiose (Mancha Foliar)',
    estado: 'Doente',
    descricao: 'As folhas do seu milho têm manchas grandes em forma de charuto, de cor palha ou castanha, que podem ter até 15 cm de comprimento. Esta doença pode causar grandes perdas na produção se atingir as folhas de cima.',
    caseiro: 'Após a colheita, enterre todos os restos da planta. Não plante milho no mesmo campo por pelo menos 2 anos consecutivos.',
    convencional: 'Pulverize com Estrobilurinas ou Triazóis de forma preventiva ou nos primeiros sinais da doença. Use híbridos com resistência genética se disponíveis na sua região.'
  },
  'Milho__Saudavel': {
    planta: 'Milho',
    doenca: 'Saudável',
    estado: 'Saudável',
    descricao: 'Boa notícia! O seu milho está saudável. As folhas estão verdes e limpas. Continue com os seus cuidados habituais.',
    caseiro: 'Visite a plantação regularmente para detectar lagartas ou pulgões cedo. Garanta adubação com azoto dividida em duas aplicações.',
    convencional: 'N/A'
  },

  // === BATATA (3 classes) ===
  'Batata__Ferrugem_Precoce': {
    planta: 'Batateira',
    doenca: 'Mancha de Alternária',
    estado: 'Doente',
    descricao: 'As folhas da sua batateira têm manchas castanhas redondas com anéis concêntricos nas folhas mais velhas. A doença sobe progressivamente para as folhas novas. Aparece mais em plantas com falta de água ou nutrição.',
    caseiro: 'Retire e queime as folhas com manchas. Evite regar por cima das folhas. Certifique-se que a planta não tem falta de adubo.',
    convencional: 'Pulverize com Mancozebe ou Clorotalonil de forma preventiva. Comece os tratamentos depois do campo estar fechado.'
  },
  'Batata__Ferrugem_Tardia': {
    planta: 'Batateira',
    doenca: 'Míldio da Batateira',
    estado: 'Doente',
    descricao: 'ATENÇÃO — Esta é a doença mais destrutiva da batata! As folhas ficam com manchas encharcadas que crescem rapidamente e por baixo aparece um pó branco. Ataca também os tubérculos causando podridão interna. Pode destruir toda a sua plantação numa semana.',
    caseiro: 'Destrua imediatamente todas as plantas ou ramos infectados queimando-os longe da plantação. Melhore a drenagem do campo. Não plante em zonas com muito nevoeiro.',
    convencional: 'Trate urgentemente com Metalaxil-M, Fluopicolida ou Mandipropamido. Alterne entre produtos para evitar resistência. Consulte um técnico agrícola com urgência.'
  },
  'Batata__Saudavel': {
    planta: 'Batateira',
    doenca: 'Saudável',
    estado: 'Saudável',
    descricao: 'Boa notícia! A sua batateira está saudável. As folhas estão verdes e sem lesões. Continue com os seus cuidados habituais.',
    caseiro: 'Cubra bem os tubérculos com terra para os proteger da luz. Mantenha rega equilibrada e fique atento à presença de pulgões nas folhas.',
    convencional: 'N/A'
  },

  // === MANDIOCA (5 classes) ===
  'Mandioca__Bacteriose': {
    planta: 'Mandioca',
    doenca: 'Bacteriose da Mandioca',
    estado: 'Doente',
    descricao: 'As folhas da sua mandioca têm manchas encharcadas e os ramos podem murchar. Esta doença é causada por uma bactéria que pode matar ramos inteiros se não for controlada a tempo.',
    caseiro: 'Corte e queime todos os ramos infectados. Limpe as ferramentas de corte com lixívia diluída antes de usar noutra planta. Use sempre estacas saudáveis para plantar.',
    convencional: 'Pulverize com produtos à base de Cobre. Use sempre material de plantação certificado e livre de doenças.'
  },
  'Mandioca__Estria_Castanha': {
    planta: 'Mandioca',
    doenca: 'Doença das Estrias Castanhas (CBSD)',
    estado: 'Doente',
    descricao: 'As folhas da sua mandioca têm riscas amarelas e os nervos ficam com manchas castanhas. Esta doença viral pode apodrecer as raízes por dentro tornando-as impróprias para comer. É transmitida pela mosca-branca.',
    caseiro: 'Arranque e queime as plantas infectadas fora do campo. Coloque armadilhas amarelas pegajosas para apanhar moscas-brancas. Use sempre estacas saudáveis.',
    convencional: 'Não existe cura — a prevenção é essencial. Controle as moscas-brancas com inseticidas sistémicos. Use variedades resistentes se disponíveis na sua região.'
  },
  'Mandioca__Mottle_Verde': {
    planta: 'Mandioca',
    doenca: 'Vírus do Mottle Verde',
    estado: 'Doente',
    descricao: 'As folhas da sua mandioca têm um padrão verde irregular com zonas mais claras e mais escuras, e podem ficar deformadas. É uma doença viral que reduz o crescimento da planta e a produção de raízes.',
    caseiro: 'Retire as plantas muito afectadas para não contaminar as saudáveis. Use estacas de origem conhecida e saudável. Evite plantar em zonas com muitos insectos.',
    convencional: 'Controle os insectos vectores com inseticidas. Não existe tratamento curativo — a prevenção e o uso de material saudável são a melhor estratégia.'
  },
  'Mandioca__Mosaico': {
    planta: 'Mandioca',
    doenca: 'Mosaico da Mandioca (CMD)',
    estado: 'Doente',
    descricao: 'As folhas da sua mandioca têm manchas amarelas e verdes misturadas e ficam enrugadas e deformadas. Esta é a doença mais grave da mandioca em África e pode reduzir a produção de raízes em mais de 80%. É transmitida pela mosca-branca.',
    caseiro: 'Arranque e queime imediatamente as plantas infectadas. Use armadilhas amarelas para apanhar moscas-brancas. Nunca use estacas de plantas doentes para plantar.',
    convencional: 'Use variedades melhoradas resistentes ao mosaico (disponíveis no IITA). Controle as moscas-brancas com inseticidas. Use sempre material de plantação certificado.'
  },
  'Mandioca__Saudavel': {
    planta: 'Mandioca',
    doenca: 'Saudável',
    estado: 'Saudável',
    descricao: 'Boa notícia! A sua mandioca está saudável. As folhas estão verdes e bem desenvolvidas. Continue com os seus cuidados habituais.',
    caseiro: 'Controle as ervas daninhas regularmente especialmente nos primeiros meses. Visite a plantação com frequência para detectar moscas-brancas ou outros insectos cedo.',
    convencional: 'N/A'
  },

  // === DESCONHECIDO ===
  'Desconhecido': {
    planta: 'Não identificada',
    doenca: 'Não identificado',
    estado: 'N/A',
    descricao: 'Não conseguimos identificar a planta ou a doença na imagem. ',
    caseiro: 'N/A',
    convencional: 'N/A'
  }
};

