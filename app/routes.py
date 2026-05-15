from flask import render_template, jsonify, request
from app.db import get_session
from app.services import bi_queries
from sqlalchemy import text 


def init_routes(app):
   

    @app.route("/")
    def index():
        """Renderiza a página principal do Dashboard."""
        return render_template("base.html")

    @app.route("/filiais")
    def filiais():
        session = get_session()
        try:
            # Puxa a query do seu arquivo de serviços
            query = bi_queries.get_filiais() 
            result = session.execute(query)
            
            # Cria uma lista simples de strings: ["Barbacena", "Prata", ...]
            lista_filiais = [row.nome_filial for row in result]
            
            return jsonify(lista_filiais)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()

    @app.route("/faturamento", methods=["GET"])
    def get_faturamento():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:
            query, params = bi_queries.get_faturamento(filial, inicio, fim)
            result = session.execute(query, params).fetchone()

            # Tratamento para não retornar erro se o banco estiver vazio
            valor_bruto = result[0] if result and result[0] is not None else 0.0
            
            # Força o formato "0.00"
            valor_formatado = "{:.2f}".format(float(valor_bruto))
            
            return jsonify(valor_formatado)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()


   