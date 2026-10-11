# Ilha da Caça Online

Jogo 3D multiplayer. Qualquer pessoa com o link joga junto, sem conta.

## Testar no seu computador
1. Instale o Node.js 18+ (nodejs.org).
2. Nesta pasta: `npm install` e depois `npm start`.
3. Abra http://localhost:3000 em duas abas para ver os dois jogadores.

## Colocar online (Render, plano gratuito)
1. Crie um repositório no GitHub e envie estes arquivos (package.json, server.js, public/index.html).
2. Em render.com: New > Web Service > escolha o repositório.
3. Build Command: `npm install`  ·  Start Command: `npm start`  ·  plano Free.
4. Quando terminar, o Render mostra um link (https://seu-jogo.onrender.com). Mande esse link aos amigos.

Observações:
- No plano gratuito o servidor "dorme" após alguns minutos sem uso; o primeiro acesso depois disso demora cerca de 1 minuto.
- Grupos separados: adicione `?sala=nome` ao link (ex.: .../?sala=amigos). Cada sala aceita até 16 jogadores.
- Dinheiro e armas ficam só no navegador de cada jogador e zeram ao recarregar a página.
