# Diagnóstico e validação do deploy

## Causa encontrada nos arquivos reais

O repositório originalmente continha a exportação do Vinext: `index.html`, `index.rsc`, `vinext-client-entry-manifest.json`, `_next/static`, imagens e fontes. Não continha o código-fonte nem o build automatizado.

No HTML havia URLs absolutas como `/_next/static/css/index.CBYpuVYA.css`, `/_next/static/chunks/index-CTZMJ9tY.js`, `/images/hero.webp` e `/favicon.svg`. O CSS apontava para `/fonts/barlow.ttf`, `/fonts/inter-400.ttf` e `/fonts/inter-600.ttf`. Em um Project Site, essas referências procuram os arquivos na raiz de `USUARIO.github.io`, fora da pasta do repositório. Também não existia `.nojekyll`, necessário para preservar pastas iniciadas com `_` ao usar Jekyll.

Os arquivos visuais do repositório foram comparados com a exportação original: eram os mesmos. Isso permitiu recuperar o código correspondente sem substituir o design.

## Correção

- Código React/App Router original recuperado, incluindo os componentes de menu, galeria e FAQ.
- Build de produção passou a usar o Next.js já presente nas dependências, com `output: "export"`, `trailingSlash`, `basePath` e `assetPrefix`.
- A versão original do Vinext foi testada com subpasta: terminou sem `index.html` e gerou 404. O build nativo Next.js gerou corretamente a página estática no mesmo cenário.
- `lib/asset-path.ts` aplica o prefixo às imagens e ao favicon tanto no HTML quanto no JavaScript.
- Fontes locais entram no processo de build pelo CSS, recebendo arquivos com hash e caminhos corretos.
- GitHub Actions descobre o prefixo em `configure-pages`; Netlify usa a raiz. Nenhum nome de repositório ou domínio está fixado no código.
- Artefatos antigos foram substituídos pelo código-fonte. Imagens, fontes, favicon e suas licenças foram preservados em `public/`. `index.rsc` e o manifesto Vinext antigos deixam de ser usados porque pertenciam ao runtime anterior; o novo export gera os arquivos necessários ao Next.js.

## Testes executados

- Build estático Next.js na raiz: passou, incluindo TypeScript.
- Build estático Next.js com `/repositorio-de-teste`: passou, incluindo TypeScript.
- Verificador de HTML, CSS, scripts, fontes, imagens, favicon, âncoras e referências dos manifestos/RSC: passou nos dois cenários.
- Servidor HTTP estático, sem fallback de SPA: a página e todos os assets diretamente referenciados pelo HTML/CSS responderam HTTP 200 na raiz e na subpasta.
- Comparação do texto visível, seções, links e imagens do HTML: idênticos à versão anterior.
- `app/page.tsx`: idêntico ao original.
- CSS: idêntico ao original, exceto pelos caminhos das fontes.
- Bytes de todas as imagens, fontes e favicon: idênticos aos originais.

A prévia local de navegador não iniciou neste ambiente por uma limitação de acesso às dependências. Os testes locais acima não equivalem a uma sessão interativa em um celular real. Após publicar, confira menu mobile, galeria, FAQ e abertura do WhatsApp no aparelho.

## Validação automática em cada alteração

`pnpm build` executa `scripts/check-assets.mjs` após a exportação. O comando falha se encontrar asset inexistente, caminho que escape da subpasta configurada ou âncora sem destino. O workflow do GitHub valida a raiz e a configuração real do Pages antes de publicar.

Para conferir uma exportação separadamente:

```sh
node scripts/check-assets.mjs out
node scripts/check-assets.mjs out /nome-da-subpasta
```

Use o segundo comando somente se essa exportação tiver sido gerada com a subpasta indicada.
