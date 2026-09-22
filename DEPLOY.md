# Publicação no GitHub Pages e no Netlify

O mesmo repositório alimenta os dois serviços. Eles compilam o código e publicam a pasta `out/`. Não envie o ZIP antigo nem arquivos compilados para a raiz do repositório.

## GitHub Pages: configuração inicial

1. Abra o repositório no GitHub.
2. Vá a **Settings → Pages → Build and deployment**.
3. Em **Source**, escolha **GitHub Actions**.
4. Na aba **Actions**, abra **Build and deploy static site** e clique em **Run workflow** se ele ainda não tiver rodado com essa configuração.
5. Aguarde os jobs `build` e `deploy` ficarem verdes. O endereço aparece em **Settings → Pages** e no ambiente `github-pages`.

O workflow `.github/workflows/pages.yml` roda a cada push para `main`. Ele testa o build na raiz e gera o build definitivo com o `base_path` informado pelo próprio GitHub. Assim, nomes de usuário, repositório e domínio não ficam escritos no código. Pull requests apenas compilam e validam, sem publicar.

O `.nojekyll` está em `public/` e é copiado para `out/`. O workflow envia diretamente o artefato estático, preservando `_next` e dispensando o Jekyll. O resultado não deve ser publicado com a opção antiga **Deploy from a branch**.

No repositório corrigido, o novo workflow já publicou com sucesso. Ainda apareceu também a execução antiga `pages build and deployment`: selecione **GitHub Actions** em **Source** para evitar duas publicações concorrentes. Essa configuração é feita uma vez no painel; não precisa ser repetida a cada push.

Se mudar o nome do repositório, rode o workflow novamente. Se mudar a branch principal de `main`, ajuste os dois filtros de branch do workflow e a branch de produção no Netlify.

## Netlify: configuração inicial

1. No painel do Netlify, escolha adicionar/importar um projeto existente e conecte o GitHub.
2. Selecione este repositório e a branch **main**.
3. Use estas opções:

| Campo | Valor |
| --- | --- |
| Base directory | Deixe vazio, para usar a raiz do repositório; equivalente a `.` |
| Package directory, se aparecer | Deixe vazio |
| Build command | `pnpm run build` |
| Publish directory | `out` |
| Functions directory | Deixe vazio |

4. Publique e aguarde o deploy terminar.

O arquivo `netlify.toml` já define esses valores, Node 22, `SITE_BASE_PATH=""` e `NETLIFY_NEXT_PLUGIN_SKIP="true"`. Essa última opção mantém a publicação estática, sem instalar um servidor Next.js no site. Se houver um plugin Next.js adicionado manualmente no painel, remova essa configuração manual e use a exportação estática definida no repositório.

Se o projeto já estiver conectado, confira esses campos em **Project configuration → Build & deploy**, especialmente o diretório de publicação. Substitua qualquer diretório antigo como `site-pronto`, `.next` ou `dist/client` por `out`.

Não há redirecionamento geral de todas as URLs para `index.html`: o site usa âncoras na mesma página e a exportação inclui uma página 404. Os assets com hash recebem cache longo, configurado no `netlify.toml`.

## Como atualizar

Se você já tinha uma cópia local anterior a esta correção, execute `git pull` antes de começar a editar, para receber o código e as configurações enviados ao GitHub. Preserve eventuais alterações locais antes de atualizar.

Altere o código ou os arquivos de `public/`, salve e execute:

```sh
git add .
git commit -m "Atualiza informações da barbearia"
git push
```

GitHub Actions publica no Pages; o Netlify conectado à mesma branch também publica. Não edite `out/` ou `.next/`: essas pastas são geradas novamente. O `.gitignore` impede que sejam incluídas por engano.

## Domínio próprio

**Netlify:** no projeto, abra **Domain management**, adicione o domínio e siga os registros DNS fornecidos pelo painel. Após a verificação, escolha o domínio principal e confirme a emissão do HTTPS. O build continua com o mesmo `basePath` vazio, sem alteração de código.

**GitHub Pages:** em **Settings → Pages → Custom domain**, informe o domínio, configure os registros DNS indicados pelo GitHub e ative **Enforce HTTPS** quando estiver disponível. Depois, rode novamente o workflow: `configure-pages` passa a informar o caminho correto para esse domínio, normalmente vazio. Não é necessário editar manualmente `next.config.ts` nem criar um `CNAME` para este workflow com artefatos.

Um mesmo hostname, como `www.seudominio.com.br`, deve apontar para uma hospedagem por vez. É possível usar hostnames diferentes se quiser manter os dois publicados. O registro/renovação do domínio é separado da hospedagem.

## Referências oficiais

- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://github.com/actions/configure-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- https://docs.netlify.com/build/configure-builds/file-based-configuration/
- https://docs.netlify.com/manage/domains/get-started-with-domains/
