# Documentação Técnica Final - Projeto Comercial

## 1. Objetivo técnico da solução

O projeto tem como objetivo entregar uma aplicação web local para consulta, análise e visualização de indicadores comerciais da empresa fictícia **Rede Comercial Aurora**.

A solução permite:

- carregar uma base comercial estruturada em PostgreSQL;
- consultar dados de vendas, filiais, produtos, categorias, clientes e períodos;
- calcular indicadores comerciais obrigatórios;
- aplicar filtros por período, filial, produto e categoria;
- apresentar KPIs, gráficos e uma matriz analítica;
- apoiar a resposta das perguntas de negócio propostas no desafio.

## 2. Tecnologias utilizadas

- **Python 3**: linguagem principal da aplicação.
- **Flask 3.0.3**: framework web usado para criar a aplicação e as rotas.
- **SQLAlchemy 2.0.36**: camada de conexão e execução das consultas SQL.
- **psycopg 3.2.13**: driver PostgreSQL utilizado pelo SQLAlchemy.
- **python-dotenv 1.0.1**: leitura das variáveis de ambiente do arquivo `.env`.
- **PostgreSQL 16.1**: SGBD usado para armazenar os dados comerciais.
- **Docker**: utilizado para subir o banco PostgreSQL localmente.
- **HTML, CSS e JavaScript**: construção da interface do dashboard.
- **Chart.js**: biblioteca de gráficos usada nas visualizações.
- **Git/GitHub**: versionamento e entrega do projeto.

## 3. Justificativa da arquitetura

A arquitetura foi organizada em camadas simples para facilitar execução, manutenção e avaliação:

- **Banco de dados**: concentra o modelo dimensional, os dados sintéticos e a view materializada com os KPIs comerciais.
- **Serviços de consulta**: o arquivo `app/services/bi_queries.py` centraliza as consultas SQL usadas pelos indicadores, gráficos e perguntas de negócio.
- **Rotas Flask**: o arquivo `app/routes.py` expõe endpoints JSON para os KPIs, listas de filtros e visualizações.
- **Interface web**: o arquivo `app/templates/base.html` renderiza o dashboard, enquanto `app/static/js/script.js` consome os endpoints e atualiza KPIs, gráficos e matriz.

Essa divisão separa responsabilidades: o PostgreSQL calcula e organiza os dados, o Flask entrega os dados para a tela e o JavaScript controla a experiência interativa do usuário.

## 4. Estrutura de pastas

```text
projeto-comercial/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── db.py
│   ├── routes.py
│   ├── services/
│   │   └── bi_queries.py
│   ├── static/
│   │   ├── css/style.css
│   │   └── js/script.js
│   └── templates/
│       └── base.html
├── db/
│   ├── init/cria_banco.sql
│   └── docs/modelo_banco.md
├── docs/
│   ├── Integrantes.md
│   ├── requisitos_tecnicos.md
│   └── REQUISITO_*.md
├── infra/
│   └── docker/
│       ├── criar_database.txt
│       └── docker-compose.yml
├── requirements.txt
├── README.md
└── run.py
```

## 5. Modelo do banco

O banco utiliza um modelo dimensional, com tabelas de dimensão e tabelas fato.

Dimensões:

- `comercial.dim_calendario`
- `comercial.dim_filial`
- `comercial.dim_categoria`
- `comercial.dim_produto`
- `comercial.dim_cliente`

Fatos:

- `comercial.fato_vendas`
- `comercial.fato_itens_venda`

Camada analítica:

- `comercial.vm_kpis_comercial_mensal`

A view materializada consolida os dados por mês, filial, categoria e produto, já trazendo os indicadores necessários para consumo pela aplicação.

## 6. Descrição das tabelas

### `dim_calendario`

Armazena as datas usadas nas vendas, incluindo ano, mês, nome do mês, trimestre e semestre.

Campos principais:

- `id_data`: chave primária.
- `data_completa`: data completa.
- `ano`, `mes`, `nome_mes`, `trimestre`, `semestre`: atributos temporais.

### `dim_filial`

Armazena as filiais da Rede Comercial Aurora.

Campos principais:

