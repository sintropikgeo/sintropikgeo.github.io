# Site Sintropik Geo

Site estático (HTML, CSS e JavaScript, sem etapa de compilação). Os textos e imagens ficam em `content/` e são editados pelo admin (Pages CMS) ou direto no VS Code.

## Estrutura

```
index.html, servicos.html, plugins.html, pedido.html   páginas (só a estrutura)
assets/css/style.css     visual; cores e medidas nas variáveis do topo
assets/js/main.js        monta as páginas a partir de content/
assets/img/              imagens (o admin envia imagens novas para cá)
content/*.json           todos os textos, listas e links do site
downloads/               .zip dos plugins
.pages.yml               configuração do admin
.nojekyll                faz o GitHub Pages servir os arquivos como estão
app/                     reservado para o sistema de processamento (ver app/README.md)
```

O que muda onde:

| Quero mudar | Arquivo |
|---|---|
| Texto, imagem, serviço, plugin, equipe | `content/*.json` (ou pelo admin) |
| E-mail que recebe os pedidos | `content/site.json` → `email` |
| Para onde vai o botão "Fazer um pedido" | `content/site.json` → `botao_pedido.destino` |
| Cores, fontes, espaçamentos | `assets/css/style.css` |
| Estrutura de uma seção | `assets/js/main.js` |
| Campos que aparecem no admin | `.pages.yml` |

## 1. Publicar no GitHub (primeira vez)

1. Em github.com/sintropikgeo, crie um repositório público chamado **`sintropikgeo.github.io`**. Com esse nome o site fica na raiz: `https://sintropikgeo.github.io`.
2. No repositório vazio, clique em **uploading an existing file** e arraste todo o conteúdo desta pasta (inclusive `.pages.yml` e `.nojekyll`). Confirme com **Commit changes**.
3. Em **Settings › Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em um ou dois minutos o site está no ar.

Esta pasta no Google Drive fica como cópia de segurança da versão inicial. **Não rode `git init` aqui**: repositório Git dentro de pasta sincronizada pelo Drive costuma corromper.

## 2. Editar pelo VS Code (sem cópia no computador)

1. Instale a extensão **GitHub Repositories** (Microsoft).
2. `Ctrl+Shift+P` › **Remote Repositories: Open Remote Repository** › escolha `sintropikgeo/sintropikgeo.github.io`.
3. Edite, e no painel **Controle de Código-Fonte** escreva a mensagem e faça o commit. A alteração vai direto para o GitHub e o site atualiza em um ou dois minutos.

No navegador, abra o repositório e aperte a tecla `.` para ter o mesmo editor (github.dev).

Para mudanças grandes, crie um branch de teste, trabalhe nele e só junte com o `main` quando estiver pronto.

## 3. Admin para quem não usa GitHub (Pages CMS)

Configuração, feita uma vez por alguém com conta no GitHub:

1. Acesse https://app.pagescms.org e entre com a conta do GitHub.
2. Autorize o Pages CMS na organização `sintropikgeo` (no repositório do site).
3. Abra o repositório. O menu lateral já mostra as seções definidas em `.pages.yml`.
4. Em **Collaborators**, convide o e-mail de quem vai editar (por exemplo, o Henrique).

A pessoa convidada recebe um link por e-mail, entra sem conta no GitHub e edita textos e imagens. Ela não consegue alterar `.pages.yml` nem convidar outras pessoas. Cada "Salvar" vira um commit no GitHub, e o site atualiza sozinho.

Imagens: prefira JPG ou WebP com até ~500 KB. Fotos direto do celular deixam o site lento.

## 4. Formulário de pedido

O formulário usa o FormSubmit (gratuito, sem servidor). Os pedidos chegam no e-mail de `content/site.json`.

- **Primeiro envio:** o FormSubmit manda um e-mail de ativação para sintropik.geo@gmail.com. Clique em ativar. Antes disso, nenhum pedido é entregue.
- O e-mail de ativação traz também um código que pode substituir o endereço no formulário, para o e-mail não ficar visível no código da página. Para usar, troque `site.email` pelo código em `main.js` na linha do `action` do formulário.
- Depois do envio, a pessoa volta para `pedido.html?enviado=1`, que mostra a mensagem de confirmação.

Guarda de dados: o aviso na página promete 90 dias depois da entrega. Organize o Drive com uma pasta por pedido e a data de entrega no nome (`2026-11-20_cliente_servico`) para apagar no prazo.

## 5. Domínio próprio

Depois de comprar o domínio:

1. Em **Settings › Pages › Custom domain**, informe o domínio (por exemplo `sintropikgeo.com.br`). O GitHub cria o arquivo `CNAME`.
2. No painel do registro do domínio, crie os registros DNS indicados na documentação do GitHub Pages (registros A para o domínio raiz e CNAME `www` → `sintropikgeo.github.io`).
3. Marque **Enforce HTTPS** quando aparecer.

## 6. Migrar para a Hostinger (ou outra hospedagem)

O GitHub continua sendo a origem do site; a Hostinger só serve os arquivos. Assim o admin continua funcionando.

1. No hPanel, abra **Avançado › Git** e conecte o repositório `sintropikgeo/sintropikgeo.github.io`, branch `main`. Confira antes se o plano inclui a integração com Git.
2. Ative a implantação automática: cada commit (pelo VS Code ou pelo admin) publica sozinho.
3. Aponte o DNS do domínio para a Hostinger e desative o GitHub Pages.

Sem integração Git no plano, dá para enviar os arquivos pelo Gerenciador de Arquivos ou FTP, mas aí as edições do admin não chegam sozinhas.

Observação: a regra do GitHub Pages proíbe uso como hospedagem de negócio ou SaaS comercial. Para um site de apresentação com formulário de contato ele serve. Se o processamento passar a ser vendido pelo site, mude a hospedagem.

## Ver localmente (opcional)

Só funciona com uma cópia local dos arquivos. Abra a pasta no VS Code e use a extensão **Live Server**. Abrir o `index.html` com duplo clique não carrega o conteúdo, porque o navegador bloqueia a leitura dos `.json` fora de um servidor.
