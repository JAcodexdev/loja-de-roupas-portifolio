// Catálogo fictício da ASFALTO. Imagens: Unsplash (licença livre).
export const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const CATEGORIES = [
  { slug: 'camisetas', name: 'Camisetas', image: '1618453292459-53424b66bb6a', blurb: 'Algodão pesado, caimento oversized.' },
  { slug: 'calcas', name: 'Calças', image: '1511794322962-129ddbd0af38', blurb: 'Cargo, baggy e denim cru.' },
  { slug: 'moletons', name: 'Moletons', image: '1677538537484-324385aff147', blurb: 'Felpa 480g, capuz estruturado.' },
  { slug: 'jaquetas', name: 'Jaquetas', image: '1774413768903-057eb084133b', blurb: 'Bombers, denim e couro.' },
  { slug: 'acessorios', name: 'Acessórios', image: '1588850561407-ed78c282e89b', blurb: 'Bonés, bags e detalhes.' },
]

export const COLORS = {
  preto: { name: 'Preto', hex: '#111111' },
  branco: { name: 'Off-white', hex: '#efede6' },
  cinza: { name: 'Cinza mescla', hex: '#9b9b97' },
  grafite: { name: 'Grafite', hex: '#3b3b3b' },
  areia: { name: 'Areia', hex: '#cdbb9b' },
  marrom: { name: 'Café', hex: '#5b4232' },
  oliva: { name: 'Oliva', hex: '#5d6146' },
  laranja: { name: 'Sinal', hex: '#ff4f1a' },
  indigo: { name: 'Índigo', hex: '#2c3a57' },
  lavado: { name: 'Lavado', hex: '#8ea3bd' },
  camuflado: { name: 'Camuflado', hex: '#6b6a4c' },
}

export const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG']

const p = (o) => ({
  sizesAvailable: o.sizes,
  oldPrice: null,
  isNew: false,
  collection: null,
  ...o,
})