- `id_filial`: chave primária.
- `nome_filial`: nome da filial.
- `cidade`, `uf`, `regiao`, `porte`: dados geográficos e classificação da unidade.

### `dim_categoria`

Armazena as categorias de produtos.

Campos principais:

- `id_categoria`: chave primária.
- `nome_categoria`: nome da categoria.
- `descricao`: descrição da categoria.

### `dim_produto`

Armazena os produtos comercializados.

Campos principais:

- `id_produto`: chave primária.
- `id_categoria`: chave estrangeira para `dim_categoria`.
- `nome_produto`: nome do produto.
- `marca`: marca.
- `preco_venda`: preço de venda.
- `custo_produto`: custo unitário.
- `status`: situação do produto.

### `dim_cliente`

Armazena os clientes usados nas vendas.

Campos principais:

- `id_cliente`: chave primária.
- `nome_cliente`: nome do cliente.
- `tipo_cliente`: classificação B2B ou B2C.
- `cidade`, `uf`: localização.
- `data_cadastro`: data de cadastro.

### `fato_vendas`

Armazena o cabeçalho das vendas.

Campos principais:

- `id_venda`: chave primária.
- `id_data`: referência à data da venda.
- `id_filial`: referência à filial.
- `id_cliente`: referência ao cliente.
- `numero_pedido`: identificador do pedido.
- `forma_pagamento`: forma de pagamento.
- `status_venda`: status da venda.
- `valor_bruto`: valor bruto da venda.
- `desconto`: desconto aplicado.
- `valor_liquido`: valor final da venda.

### `fato_itens_venda`

Armazena os itens vendidos em cada venda.

Campos principais:

- `id_item`: chave primária.
- `id_venda`: referência à venda.
- `id_produto`: referência ao produto.
- `quantidade`: quantidade vendida.
- `valor_unitario`: preço unitário.
- `custo_unitario`: custo unitário.
- `valor_total`: quantidade multiplicada pelo valor unitário.
- `custo_total`: quantidade multiplicada pelo custo unitário.

### `vm_kpis_comercial_mensal`

View materializada que consolida os indicadores por período, filial, categoria e produto.

Campos principais:

- `periodo`: mês de referência.
- `nome_filial`, `cidade`, `uf`, `regiao`: dados da filial.
- `nome_categoria`, `nome_produto`: recortes de produto.
- `quantidade_de_vendas`: total de pedidos.
- `quantidade_vendida`: total de itens vendidos.
- `faturamento_bruto`: soma do valor bruto dos itens.
- `desconto_total`: soma dos descontos.
- `receita_liquida`: faturamento bruto menos descontos.
- `custo_total`: soma dos custos.
- `margem_bruta`: receita líquida menos custo total.
- `margem_bruta_percentual`: percentual de margem sobre a receita líquida.
- `ticket_medio`: receita líquida dividida pela quantidade de vendas.

## 7. Instruções para subir o SGBD

Executar no terminal:

```bash
docker run -d --name db_comercial -p 5781:5432 -e POSTGRES_DB=bi_comercial -e POSTGRES_USER=bi_user -e POSTGRES_PASSWORD=bi_pass postgres:16.1
```

Configurações utilizadas:

- Container: `db_comercial`
- Porta local: `5781`
- Porta interna PostgreSQL: `5432`
- Banco: `bi_comercial`
- Usuário: `bi_user`
- Senha: `bi_pass`

Para verificar se o container está rodando:

```bash
docker ps
```

## 8. Instruções para criar a base

Após subir o PostgreSQL, conectar ao banco `bi_comercial` usando pgAdmin, DBeaver ou outro cliente SQL.

Dados de conexão:

- Host: `localhost`
- Porta: `5781`
- Banco: `bi_comercial`
- Usuário: `bi_user`
- Senha: `bi_pass`

Executar o script:

```text
db/init/cria_banco.sql
```

Esse script:

- remove e recria o schema `comercial`;
- cria as tabelas de dimensão e fato;
- insere dados sintéticos de calendário, filiais, categorias, produtos, clientes, vendas e itens;
- calcula valores totais, custos e descontos;
- cria índices;
- cria a view materializada `comercial.vm_kpis_comercial_mensal`.

