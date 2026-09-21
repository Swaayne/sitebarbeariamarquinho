# Barbearia do Marquinhos

Protótipo de uma página, com React, Next.js App Router e Tailwind CSS. O resultado é um site inteiramente estático, sem backend, cadastro ou banco de dados. O agendamento abre o WhatsApp.

## Desenvolvimento

Requisitos: Node.js 22.13+ e pnpm na versão de `packageManager` em `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview
```

Os arquivos prontos ficam em **`out/`**. `pnpm build` exporta o HTML e verifica as referências locais; um asset ausente impede que o build seja aprovado. `pnpm preview` serve os arquivos estáticos em `http://localhost:4173/`.

Para reproduzir uma publicação em subpasta, em um terminal Bash:

```sh
SITE_BASE_PATH=/qualquer-repositorio pnpm build
SITE_BASE_PATH=/qualquer-repositorio pnpm preview
```

No PowerShell, use `$env:SITE_BASE_PATH="/qualquer-repositorio"` antes desses comandos. Para voltar à raiz, remova essa variável. Nos serviços de hospedagem, ela já é configurada automaticamente.

## Onde editar

| Conteúdo | Arquivo |
| --- | --- |
| Contatos, preços, serviços, fotos, equipe e FAQ | `content/site.ts` |
| Seções e textos de apresentação | `app/page.tsx` |
| Cores, tipografia, animações e responsividade | `app/globals.css` |
| Título, descrição, Open Graph, favicon e indexação | `app/layout.tsx` |
| Fotografias, fontes locais e favicon | `public/` |
| Perguntas para o cliente | `FEEDBACK.md` |

As fotos, preços, equipe e avaliações continuam identificados como provisórios. A flag `site.draft` continua ativada; a aprovação dos dados e textos é uma etapa separada da correção do deploy.

Os arquivos de `public/` são usados pelo código por meio de `assetPath("images/arquivo.webp")`. Evite escrever `/images/...` diretamente em componentes. As fontes são importadas pelo CSS e recebem seus caminhos no build.

Veja **[DEPLOY.md](DEPLOY.md)** para publicar, atualizar e configurar domínio próprio; **[VERIFICACAO.md](VERIFICACAO.md)** registra o diagnóstico e os testes.
