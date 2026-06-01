# Site JL Eventos

Site estático com calculadora de orçamento em tempo real, vídeos demonstrativos e envio do orçamento pelo WhatsApp.

## Como subir no Coolify

- Build Pack: Dockerfile
- Porta: 80
- Variáveis de ambiente: não precisa colocar nenhuma

## Onde alterar preços e WhatsApp

Edite o arquivo `config.js`.

Exemplos:

```js
whatsapp: "5532984285414"
precoMetro: 250
preco: 150
preco: 100
preco: 1000
```

## Como trocar os vídeos demonstrativos

Os vídeos ficam em:

```txt
assets/videos/
```

Para trocar pelos vídeos reais da JL Eventos, substitua os arquivos mantendo os mesmos nomes:

- `painel-led.mp4`
- `moving-beam-9r.mp4`
- `atomic-strobo.mp4`
- `pista-paris-4x4.mp4`
- `som-ambiente.mp4`
- `microfone-sem-fio.mp4`

Também pode trocar as capas `.jpg` com os mesmos nomes.

Formato recomendado: MP4 horizontal, 1280x720 ou 1920x1080, até 30 segundos.