## 9. Instruções para executar a aplicação

Criar ou conferir o arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5781
DB_NAME=bi_comercial
DB_USER=bi_user
DB_PASSWORD=bi_pass
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Executar a aplicação:

```bash
python run.py
```

Acessar no navegador:

```text
http://127.0.0.1:5000
```

## 10. Indicadores e fórmulas

Os indicadores são calculados na view materializada `comercial.vm_kpis_comercial_mensal` e consumidos pelas rotas Flask.

- **Faturamento bruto**: `SUM(i.valor_total)`
- **Desconto total**: `SUM(v.desconto)`
- **Receita líquida**: `SUM(i.valor_total) - SUM(v.desconto)`
- **Custo total**: `SUM(i.custo_total)`
- **Margem bruta**: `SUM(i.valor_total) - SUM(v.desconto) - SUM(i.custo_total)`
- **Margem bruta percentual**: `(margem_bruta / receita_liquida) * 100`
- **Quantidade vendida**: `SUM(i.quantidade)`
- **Quantidade de vendas**: `COUNT(DISTINCT v.id_venda)`
- **Ticket médio**: `receita_liquida / quantidade_de_vendas`

Na aplicação, os endpoints principais retornam os valores agregados conforme os filtros selecionados:

- `/faturamento`
- `/desconto_total`
- `/receita_liquida`
- `/custo_total`
- `/margem_bruta`
- `/margem_bruta_percentual`
- `/quantidade_vendida`
- `/ticket_medio`

## 11. Filtros

A aplicação possui filtros na lateral do dashboard.

- **Período**: campos de data inicial e data final. Aplicado no campo `periodo` da view materializada.
- **Filial**: lista carregada pela rota `/filiais`.
- **Categoria**: lista carregada pela rota `/categorias`.
- **Produto**: lista carregada pela rota `/produtos`.

Os filtros são enviados como parâmetros de URL:

```text
filial
produto
categoria
inicio
fim
```

Todos os KPIs, gráficos e a matriz usam os mesmos parâmetros, garantindo que os resultados mudem de forma integrada.

## 12. Visualizações

A interface apresenta as seguintes visualizações obrigatórias:

- **Cards de KPIs**: receita bruta, receita líquida, desconto total, custo total, margem bruta, margem bruta percentual, quantidade vendida e ticket médio.
- **Faturamento mensal**: gráfico de linha com receita bruta por mês, carregado pela rota `/grafico_receita_bruta`.
- **Receita líquida por filial**: gráfico de barras, carregado pela rota `/grafico_receitaliquida_por_filial`.
- **Receita líquida por categoria**: gráfico de barras horizontal, carregado pela rota `/grafico_receitaliquida_por_categoria`.
- **Ranking de produtos mais vendidos**: gráfico de barras horizontal com os 10 produtos mais vendidos, carregado pela rota `/grafico_produtos_vendidos`.
- **Margem bruta por filial e categoria**: matriz expansível por filial, categoria e período, carregada pela rota `/matriz_margem_bruta`.

Também existem rotas analíticas para responder às perguntas de negócio:

- `/pergunta_faturamento`
- `/pergunta_receita_liquida`
- `/pergunta_receita_liquida_categoria`
- `/pergunta_produtos_vendidos`
- `/pergunta_margem_bruta`

## 13. Testes realizados

Foram previstos e realizados testes manuais de validação funcional:

- subida do container PostgreSQL com Docker;
- conexão com o banco usando as credenciais do `.env`;
- execução do script `db/init/cria_banco.sql`;
- verificação da criação do schema `comercial`;
- verificação das tabelas de dimensão e fato;
- verificação da view materializada `vm_kpis_comercial_mensal`;
- execução da aplicação com `python run.py`;
- abertura do dashboard em `http://127.0.0.1:5000`;
- validação dos cards de KPIs;
- validação dos filtros de período, filial, categoria e produto;
- validação dos gráficos obrigatórios;
- validação da matriz expansível de margem bruta;
- validação do tratamento visual quando o banco está indisponível.

## 14. Limitações conhecidas