export const PRODUCTS = [
  // CAMISETAS
  p({
    id: 'p01', slug: 'camiseta-oversized-concrete', name: 'Camiseta Oversized Concrete', category: 'camisetas',
    price: 189.9, sold: 1840, rating: 4.9, isNew: false, collection: 'blackout',
    images: ['1618354691373-d851c5c3a990', '1618453292459-53424b66bb6a', '1583743814966-8936f5b7be1a'],
    colors: ['preto', 'grafite', 'branco'], sizes: ['P', 'M', 'G', 'GG', 'XGG'], sizesOut: ['XGG'],
    description: 'A base de todo guarda-roupa urbano. Malha 100% algodão penteado de 260g/m², ombro caído, gola canelada de 2,5 cm que não deforma e barra reta. Lavada com enzimas para toque macio desde o primeiro uso.',
    details: ['100% algodão penteado 260g/m²', 'Modelagem oversized — escolha seu tamanho habitual', 'Pré-encolhida', 'Produzida em São Paulo'],
  }),
  p({
    id: 'p02', slug: 'camiseta-heavy-blank', name: 'Camiseta Heavy Blank', category: 'camisetas',
    price: 149.9, sold: 2210, rating: 4.8,
    images: ['1581655353564-df123a1eb820', '1574180566232-aaad1b5b8450', '1622445275463-afa2ab738c34'],
    colors: ['branco', 'preto', 'areia'], sizes: ['PP', 'P', 'M', 'G', 'GG'],
    description: 'Camiseta lisa de gramatura pesada para quem prefere o essencial bem feito. Corte boxy, mangas levemente alongadas e costura dupla em todas as barras.',
    details: ['100% algodão 240g/m²', 'Corte boxy', 'Costura dupla reforçada', 'Etiqueta estampada (sem coceira)'],
  }),
  p({
    id: 'p03', slug: 'camiseta-grafite-sinal', name: 'Camiseta Grafite Sinal', category: 'camisetas',
    price: 219.9, sold: 960, rating: 4.7, isNew: true,
    images: ['1787682912838-4d0edf47cfbe', '1636047250452-6772f6144b3d'],
    colors: ['branco', 'preto'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Estampa frontal em silk à base d’água inspirada nas placas de sinalização da Marginal. Toque zero e cores que resistem a dezenas de lavagens.',
    details: ['Silk à base d’água', 'Algodão 240g/m²', 'Oversized', 'Edição numerada drop 07'],
  }),
  p({
    id: 'p04', slug: 'longsleeve-static', name: 'Longsleeve Static', category: 'camisetas',
    price: 229.9, oldPrice: 279.9, sold: 640, rating: 4.6,
    images: ['1620799140408-edc6dcb6d633', '1521572163474-6864f9cf17ab'],
    colors: ['branco', 'cinza'], sizes: ['P', 'M', 'G', 'GG'], sizesOut: ['P'],
    description: 'Manga longa com punhos canelados e caimento relaxado. Funciona sozinha no outono ou como camada por baixo de jaquetas e coletes.',
    details: ['Algodão 220g/m²', 'Punhos canelados', 'Modelagem regular-larga'],
  }),
  p({
    id: 'p05', slug: 'pack-essentials-3', name: 'Pack Essentials (3 un.)', category: 'camisetas',
    price: 359.9, oldPrice: 449.7, sold: 1320, rating: 4.9,
    images: ['1562157873-818bc0726f68', '1650287052182-a13d8245c927'],
    colors: ['preto', 'branco', 'cinza'], sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    description: 'Três camisetas Heavy Blank nas cores-base da marca. A forma mais inteligente de renovar o básico — e economizar 20%.',
    details: ['3 camisetas 240g/m²', 'Cores sortidas: preto, off-white e cinza', 'Economia de 20%'],
  }),

  // CALÇAS
  p({
    id: 'p06', slug: 'calca-cargo-tactical', name: 'Calça Cargo Tactical', category: 'calcas',
    price: 349.9, sold: 1510, rating: 4.8, isNew: true,
    images: ['1511794322962-129ddbd0af38', '1548883354-7622d03aca27', '1584302052177-2e90841dad6a'],
    colors: ['marrom', 'oliva', 'preto'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Sarja ripstop com seis bolsos, joelho articulado e barra com cordão regulável para usar reta ou ajustada no tornozelo.',
    details: ['Sarja ripstop 100% algodão', '6 bolsos funcionais', 'Barra com cordão regulável', 'Cintura com elástico interno'],
  }),
  p({
    id: 'p07', slug: 'jeans-baggy-washed', name: 'Jeans Baggy Washed', category: 'calcas',
    price: 389.9, sold: 1190, rating: 4.7,
    images: ['1542272604-787c3835535d', '1602293589930-45aad59ba3ab', '1582552938357-32b906df40cb'],
    colors: ['lavado', 'indigo'], sizes: ['P', 'M', 'G', 'GG'], sizesOut: ['P'],
    description: 'Modelagem baggy anos 90 com lavagem stone feita peça a peça. Cintura média, gancho baixo e perna ampla até a barra.',
    details: ['Denim 13 oz', 'Lavagem stone artesanal', 'Rebites de cobre envelhecido'],
  }),
  p({
    id: 'p08', slug: 'calca-track-noir', name: 'Calça Track Noir', category: 'calcas',
    price: 279.9, sold: 870, rating: 4.6, collection: 'blackout',
    images: ['1584302052153-623ee529b70c', '1586231912972-d0970f9ce787'],
    colors: ['preto'], sizes: ['PP', 'P', 'M', 'G', 'GG'],
    description: 'Calça de tactel fosco com forro em tela, zíper lateral na barra e faixa refletiva discreta. Do treino ao rolê sem trocar de roupa.',
    details: ['Tactel fosco com forro', 'Detalhe refletivo', 'Zíper na barra'],
  }),
  p({
    id: 'p09', slug: 'jeans-raw-selvedge', name: 'Jeans Raw Selvedge', category: 'calcas',
    price: 459.9, sold: 410, rating: 4.9,
    images: ['1714143136372-ddaf8b606da7', '1604176354204-9268737828e4', '1637069585336-827b298fe84a'],
    colors: ['indigo'], sizes: ['M', 'G', 'GG'],
    description: 'Denim cru selvedge de 14 oz, sem lavagem: ele ganha marcas únicas conforme o seu uso. Corte reto e acabamento ourela visível na barra.',
    details: ['Denim selvedge 14 oz', 'Sem lavagem (raw)', 'Corte reto', 'Botões personalizados'],
  }),

  // MOLETONS
  p({
    id: 'p10', slug: 'moletom-hood-fog', name: 'Moletom Hood Fog', category: 'moletons',
    price: 399.9, sold: 2030, rating: 4.9,
    images: ['1556821840-3a63f95609a7', '1564557287817-3785e38ec1f5'],
    colors: ['cinza', 'preto'], sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    description: 'Nosso moletom mais vendido. Felpa americana de 480g, capuz duplo que mantém a forma e bolso canguru com abertura reforçada.',
    details: ['Felpa 480g/m²', 'Capuz forrado duplo', 'Punhos e barra em ribana 2x1'],
  }),
  p({
    id: 'p11', slug: 'hoodie-midnight', name: 'Hoodie Midnight', category: 'moletons',
    price: 429.9, sold: 1660, rating: 4.8, collection: 'blackout', isNew: true,
    images: ['1677538537484-324385aff147', '1647797819874-f51a8a8fc5c0', '1513789181297-6f2ec112c0bc'],
    colors: ['preto'], sizes: ['P', 'M', 'G', 'GG'], sizesOut: ['GG'],
    description: 'Preto total, do cordão ao ilhós. Bordado tom sobre tom nas costas e modelagem boxy com ombro caído. Peça central da coleção Blackout.',
    details: ['Felpa 480g/m²', 'Bordado tom sobre tom', 'Ilhoses foscos', 'Coleção Blackout'],
  }),
  p({
    id: 'p12', slug: 'hoodie-cloud', name: 'Hoodie Cloud', category: 'moletons',
    price: 399.9, oldPrice: 469.9, sold: 720, rating: 4.7,
    images: ['1615397587950-3cbb55f95b77', '1601063476271-a159c71ab0b3', '1620799140188-3b2a02fd9a77'],
    colors: ['branco', 'areia'], sizes: ['PP', 'P', 'M', 'G'],
    description: 'Off-white com tingimento natural e textura flanelada por dentro. Leve o bastante para o fim de tarde, quente o suficiente para a madrugada.',
    details: ['Algodão orgânico', 'Interior flanelado', 'Tingimento natural'],
  }),
  p({
    id: 'p13', slug: 'moletom-crew-dune', name: 'Moletom Crew Dune', category: 'moletons',
    price: 329.9, sold: 530, rating: 4.6,
    images: ['1578768079052-aa76e52ff62e', '1624223237138-21a37e61dec0'],
    colors: ['marrom', 'areia', 'branco'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Gola careca com recorte raglan e ribanas largas. Tons terrosos que combinam com tudo o que você já tem.',
    details: ['Felpa 400g/m²', 'Manga raglan', 'Ribanas largas'],
  }),

  // JAQUETAS
  p({
    id: 'p14', slug: 'bomber-night-shift', name: 'Bomber Night Shift', category: 'jaquetas',
    price: 589.9, sold: 980, rating: 4.9, isNew: true, collection: 'blackout',
    images: ['1774413768903-057eb084133b', '1774413769417-29fde33e368b', '1591047139829-d91aecb6caea'],
    colors: ['preto', 'oliva'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Bomber de nylon acetinado com enchimento leve, forro laranja sinal e bolso utilitário na manga. Feita para atravessar a cidade de madrugada.',
    details: ['Nylon acetinado repelente à água', 'Forro em cor sinal', 'Bolso na manga com zíper', 'Ribanas listradas'],
  }),
  p({
    id: 'p15', slug: 'jaqueta-denim-trucker', name: 'Jaqueta Denim Trucker', category: 'jaquetas',
    price: 459.9, sold: 760, rating: 4.7,
    images: ['1611312449408-fcece27cdbb7', '1555583743-991174c11425', '1614699745279-2c61bd9d46b5'],
    colors: ['lavado', 'indigo'], sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    description: 'A trucker clássica, reconstruída com corte mais curto e mangas amplas. Denim 12 oz com lavagem média e botões metálicos personalizados.',
    details: ['Denim 12 oz', 'Corte cropped', 'Botões metálicos ASFALTO'],
  }),
  p({
    id: 'p16', slug: 'jaqueta-couro-asfalto', name: 'Jaqueta Couro Asfalto', category: 'jaquetas',
    price: 1199.9, sold: 220, rating: 5.0, collection: 'blackout',
    images: ['1602525582399-7ef5f604ff7e', '1551028719-00167b16eac5'],
    colors: ['preto'], sizes: ['M', 'G', 'GG'], sizesOut: ['M'],
    description: 'Couro legítimo curtido ao vegetal com acabamento fosco. Zíperes YKK, forro em cetim e caimento reto que atravessa décadas.',
    details: ['Couro bovino curtido ao vegetal', 'Zíperes YKK Excella', 'Forro em cetim', 'Edição limitada'],
  }),
  p({
    id: 'p17', slug: 'varsity-club-26', name: 'Varsity Club 26', category: 'jaquetas',
    price: 649.9, oldPrice: 749.9, sold: 590, rating: 4.8,
    images: ['1774413768774-a499f1bd8e32', '1774413768759-d3cc719c1a0e'],
    colors: ['preto', 'areia'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Jaqueta universitária com corpo em lã batida, mangas em sintético e patches bordados à mão. Uma homenagem aos clubes de bairro.',
    details: ['Lã batida + mangas sintéticas', 'Patches bordados', 'Botões de pressão'],
  }),
  p({
    id: 'p18', slug: 'windbreaker-ember', name: 'Windbreaker Ember', category: 'jaquetas',
    price: 419.9, sold: 450, rating: 4.6, isNew: true,
    images: ['1578854955076-970394ef2512', '1629353689974-af4d5c70440f'],
    colors: ['laranja', 'oliva'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Corta-vento ultraleve que dobra dentro do próprio bolso. Capuz embutido na gola e ventilação nas costas.',
    details: ['Nylon 40D', 'Dobra no próprio bolso', 'Capuz embutido'],
  }),

  // ACESSÓRIOS
  p({
    id: 'p19', slug: 'bone-six-panel', name: 'Boné Six Panel', category: 'acessorios',
    price: 139.9, sold: 1980, rating: 4.8,
    images: ['1588850561407-ed78c282e89b', '1521369909029-2afed882baee', '1534215754734-18e55d13e346'],
    colors: ['branco', 'cinza', 'preto'], sizes: ['Único'],
    description: 'Seis gomos em sarja lavada, aba pré-curvada e fivela metálica regulável. Bordado ASFALTO discreto na lateral.',
    details: ['Sarja lavada', 'Fivela metálica', 'Tamanho único ajustável'],
  }),
  p({
    id: 'p20', slug: 'bucket-camo', name: 'Bucket Camo', category: 'acessorios',
    price: 159.9, sold: 610, rating: 4.7, isNew: true,
    images: ['1788517638620-8d1b5098c08e', '1760667711621-c964114f4838'],
    colors: ['camuflado', 'preto'], sizes: ['P/M', 'G/GG'],
    description: 'Bucket hat em ripstop camuflado com ilhoses de ventilação e forro interno em algodão.',
    details: ['Ripstop camuflado', 'Ilhoses de ventilação', 'Forro em algodão'],
  }),
  p({
    id: 'p21', slug: 'tote-canvas-heavy', name: 'Tote Canvas Heavy', category: 'acessorios',
    price: 119.9, sold: 880, rating: 4.6,
    images: ['1544816155-12df9643f363', '1574365569389-a10d488ca3fb', '1630381260512-e3fe55c11973'],
    colors: ['areia', 'branco'], sizes: ['Único'],
    description: 'Lona 16 oz com alças longas para usar no ombro, bolso interno com zíper e fundo reforçado. Cabe notebook de até 15".',
    details: ['Lona 16 oz', 'Bolso interno com zíper', 'Cabe notebook 15"'],
  }),
  p({
    id: 'p22', slug: 'oculos-shade-01', name: 'Óculos Shade 01', category: 'acessorios',
    price: 249.9, oldPrice: 299.9, sold: 520, rating: 4.5,
    images: ['1572307480813-ceb0e59d8325', '1511499767150-a48a237f0083'],
    colors: ['preto'], sizes: ['Único'],
    description: 'Armação em acetato com lentes polarizadas UV400 e hastes com núcleo metálico. Acompanha estojo rígido.',
    details: ['Acetato', 'Lentes polarizadas UV400', 'Estojo rígido incluso'],
  }),
  p({
    id: 'p23', slug: 'gorro-rib-knit', name: 'Gorro Rib Knit', category: 'acessorios',
    price: 99.9, sold: 740, rating: 4.7,
    images: ['1612029938221-a01e8c947edb'],
    colors: ['laranja', 'preto', 'cinza'], sizes: ['Único'],
    description: 'Gorro em tricô canelado de lã merino com barra dobrada. Quente, respirável e sem pinicar.',
    details: ['Lã merino + acrílico', 'Tricô canelado', 'Etiqueta bordada'],
  }),
  p({
    id: 'p24', slug: 'mochila-transit', name: 'Mochila Transit', category: 'acessorios',
    price: 379.9, sold: 430, rating: 4.8, collection: 'blackout',
    images: ['1553062407-98eeb64c6a62'],
    colors: ['preto'], sizes: ['Único'],
    description: 'Mochila de 22 litros em cordura com compartimento acolchoado para notebook, bolso anti-furto nas costas e alças ergonômicas.',
    details: ['Cordura 600D', '22 litros', 'Bolso anti-furto', 'Compartimento para notebook 16"'],
  }),
].map((prod) => ({ ...prod, sizesOut: prod.sizesOut || [] }))

export const LOOKS = {
  hero: '1523398002811-999ca8dec234',
  heroAlt: '1576775068668-c147f14c36f7',
  promo: '1721637635502-b0abaaa75edb',
  blackout: '1586231912972-d0970f9ce787',
  blackout2: '1721637686340-de9f8cebda5a',
  blackout3: '1532332248682-206cc786359f',
  newsletter: '1575818184258-1ceb64f40ff8',
  store: '1559406041-c7d2b2e98690',
}

export const getProduct = (slug) => PRODUCTS.find((x) => x.slug === slug)
export const getById = (id) => PRODUCTS.find((x) => x.id === id)
export const categoryName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug
