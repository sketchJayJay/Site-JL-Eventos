# Site JL Eventos

Site estático com calculadora de orçamento para eventos.

## Como alterar preços
Abra o arquivo `config.js` e edite os valores:

- Painel de LED: `precoMetro: 250`
- Moving Beam 9R: `preco: 150`
- Atomic / Strobo: `preco: 100`
- Pista Paris 4x4: `preco: 1000`

## WhatsApp
No arquivo `config.js`, altere:

```js
whatsapp: "5532984285414"
```

Use sempre DDI + DDD + número, sem espaço e sem traços.

## Coolify
Este pacote já tem `Dockerfile` e `nginx.conf`.
No Coolify, crie um app com Dockerfile apontando para este projeto.