- O arquivo `infra/docker/docker-compose.yml` está vazio; a documentação atual usa o comando `docker run` para subir o PostgreSQL.
- Os dados são sintéticos e gerados pelo script SQL, não vêm de uma fonte comercial real.
- A view materializada não possui atualização automática; caso os dados mudem, é necessário executar `REFRESH MATERIALIZED VIEW comercial.vm_kpis_comercial_mensal`.
- A autenticação de usuários não foi implementada.
- A aplicação está configurada para execução local em modo de desenvolvimento.
- Não há suíte automatizada de testes unitários ou de integração no repositório.
- O cálculo de `ticket_medio` no endpoint soma o campo consolidado da view; para uma média ponderada mais precisa em recortes amplos, pode ser recalculado como `SUM(receita_liquida) / SUM(quantidade_de_vendas)`.

## 15. Melhorias futuras

- Criar um `docker-compose.yml` completo para subir banco e aplicação com um único comando.
- Adicionar testes automatizados para rotas, consultas e cálculos de indicadores.
- Implementar carga de dados via arquivo CSV ou pipeline ETL.
- Criar rotina para atualização da view materializada.
- Adicionar autenticação e controle de acesso.
- Melhorar tratamento de erros por endpoint.
- Adicionar exportação dos relatórios em CSV ou Excel.
- Criar dashboard responsivo com mais opções de comparação temporal.
- Implementar ambiente de produção com Gunicorn e variáveis seguras.

## 16. Integrantes do grupo

- Filipe Augusto Moreira Rocha
- Larissa Aparecida dos Reis
- Murilo da Silva Alves
- Saulo Oliveira Moreira
- Thiago Eduardo Alves

Professor orientador: **Prof. Dr. Douglas José Mendonça**  
Instituição: **Anhanguera**  
Curso: **Sistema de Informação**  
Disciplina: **Projeto de Sistemas**
 
## 17. Commits principais do projeto

Commits relevantes observados no histórico:

- `ec5f0b4` - Criação dos arquivos
- `b051bf1` - Criação do Banco de dados
- `a216a25` - Criação da Conexão do Banco e estruturação das Pastas
- `b036d06` - Adicionar o README e descrição do criar_database.txt com o docker
- `800f39b` - Rotas e alteração do banco e inicialização das rotas
- `6f1ad67` - Adicionado as rotas
- `6da7011` - Adicionado o erro de conexão do banco
- `5ab29b3` - Alteração para criar o banco atendendo o requisito
- `917df67` - Criadas rota das perguntas
- `fa7f091` - Aplicações de KPI
- `ddb3813` - Criação do front com os filtros
- `b6f4ef3` - Adição dos gráficos
- `3216c3e` - Modificação layout
- `2187013` - Adicionado os gráficos corretos
- `009cba3` - Adicionado tabela matriz

## 18. Dificuldades técnicas enfrentadas

- Ajustar a conexão entre Flask, SQLAlchemy e PostgreSQL usando variáveis de ambiente.
- Garantir que os filtros fossem aplicados de forma consistente em KPIs, gráficos e matriz.
- Criar uma estrutura de banco suficiente para responder às perguntas de negócio.
- Consolidar os indicadores em uma view materializada para melhorar a consulta pelo dashboard.
- Tratar a indisponibilidade do banco sem quebrar completamente a interface.
- Organizar os dados sintéticos para permitir análises por período, filial, produto e categoria.

## 19. Roteiro da apresentação

1. Apresentar o problema comercial da Rede Comercial Aurora.
2. Explicar a arquitetura: PostgreSQL, Flask, SQLAlchemy, JavaScript e Chart.js.
3. Mostrar a estrutura de pastas do repositório.
4. Demonstrar o comando Docker para subir o PostgreSQL.
5. Executar ou explicar o script `db/init/cria_banco.sql`.
6. Rodar a aplicação com `python run.py`.
7. Abrir o dashboard em `http://127.0.0.1:5000`.
8. Demonstrar os filtros obrigatórios.
9. Mostrar os KPIs obrigatórios.
10. Mostrar os gráficos e a matriz.
11. Responder às perguntas de negócio usando as rotas/visualizações.
12. Explicar dificuldades, limitações e melhorias futuras.
