# Chess Classification 🏆

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)

Script em Node.js que automatiza a classificação de uma copa de xadrez do Clube de Xadrez Erbo Stenzel.

## O que ele faz

1. Busca a lista de membros do clube na **API pública do Chess.com**.
2. Para cada membro, busca a classificação em cada etapa da IV Copa Alexandre Direne.
3. Converte cada colocação em pontos de acordo com uma tabela de pontuação por posição.
4. Soma as pontuações e salva a classificação final em **CSV** (e JSON).

Antes disso, a soma era feita à mão, etapa por etapa.

## Tecnologias

- Node.js
- `chess-web-api` e `node-fetch` para consumir a API do Chess.com
- `json2csv` para gerar a planilha
- `cli-progress` para mostrar o progresso no terminal

## Como rodar

```bash
npm install
npm start
```

O `npm start` executa a coleta (`index.js`) e depois a conversão para CSV (`result2csv.js`).

## Autor

Rafael Lopes ([@RafLopes](https://github.com/RafLopes))
