This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## CRM e API de Conversões da Meta

A hospedagem usa Node 22, `npm ci` para instalar dependências, `npm run build` para compilar e `npm run start` para executar o servidor Next.js, conforme `nixpacks.toml`.

A configuração local está em `.env.local`, que é ignorado pelo Git. `.env.example` documenta as variáveis sem credenciais reais.

Na hospedagem, configure as mesmas variáveis do ambiente local:

| Variável | Finalidade |
| --- | --- |
| `WEBHOOK_LEADS_URL` | URL principal do CRM com o token do webhook. Tem prioridade quando configurada. |
| `META_ACCESS_TOKEN` | Token privado da API de Conversões. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Mesmo pixel para o navegador e para a API de Conversões. |
| `META_GRAPH_API_VERSION` | Versão da API Graph, atualmente `v26.0`. |
| `META_TEST_EVENT_CODE` | Opcional, somente para validar eventos no painel de testes da Meta. |
| `WEBHOOK_SUPABASE_URL` | CRM principal quando `WEBHOOK_LEADS_URL` não estiver configurada; destino secundário quando as duas URLs forem diferentes. |

É necessário configurar pelo menos uma das URLs de webhook. A configuração existente do EasyPanel com apenas `WEBHOOK_SUPABASE_URL` é compatível. `META_ACCESS_TOKEN` ativa os eventos pelo servidor; sua ausência não bloqueia o cadastro no CRM nem o evento do pixel.

Depois de configurar as variáveis na hospedagem, faça um novo build e reinicie o serviço. O ID público do pixel é definido durante o build; os tokens são usados somente no servidor.

O CRM recebe os dados do cadastro, as respostas do quiz, as UTMs e o ID do evento. Depois da confirmação do CRM, o servidor envia `Lead` para a API de Conversões, e o navegador envia `Lead` pelo pixel com o mesmo ID para deduplicação. E-mail, telefone, nome e localização são normalizados e enviados à Meta com SHA-256; os identificadores de clique e navegador mantêm o formato exigido pela Meta.

Uma falha no CRM bloqueia os dois eventos e permite tentar novamente. Uma falha na Meta mantém o cadastro recebido pelo CRM e o evento do navegador; a resposta da API informa `meta_sent: false`.

Para validar a API de Conversões, copie o código em **Gerenciador de Eventos → Testar eventos → Eventos do servidor** para `META_TEST_EVENT_CODE`. Remova essa variável ao terminar o teste para que os novos eventos sejam enviados para produção.

`npm test` verifica os cenários de sucesso, falha, deduplicação e normalização usando respostas simuladas, sem enviar cadastros aos serviços externos.
