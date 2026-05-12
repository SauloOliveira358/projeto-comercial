# Projeto Comercial - Rede Comercial Aurora

Aplicacao web em Flask para consulta e analise de indicadores comerciais da empresa ficticia Rede Comercial Aurora.

## 1. Criar banco Docker

Use o comando abaixo para criar o banco PostgreSQL:

`docker run -d --name db_comercial -p 5781:5432 -e POSTGRES_DB=bi_comercial -e POSTGRES_USER=bi_user -e POSTGRES_PASSWORD=bi_pass postgres:16.1`

## 2. Criar estrutura inicial do banco

No pgAdmin, conectado ao banco `bi_comercial`, execute:

* `db/init/cria_banco.sql`

## 3. Configurar ambiente da aplicacao

O arquivo `.env` deve conter os parametros padrao de conexao:

DB_HOST=localhost
DB_PORT=5781
DB_NAME=bi_comercial
DB_USER=bi_user
DB_PASSWORD=bi_pass

## 4. Instalar dependencias

`pip install -r requirements.txt`

## 5. Rodar aplicacao

`python run.py`

## Estrutura inicial

* `app/` aplicacao Flask
* `db/` scripts SQL e documentacao do banco
* `docs/` documentacao tecnica
* `infra/` arquivos de infraestrutura e Docker

## Objetivo

Desenvolver uma solucao tecnica para consulta, filtro e analise de dados comerciais.

Indicadores obrigatorios:

* faturamento bruto
* desconto total
* receita liquida
* custo total
* margem bruta
* margem bruta percentual
* quantidade vendida
* ticket medio
