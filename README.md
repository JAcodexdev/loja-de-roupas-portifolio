# ASFALTO — Loja de streetwear (React + Vite)

E-commerce de demonstração de uma marca fictícia de streetwear de São Paulo. Tudo funciona na interface — carrinho, favoritos, login/cadastro, perfil, checkout e histórico de pedidos — com os dados salvos no `localStorage` do navegador. Não há backend, banco de dados nem pagamento real.

## Como rodar

Requisitos: **Node.js 18+** (recomendado 20 ou 22) e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:5173 (o navegador abre sozinho).

Outros comandos:

```bash
npm run build     # gera a versão de produção em /dist
npm run preview   # serve a versão de produção localmente
```

> As fotos vêm do Unsplash, então é preciso estar conectado à internet. Se alguma imagem não carregar, o site mostra um painel com a marca no lugar (nunca uma imagem quebrada).

## Conta de demonstração

- **E-mail:** `demo@asfalto.com`
- **Senha:** `asfalto123`

Ela já vem com um pedido no histórico. Na tela de login há um botão “Preencher conta demo”. Você também pode criar uma conta nova.

Cupom de teste no checkout: **`RUA10`** (10% off). No pagamento por cartão, qualquer número de 16 dígitos e validade futura funcionam.

Para zerar tudo, limpe os dados do site no navegador (ou rode `localStorage.clear()` no console).

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Landing: hero com parallax, lançamentos, categorias, mais vendidos (com abas), banner promocional com contagem regressiva, manifesto, coleção exclusiva Blackout, newsletter |
| `/loja` | Catálogo com busca, filtros (categoria, preço, tamanho, destaques) e ordenação. Filtros ficam na URL, ex.: `/loja?categoria=moletons&ordem=menor` |
| `/produto/:slug` | Galeria (miniaturas, setas, arrastar no celular, zoom no hover), cor, tamanho, quantidade, carrinho, favoritos, produtos relacionados |
| `/favoritos` | Lista de favoritos com remover e “adicionar todos ao carrinho” |
| `/conta` | Login/cadastro ou painel do usuário (pedidos, edição de dados e endereço, troca de senha, sair) |
| `/checkout` | Contato, endereço, frete, cartão ou Pix fictícios, cupom e resumo |
| `/pedido/:id` | Confirmação do pedido |
| `/info/:slug` | Sobre, FAQ, envio, trocas, guia de medidas, contato (formulário), loja física, termos, privacidade |

Atalho: **Ctrl/Cmd + K** abre a busca.

## Estrutura

```
src/
├── App.jsx                 # rotas + transição entre páginas
├── main.jsx
├── styles.css              # design system e estilos (CSS puro, responsivo)
├── context/StoreContext.jsx# carrinho, favoritos, contas, pedidos, toasts (localStorage)
├── data/products.js        # catálogo (24 produtos), categorias, cores, imagens
├── lib/utils.js            # formatação BRL, máscaras, frete, persistência
├── components/
│   ├── Header.jsx          # header, menu mobile animado
│   ├── SearchOverlay.jsx   # busca com resultados ao vivo
│   ├── CartDrawer.jsx      # carrinho lateral
│   ├── ProductCard.jsx     # card com troca de foto, favoritar e adicionar rápido
│   ├── Img.jsx             # imagem com skeleton e fallback
│   ├── Motion.jsx          # Reveal, Stagger, SplitLines, Page (Framer Motion)
│   ├── Newsletter.jsx, Footer.jsx, Toasts.jsx, Logo.jsx, ui.jsx
└── pages/                  # Home, Shop, Product, Favorites, Account, Checkout, OrderSuccess, Info, NotFound
```

## Tecnologias

React 19 · Vite · React Router · Motion (Framer Motion) · Lucide React · CSS moderno · localStorage

As animações respeitam a preferência de “reduzir movimento” do sistema operacional.

## Créditos

Fotografias: [Unsplash](https://unsplash.com) (licença Unsplash). Marca, produtos e endereços são fictícios.
