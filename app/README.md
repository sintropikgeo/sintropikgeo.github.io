# Sistema de processamento (reservado)

Esta pasta guarda as decisões para o sistema futuro em que o cliente envia os arquivos e recebe o resultado em .zip. O código do sistema pode morar num repositório próprio; aqui fica só a referência.

## Como o site se liga ao sistema

O site não precisa ser alterado. Quando o sistema estiver no ar (por exemplo em `https://app.sintropikgeo.com.br`), basta trocar no admin, ou em `content/site.json`, o campo `botao_pedido.destino` de `pedido.html` para o endereço do sistema. Todos os botões de pedido passam a apontar para lá.

## Onde o sistema roda

Os algoritmos dependem do QGIS: o HED-ECA usa o GRASS (`r.watershed`, `r.water.outlet`) e os dois plugins usam o framework Processing. Por isso o sistema **não** roda em hospedagem compartilhada (só PHP) nem em funções serverless como as da Vercel (limite de tamanho de pacote e de tempo, sem QGIS).

Opções:

- **VPS** (Hostinger ou outro provedor) com Docker: imagem com QGIS sem interface, API em Python e uma fila de tarefas.
- **Container sob demanda** (por exemplo Google Cloud Run): cobra só enquanto processa; o tempo máximo por tarefa precisa ser conferido com o tamanho dos lotes.

## Fluxo previsto

1. O cliente envia os arquivos (upload direto para um armazenamento, não pela API, para não esbarrar em limite de tamanho de requisição).
2. A API cria uma tarefa e valida as entradas: mesmo sistema de coordenadas projetado, colunas esperadas, exutórios sobre o segmento de drenagem.
3. Um processo de trabalho chama os plugins pela linha de comando do QGIS, sem reescrever a lógica:
   `qgis_process run <provedor>:<algoritmo> --PARAMETRO=valor ...`
4. A pasta de saída é compactada em .zip e o cliente recebe o link de download.
5. Entradas e resultados são apagados 90 dias após a entrega, como diz o aviso do site.

## Serviços

| Serviço | Origem | Observação |
|---|---|---|
| HED-ECA | plugin Hierarchical Watershed Difference | precisa do provedor GRASS |
| BufScale | plugin Dynamic Multiscale Buffer Generator | precisa de pandas e openpyxl |
| Raster Scan | código fechado | roda só no servidor, sem versão pública |
