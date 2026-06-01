# JL Eventos Pro

Site estático para a JL Eventos com calculadora de orçamento, vídeos demonstrativos, pacotes prontos, galeria, depoimentos, reserva por WhatsApp, impressão/PDF de orçamento, modelo simples de contrato e área administrativa local.

## Como subir no Coolify

- Build Pack: Dockerfile
- Porta: 80
- Variáveis de ambiente: nenhuma obrigatória

## Como editar preços pelo site

Acesse a seção **Admin** no final da página.

Senha padrão:

```txt
JL2026
```

A área admin salva as alterações no navegador usando localStorage. Isso é útil para ajustes rápidos, mas não é um painel com banco de dados. Para um painel real com login e banco, é preciso uma versão backend.

## Como editar direto no código

Abra o arquivo:

```txt
config.js
```

Ali você muda WhatsApp, preços, itens, pacotes, galeria, depoimentos e cláusulas do contrato.

## Como trocar vídeos demonstrativos

Substitua os arquivos dentro de:

```txt
assets/videos/
```

Principais nomes usados:

```txt
painel-led.mp4
moving-beam-9r.mp4
atomic-strobo.mp4
pista-paris-4x4.mp4
som-ambiente.mp4
microfone-sem-fio.mp4
```

Também existem imagens poster `.jpg`. Elas aparecem antes do vídeo carregar.

## PDF

O botão **Gerar PDF / imprimir** abre a impressão do navegador. Na janela que abrir, escolha **Salvar como PDF**.

## Contrato

O contrato é um modelo simples gerado pelos dados do orçamento. Revise sempre antes de usar com cliente.
