# Requisito 04 - Semana 4 - Entrega Final e Apresentação

## Contexto

Esta é a entrega final do desafio.

Todos os grupos receberam o mesmo problema comercial, os mesmos indicadores obrigatórios e as mesmas 5 perguntas de negócio. A diferença entre os trabalhos estará na solução técnica criada por cada grupo.

O grupo deverá demonstrar que conseguiu projetar, implementar, documentar e validar um sistema para consulta e análise dos dados comerciais da Rede Comercial Aurora.

## Objetivo da entrega final

Entregar uma solução técnica funcional que permita:

- carregar dados comerciais estruturados;
- consultar vendas, produtos, categorias e filiais;
- calcular os indicadores obrigatórios;
- aplicar filtros;
- apresentar visualizações ou relatórios;
- responder às 5 perguntas de negócio;
- ser executada pelo professor a partir do repositório Git.

## Entrega pelo Git

A entrega final será avaliada pelo repositório compartilhado com o professor.

O repositório deve conter:

- código-fonte da solução;
- arquivos de infraestrutura;
- scripts de banco;
- documentação;
- evidências;
- instruções de execução;
- histórico de commits.

## Requisitos finais obrigatórios

### 1. Infraestrutura

A solução deve conter:

- arquivo para subir o SGBD em Docker;
- instrução clara de execução;
- script SQL completo;
- criação das tabelas;
- inserção dos dados;
- consultas ou views necessárias;
- forma de persistência ou recriação da base.

### 2. Banco de dados

O banco final deve conter dados suficientes para responder às 5 perguntas de negócio.

Deve contemplar:

- filiais;
- categorias;
- produtos;
- vendas;
- itens de venda;
- datas ou períodos;
- custos;
- preços;
- descontos.

### 3. Indicadores obrigatórios

A solução final deve calcular e apresentar:

- faturamento bruto;
- desconto total;
- receita líquida;
- custo total;
- margem bruta;
- margem bruta percentual;
- quantidade vendida;
- ticket médio.

Quando algum indicador depender de média, período ou regra auxiliar, o grupo deve documentar como calculou.

### 4. Filtros obrigatórios

A solução deve permitir filtrar por:

- período;
- filial;
- produto;
- categoria.

Os filtros devem afetar os indicadores e visualizações.

### 5. Visualizações ou relatórios obrigatórios

A solução deve conter pelo menos 5 formas de visualização ou consulta analítica.

Devem estar presentes:

- faturamento total por mês;
- receita líquida por filial;
- receita líquida por categoria;
- ranking de produtos mais vendidos;
- margem bruta por mês, filial e categoria.

O grupo pode apresentar mais visualizações, desde que as obrigatórias estejam contempladas.

### 6. Aplicação ou interface de uso

A forma técnica é livre, mas a solução deve ser utilizável pelo professor.

São aceitas soluções como:

- aplicação web;
- dashboard local;
- aplicação desktop;
- API com interface;
- relatório interativo;
- outra solução técnica justificada.

Não será aceita entrega composta apenas por scripts soltos sem meio claro de uso.

### 7. Documentação final

O repositório deve conter documentação em Markdown com:

- objetivo técnico da solução;
- tecnologias utilizadas;
- justificativa da arquitetura;
- estrutura de pastas;
- modelo do banco;
- descrição das tabelas;
- instruções para subir o SGBD;
- instruções para criar a base;
- instruções para executar a aplicação;
- descrição dos indicadores e fórmulas;
- descrição dos filtros;
- descrição das visualizações;
- testes realizados;
- limitações conhecidas;
- melhorias futuras.

### 8. Evidências

O grupo deve entregar evidências no repositório.

Exemplos:

- capturas de tela;
- prints dos containers executando;
- exemplos de consultas;
- prints da aplicação;
- resultados dos filtros;
- arquivo com testes executados.

### 9. Divisão técnica do trabalho

O grupo deve documentar:

- integrantes;
- responsabilidades técnicas;
- atividades realizadas;
- commits ou arquivos principais de cada integrante;
- dificuldades técnicas enfrentadas;
- contribuição de cada integrante na apresentação.

## Roteiro sugerido para apresentação

1. Apresentar rapidamente o problema comercial recebido.
2. Explicar a arquitetura técnica escolhida.
3. Mostrar a estrutura do banco de dados.
4. Demonstrar o Docker e o SGBD.
5. Executar a aplicação.
6. Aplicar filtros obrigatórios.
7. Mostrar indicadores obrigatórios.
8. Mostrar visualizações ou relatórios.
9. Responder às 5 perguntas de negócio usando o sistema.
10. Explicar dificuldades técnicas e melhorias futuras.

## O que o professor espera ver

Durante a apresentação, o professor espera conseguir verificar:

- o repositório atualizado;
- a solução executando;
- o banco funcionando;
- os dados carregados;
- os indicadores calculados;
- os filtros alterando resultados;
- as visualizações respondendo às perguntas;
- a documentação coerente com o que foi implementado;
- a participação dos integrantes.

## Critérios de avaliação

O professor avaliará se:

1. a entrega está completa no Git;
2. a infraestrutura pode ser reproduzida;
3. o banco foi bem estruturado;
4. os dados permitem responder às 5 perguntas de negócio;
5. os cálculos dos indicadores estão corretos;
6. os filtros funcionam;
7. a aplicação ou interface é utilizável;
8. a documentação é suficiente;
9. a solução técnica está organizada;
10. o grupo consegue explicar suas decisões técnicas.

## O que não será aceito

- entrega fora do Git;
- repositório sem acesso para o professor;
- solução que não executa;
- ausência de Docker ou alternativa previamente aprovada;
- banco incompleto;
- indicadores ausentes ou calculados incorretamente;
- filtros sem efeito;
- interface sem dados reais;
- inclusão de temas fora do escopo comercial obrigatório;
- documentação insuficiente;
- apresentação sem demonstração técnica.

## Observação importante

Os alunos não precisam propor regras de negócio. Elas já estão definidas neste desafio.

O papel do grupo é técnico: modelar, implementar, integrar, testar, documentar e apresentar uma solução de sistema capaz de atender aos requisitos definidos.

## Resumo da entrega

Na semana 4, o grupo deve entregar a solução final pelo Git, com infraestrutura, banco comercial, aplicação, indicadores, filtros, visualizações, documentação, evidências e apresentação técnica.
