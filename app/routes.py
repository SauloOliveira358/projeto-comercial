from flask import render_template, jsonify, request
from app.db import get_session
from app.services import bi_queries
from sqlalchemy import text 



def init_routes(app):
   

    


    @app.route("/")
    def index():

        banco_online = True

        session = get_session()

        try:

            session.execute(text("SELECT 1"))

        except Exception:

            banco_online = False

        finally:

            session.close()

        return render_template(
            "base.html",
            banco_online=banco_online
        )


 









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


    @app.route("/produtos")
    def produtos():
        session = get_session()
        categoria = request.args.get("categoria")
        try:
            query = bi_queries.get_produtos(categoria)
            result = session.execute(
                query,
                {"categoria": categoria}
                )

            lista_produtos = [row.nome_produto for row in result]

            return jsonify(lista_produtos)
        except Exception as e:
            return jsonify({"erro": str(e)}),500
        finally:
            session.close()
        

    @app.route("/categorias")
    def categorias():
        session = get_session()
        try:
            query = bi_queries.get_categorias()
            result = session.execute(query)

            lista_categorias = [row.nome_categoria for row in result]
            return jsonify(lista_categorias)
        except Exception as e:
            return jsonify({"erro": str(e)}),500
        finally:
            session.close()

    @app.route("/faturamento", methods=["GET"])
    def get_faturamento():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_faturamento(filial,produto,categoria, inicio, fim)
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


    @app.route("/receita_liquida", methods=["GET"])
    def get_receita_liquida():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_receitaLiquida(filial,produto,categoria, inicio, fim)
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




    @app.route("/margem_bruta", methods=["GET"])
    def get_margem_bruta():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_margem_bruta(filial,produto,categoria, inicio, fim)
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




    @app.route("/margem_bruta_percentual", methods=["GET"])
    def get_margem_bruta_percentual():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_margem_bruta_percentual(filial,produto,categoria, inicio, fim)
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



    ## Rotas de GRaficos 
    ##Graficos Receita Bruta

    @app.route("/grafico_receita_bruta", methods=["GET"])
    def get_grafico_receita_bruta():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_receita_bruta(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "periodo": str(row.periodo),
                    "total": float(row.total)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()





    @app.route("/grafico_receita_liquida", methods=["GET"])
    def get_grafico_receita_liquida():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_receita_liquida(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "periodo": str(row.periodo),
                    "total": float(row.total)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()




    @app.route("/grafico_margem_bruta_percentual", methods=["GET"])
    def get_grafico_margem_bruta_percebtual():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_margem_bruta_percentual(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "periodo": str(row.periodo),
                    "total": round(float(row.total), 1)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()







 