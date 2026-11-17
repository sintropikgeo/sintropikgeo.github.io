/* Sintropik Geo
   Monta as páginas a partir dos arquivos em content/.
   Os textos não ficam aqui: quem edita pelo admin (Pages CMS) altera só os .json. */

(function () {
  'use strict';

  var pagina = document.body.getAttribute('data-pagina');

  function esc(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Texto com linhas em branco vira vários parágrafos
  function paragrafos(texto, classe) {
    return String(texto || '').split(/\n\s*\n/).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p' + (classe ? ' class="' + classe + '"' : '') + '>' + esc(p.trim()) + '</p>'; }).join('');
  }

  function carregar(nome) {
    return fetch('content/' + nome + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Não foi possível ler content/' + nome + '.json');
      return r.json();
    });
  }

  function iniciais(nome) {
    return String(nome || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
  }

  /* ---------- partes comuns ---------- */

  function cabecalho(site) {
    var ativo = function (p) { return pagina === p ? ' aria-current="page"' : ''; };
    return '' +
      '<a href="index.html" class="marca"><img src="' + esc(site.logo) + '" alt=""><span>' + esc(site.nome) + '</span></a>' +
      '<nav class="menu" aria-label="Principal">' +
        '<a href="servicos.html"' + ativo('servicos') + '>Serviços</a>' +
        '<a href="plugins.html"' + ativo('plugins') + '>Plugins QGIS</a>' +
        '<a href="index.html#equipe">Equipe</a>' +
        '<a href="' + esc(site.botao_pedido.destino) + '" class="botao botao-pequeno">' + esc(site.botao_pedido.texto) + '</a>' +
      '</nav>';
  }

  function rodape(site, chamada, linkTexto) {
    return '' +
      '<div class="rodape-chamada">' +
        '<span>' + esc(chamada || site.rodape.chamada) + '</span>' +
        '<a href="' + esc(site.botao_pedido.destino) + '">' + esc(linkTexto || site.rodape.link_texto) + '</a>' +
      '</div>' +
      '<div class="rodape-contato">' +
        '<a href="mailto:' + esc(site.email) + '">' + esc(site.email) + '</a>' +
        '<a href="' + esc(site.github) + '">' + esc(site.github.replace(/^https?:\/\//, '')) + '</a>' +
        '<span>' + esc(site.cidade) + '</span>' +
      '</div>';
  }

  /* ---------- páginas ---------- */

  function paginaInicio(site, c, servicos, plugins, equipe) {
    var t = c.topo;
    var html = '' +
      '<section class="secao escuro"><div class="abertura">' +
        '<div class="abertura-texto">' +
          '<h1>' + esc(t.titulo) + '</h1>' +
          paragrafos(t.texto, 'secao-texto') +
          '<div class="acoes">' +
            '<a href="' + esc(site.botao_pedido.destino) + '" class="botao">' + esc(t.botao_principal) + '</a>' +
            '<a href="servicos.html" class="link-simples">' + esc(t.botao_secundario) + '</a>' +
          '</div>' +
        '</div>' +
        '<figure class="figura"><img src="' + esc(t.imagem) + '" alt="' + esc(t.imagem_descricao) + '">' +
          (t.legenda ? '<figcaption>' + esc(t.legenda) + '</figcaption>' : '') + '</figure>' +
      '</div></section>';

    html += '<section class="secao">' +
      '<div class="cabeca-secao"><h2>' + esc(c.servicos.titulo) + '</h2>' + paragrafos(c.servicos.texto, 'secao-texto') + '</div>' +
      '<div class="grade-servicos">' +
        servicos.itens.map(function (s, i) {
          return '<article>' +
            '<span class="rotulo">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<h3>' + esc(s.nome) + '</h3>' +
            '<p>' + esc(s.resumo) + '</p>' +
            '<a href="servicos.html#' + esc(s.id) + '">Detalhes do ' + esc(s.nome) + '</a>' +
          '</article>';
        }).join('') +
      '</div></section>';

    html += '<section class="secao escuro"><h2 style="margin-bottom:36px">' + esc(c.passos.titulo) + '</h2><ol class="passos">' +
      c.passos.itens.map(function (p, i) {
        return '<li><span class="rotulo">Passo ' + (i + 1) + '</span><strong>' + esc(p.titulo) + '</strong><p>' + esc(p.texto) + '</p></li>';
      }).join('') + '</ol></section>';

    html += '<section class="secao"><div class="duas-colunas">' +
      '<div class="coluna-texto"><h2>' + esc(c.plugins.titulo) + '</h2>' + paragrafos(c.plugins.texto, 'secao-texto') +
        '<a href="plugins.html">' + esc(c.plugins.link_texto) + '</a></div>' +
      '<div class="lista-linhas">' +
        plugins.itens.map(function (p) {
          return '<a href="plugins.html"><span><strong>' + esc(p.nome) + '</strong><small>' + esc(p.servico) + '</small></span>' +
            '<small>v' + esc(p.versao) + '</small></a>';
        }).join('') +
      '</div></div></section>';

    html += '<section class="secao" id="equipe"><h2 style="margin-bottom:36px">' + esc(c.equipe_titulo) + '</h2><div class="grade-equipe">' +
      equipe.map(function (p) {
        var foto = p.foto ? '<img src="' + esc(p.foto) + '" alt="Foto de ' + esc(p.nome) + '">' : '<div class="sem-foto" aria-hidden="true">' + esc(iniciais(p.nome)) + '</div>';
        return '<div class="pessoa">' + foto + '<strong>' + esc(p.nome) + '</strong><p>' + esc(p.bio) + '</p></div>';
      }).join('') + '</div></section>';

    if (site.apoio && site.apoio.length) {
      html += '<section class="apoio"><span class="rotulo">' + esc(site.apoio_titulo) + '</span>' +
        site.apoio.map(function (a) { return '<span>' + esc(a.nome) + '</span>'; }).join('') + '</section>';
    }
    return html;
  }

  function paginaServicos(site, c) {
    var html = '<section class="cabeca-pagina"><h1>' + esc(c.titulo) + '</h1>' + paragrafos(c.texto) +
      '<nav class="atalhos" aria-label="Ir para o serviço">' +
        c.itens.map(function (s, i) { return '<a href="#' + esc(s.id) + '">' + String(i + 1).padStart(2, '0') + ' ' + esc(s.nome) + '</a>'; }).join('') +
      '</nav></section>';

    html += c.itens.map(function (s, i) {
      var num = String(i + 1).padStart(2, '0');
      return '<section class="servico" id="' + esc(s.id) + '">' +
        '<div class="servico-texto">' +
          '<span class="rotulo">' + num + ' · ' + esc(s.categoria) + '</span>' +
          '<h2>' + esc(s.nome) + '</h2>' +
          paragrafos(s.descricao) +
          '<table class="tabela">' + (s.detalhes || []).map(function (d) {
            return '<tr><th scope="row">' + esc(d.rotulo) + '</th><td>' + esc(d.texto) + '</td></tr>';
          }).join('') + '</table>' +
          (s.nota ? '<p class="nota">' + esc(s.nota) + '</p>' : '') +
          '<div class="acoes">' +
            '<a href="' + esc(site.botao_pedido.destino) + '" class="botao">Pedir este serviço</a>' +
            (s.tem_plugin ? '<a href="plugins.html">Usar o plugin gratuito</a>' : '') +
          '</div>' +
        '</div>' +
        (s.imagem ? '<figure class="figura"><img src="' + esc(s.imagem) + '" alt="Infográfico do ' + esc(s.nome) + '" loading="lazy">' +
          (s.legenda ? '<figcaption>Fig. ' + (i + 2) + ' · ' + esc(s.legenda) + '</figcaption>' : '') + '</figure>' : '') +
      '</section>';
    }).join('');
    return html;
  }

  function paginaPlugins(site, c) {
    var html = '<section class="cabeca-pagina"><h1>' + esc(c.titulo) + '</h1>' + paragrafos(c.texto) + '</section>';
    html += '<section class="grade-plugins">' + c.itens.map(function (p) {
      return '<article class="plugin">' +
        '<div class="plugin-topo"><h2>' + esc(p.nome) + '</h2><span class="muted">v' + esc(p.versao) + '</span></div>' +
        '<p>' + esc(p.descricao) + '</p>' +
        '<dl><dt>Requisitos</dt><dd>' + esc(p.requisitos) + '</dd><dt>No QGIS</dt><dd>' + esc(p.caminho_qgis) + '</dd></dl>' +
        '<div class="plugin-acoes">' +
          (p.repositorio_oficial
            ? '<a href="' + esc(p.repositorio_oficial) + '" class="botao">Instalar pelo QGIS</a>'
            : '<a href="' + esc(p.zip) + '" class="botao" download>Baixar .zip</a>') +
          '<a href="' + esc(p.github) + '">Código no GitHub</a>' +
          '<a href="' + esc(p.github) + '/issues" class="muted">Relatar problema</a>' +
        '</div></article>';
    }).join('') + '</section>';

    html += '<section class="instalar tom"><div><h2>' + esc(c.instalar.titulo) + '</h2>' + paragrafos(c.instalar.texto, 'muted') + '</div>' +
      '<ol>' + c.instalar.passos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></section>';
    return html;
  }

  function paginaPedido(site, c) {
    var enviado = /[?&]enviado=1/.test(location.search);
    var proxima = new URL('pedido.html?enviado=1', location.href).href;

    var formulario = enviado
      ? '<div class="sucesso" role="status"><h2>' + esc(c.sucesso.titulo) + '</h2>' + paragrafos(c.sucesso.texto) +
          '<p>' + esc(site.email) + '</p><a href="pedido.html" class="link-simples">Enviar outro pedido</a></div>'
      : '<form action="https://formsubmit.co/' + esc(site.email) + '" method="POST">' +
          '<input type="hidden" name="_subject" value="' + esc(c.assunto_email) + '">' +
          '<input type="hidden" name="_next" value="' + esc(proxima) + '">' +
          '<input type="hidden" name="_template" value="table">' +
          '<input type="text" name="_honey" class="escondido" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="linha-campos">' +
            '<div class="campo"><label for="nome">Nome</label><input id="nome" name="Nome" type="text" required autocomplete="name"></div>' +
            '<div class="campo"><label for="email">E-mail</label><input id="email" name="email" type="email" required autocomplete="email"></div>' +
          '</div>' +
          '<div class="linha-campos">' +
            '<div class="campo"><label for="instituicao">Instituição ou empresa</label><input id="instituicao" name="Instituição" type="text" autocomplete="organization"></div>' +
            '<div class="campo"><label for="pontos">Quantos pontos, aproximadamente</label><input id="pontos" name="Número de pontos" type="number" min="1"></div>' +
          '</div>' +
          '<div class="campo"><label for="servico">Serviço</label><select id="servico" name="Serviço" required><option value="">Selecione</option>' +
            c.opcoes_servico.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="campo"><label for="descricao">Sobre o estudo</label><textarea id="descricao" name="Sobre o estudo" rows="5" required placeholder="Região, objetivo, o que você precisa receber e se há prazo"></textarea></div>' +
          '<div class="campo"><label for="drive">Link da pasta no Google Drive</label><input id="drive" name="Link do Drive" type="url" placeholder="https://drive.google.com/drive/folders/..."><small>' + esc(c.dica_drive) + '</small></div>' +
          '<label class="aceite"><input type="checkbox" name="Aceite dos termos de dados" value="sim" required><span>Li as condições de uso e guarda dos dados.</span></label>' +
          '<button type="submit" class="botao" style="align-self:flex-start">Enviar pedido</button>' +
        '</form>';

    return '<section class="cabeca-pagina"><h1>' + esc(c.titulo) + '</h1>' + paragrafos(c.texto) + '</section>' +
      '<section class="pedido">' +
        '<div class="pedido-form">' + formulario + '</div>' +
        '<aside>' +
          '<div><h2>' + esc(c.aviso.titulo) + '</h2>' + paragrafos(c.aviso.texto) + '<p><a href="mailto:' + esc(site.email) + '">' + esc(site.email) + '</a></p></div>' +
          '<div><h2>' + esc(c.compartilhar.titulo) + '</h2><ol>' + c.compartilhar.passos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
            '</ol><p class="nota" style="margin-top:10px">E-mail de contato: ' + esc(site.email) + '</p></div>' +
        '</aside>' +
      '</section>';
  }

  /* ---------- montagem ---------- */

  var precisa = {
    inicio: ['inicio', 'servicos', 'plugins', 'equipe'],
    servicos: ['servicos'],
    plugins: ['plugins'],
    pedido: ['pedido']
  }[pagina] || [];

  Promise.all([carregar('site')].concat(precisa.map(carregar))).then(function (dados) {
    var site = dados[0];
    var c = dados[1];
    document.getElementById('topo').innerHTML = cabecalho(site);

    var conteudo = '';
    if (pagina === 'inicio') conteudo = paginaInicio(site, c, dados[2], dados[3], dados[4]);
    if (pagina === 'servicos') conteudo = paginaServicos(site, c);
    if (pagina === 'plugins') conteudo = paginaPlugins(site, c);
    if (pagina === 'pedido') conteudo = paginaPedido(site, c);
    document.getElementById('conteudo').innerHTML = conteudo;

    var chamada = c && c.rodape_chamada, link = c && c.rodape_link;
    document.getElementById('rodape').innerHTML = rodape(site, chamada, link);

    if (location.hash) {
      var alvo = document.getElementById(location.hash.slice(1));
      if (alvo) alvo.scrollIntoView();
    }
  }).catch(function (erro) {
    document.getElementById('conteudo').innerHTML =
      '<p class="carregando">Não foi possível carregar o conteúdo. ' + esc(erro.message) +
      '. Se você abriu o arquivo direto do computador, use o Live Server do VS Code.</p>';
  });
})();
