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

        produto = request.args.get("produto")

        try:

            query = bi_queries.get_categorias(produto)

            result = session.execute(
                query,
                {"produto": produto}
            )

            lista_categorias = [
                row.nome_categoria
                for row in result
            ]

            return jsonify(lista_categorias)

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
            valor_formatado = "{:.1f}".format(float(valor_bruto))
            
            return jsonify(valor_formatado)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()




    @app.route("/custo_total", methods=["GET"])
    def get_custo_total():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_custo_total(filial,produto,categoria, inicio, fim)
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




    @app.route("/desconto_total", methods=["GET"])
    def get_desconto_total_():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_desconto_total(filial,produto,categoria, inicio, fim)
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


    @app.route("/quantidade_vendida", methods=["GET"])
    def get_quantidade_vendida():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_quantidade_vendida(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchone()

            # Tratamento para não retornar erro se o banco estiver vazio
            valor_bruto = result[0] if result and result[0] is not None else 0.0
            
            # Força o formato "0.00"
            valor_formatado = "{:.0f}".format(float(valor_bruto))
            
            return jsonify(valor_formatado)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()
    



    @app.route("/ticket_medio", methods=["GET"])
    def get_ticket_medio():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_ticket_medio(filial,produto,categoria, inicio, fim)
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



    


    @app.route("/grafico_produtos_vendidos", methods=["GET"])
    def get_grafico_produtos_vendidos():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_produtos_vendidos(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "nome_produto": str(row.nome_produto),
                    "total": round(float(row.total), 1)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()
    








    @app.route("/grafico_receitaliquida_por_filial", methods=["GET"])
    def get_grafico_receitaliquida_filial():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_receitaLiquida_filial(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "nome_filial": str(row.nome_filial),
                    "total": round(float(row.total), 1)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()





    @app.route("/grafico_receitaliquida_por_categoria", methods=["GET"])
    def get_grafico_receitaliquida_categoria():
        """Retorna o valor do faturamento formatado com 2 casas decimais."""
        session = get_session()
        
        # Captura os parâmetros da URL
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')
        

        try:
            query, params = bi_queries.get_grafico_receitaLiquida_categoria(filial,produto,categoria, inicio, fim)
            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "nome_categoria": str(row.nome_categoria),
                    "total": round(float(row.total), 1)
                }
                for row in result
            ]

            return jsonify(dados)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            session.close()







    @app.route("/matriz_margem_bruta", methods=["GET"])
    def get_matriz_margem_bruta():

        session = get_session()

        # =========================
        # FILTROS
        # =========================
        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            # =========================
            # QUERY
            # =========================
            query, params = bi_queries.get_matriz_margem_mes_filial_categoria(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(
                query,
                params
            ).fetchall()

            # =========================
            # MATRIZ FINAL
            # =========================
            matriz = {}

            # =========================
            # LOOP RESULTADOS
            # =========================
            for row in result:

                nome_filial = str(row[0])

                nome_categoria = str(row[1])

                periodo = row[2].strftime("%m/%Y")

                total = round(
                    float(row[3]),
                    2
                )

                # =========================
                # FILIAL
                # =========================
                if nome_filial not in matriz:

                    matriz[nome_filial] = {

                        "filial": nome_filial,

                        "total": 0,

                        "categorias": []
                    }

                filial_obj = matriz[nome_filial]

                filial_obj["total"] += total

                # =========================
                # PROCURA CATEGORIA
                # =========================
                categoria_existente = next(

                    (
                        c for c in filial_obj["categorias"]

                        if c["categoria"]
                        == nome_categoria
                    ),

                    None
                )

                # =========================
                # CRIA CATEGORIA
                # =========================
                if not categoria_existente:

                    categoria_existente = {

                        "categoria": nome_categoria,

                        "total": 0,

                        "periodos": []
                    }

                    filial_obj["categorias"].append(
                        categoria_existente
                    )

                categoria_existente["total"] += total

                # =========================
                # ADICIONA PERÍODO
                # =========================
                categoria_existente["periodos"].append({

                    "periodo": periodo,

                    "total": total
                })

            # =========================
            # ORDENA CATEGORIAS
            # =========================
            for filial in matriz.values():

                filial["categorias"].sort(

                    key=lambda c: c["total"],

                    reverse=True
                )

            # =========================
            # RETORNO FINAL
            # =========================
            return jsonify(
                list(matriz.values())
            )

        except Exception as e:

            return jsonify({
                "erro": str(e)
            }), 500

        finally:

            session.close()


































  # =========================
# ROTAS DAS PERGUNTAS
# =========================

    @app.route("/pergunta_faturamento", methods=["GET"])
    def get_pergunta_faturamento():

        session = get_session()

        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            query, params = bi_queries.pergunta_faturamento(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "periodo": str(row.periodo),
                    "receita_bruta": float(row.receita_bruta or 0),
                    "desconto_total": float(row.desconto_total or 0),
                    "receita_liquida": float(row.receita_liquida or 0),
                    "quantidade_vendida": int(row.quantidade_vendida or 0),
                    "quantidade_de_vendas": int(row.quantidade_de_vendas or 0)
                }
                for row in result
            ]

            return jsonify(dados)

        except Exception as e:

            return jsonify({"erro": str(e)}), 500

        finally:

            session.close()


    @app.route("/pergunta_receita_liquida", methods=["GET"])
    def get_pergunta_receita_liquida():

        session = get_session()

        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            query, params = bi_queries.pergunta_receita_liquida(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "filial": row.nome_filial,
                    "receita_bruta": float(row.receita_bruta or 0),
                    "desconto_total": float(row.desconto_total or 0),
                    "receita_liquida": float(row.receita_liquida or 0),
                    "custo_total": float(row.custo_total or 0),
                    "margem_bruta": float(row.margem_bruta or 0),
                    "margem_bruta_percentual": float(row.margem_bruta_percentual or 0)
                }
                for row in result
            ]

            return jsonify(dados)

        except Exception as e:

            return jsonify({"erro": str(e)}), 500

        finally:

            session.close()


    @app.route("/pergunta_receita_liquida_categoria", methods=["GET"])
    def get_pergunta_receita_liquida_categoria():

        session = get_session()

        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            query, params = bi_queries.pergunta_receita_liquida_por_categoria(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "categoria": row.categoria,
                    "quantidade_vendida": int(row.quantidade_vendida or 0),
                    "receita_bruta": float(row.receita_bruta or 0),
                    "receita_liquida": float(row.receita_liquida or 0),
                    "margem_bruta": float(row.margem_bruta or 0),
                    "margem_bruta_percentual": float(row.margem_bruta_percentual or 0)
                }
                for row in result
            ]

            return jsonify(dados)

        except Exception as e:

            return jsonify({"erro": str(e)}), 500

        finally:

            session.close()


    @app.route("/pergunta_produtos_vendidos", methods=["GET"])
    def get_pergunta_produtos_vendidos():

        session = get_session()

        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            query, params = bi_queries.pergunta_produtos_vendidos(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "produto": row.nome_produto,
                    "categoria": row.categoria,
                    "quantidade_vendida": int(row.quantidade_vendida or 0),
                    "receita_bruta": float(row.receita_bruta or 0),
                    "receita_liquida": float(row.receita_liquida or 0)
                }
                for row in result
            ]

            return jsonify(dados)

        except Exception as e:

            return jsonify({"erro": str(e)}), 500

        finally:

            session.close()


    @app.route("/pergunta_margem_bruta", methods=["GET"])
    def get_pergunta_margem_bruta():

        session = get_session()

        filial = request.args.get('filial')
        produto = request.args.get('produto')
        categoria = request.args.get('categoria')
        inicio = request.args.get('inicio')
        fim = request.args.get('fim')

        try:

            query, params = bi_queries.pergunta_margem_bruta(
                filial,
                produto,
                categoria,
                inicio,
                fim
            )

            result = session.execute(query, params).fetchall()

            dados = [
                {
                    "periodo": str(row.periodo),
                    "filial": row.nome_filial,
                    "categoria": row.categoria,
                    "receita_liquida": float(row.receita_liquida or 0),
                    "custo_total": float(row.custo_total or 0),
                    "margem_bruta": float(row.margem_bruta or 0),
                    "margem_bruta_percentual": float(row.margem_bruta_percentual or 0)
                }
                for row in result
            ]

            return jsonify(dados)

        except Exception as e:

            return jsonify({"erro": str(e)}), 500

        finally:

            session.close()