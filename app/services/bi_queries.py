from sqlalchemy import text

from app.db import get_session 

def executar_validacao_banco():
    """
    Abre uma sessão temporária e testa a conexão com o Postgres.
    Se o banco estiver fora, o SQLAlchemy lança a exceção.
    """
    session = get_session()
    try:
        session.execute(text("SELECT 1"))
    finally:
        session.close() # Garante que a sessão feche para não travar o pool




    
def get_filiais():
    """Retorna a query para listar as filiais únicas."""
    
    
    sql = """
        SELECT nome_filial
        FROM comercial.vm_kpis_comercial_mensal
        GROUP BY nome_filial
        ORDER BY nome_filial
    """
    return text(sql)

def get_produtos(categoria=None):

    sql = """
        SELECT DISTINCT nome_produto
        FROM comercial.vm_kpis_comercial_mensal
        WHERE 1=1
    """

    if categoria:
        sql += " AND nome_categoria = :categoria"

    sql += " ORDER BY nome_produto"

    return text(sql)

def get_categorias(produto=None):
    """Retorna a Query da lista de Categorias"""

    sql = """
        SELECT DISTINCT nome_categoria
        FROM comercial.vm_kpis_comercial_mensal
        WHERE 1=1
    """

    if produto:
        sql += " AND nome_produto = :produto"

    sql += """
        ORDER BY nome_categoria
    """

    return text(sql)



def get_faturamento(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query de faturamento dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(faturamento_bruto) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params


def get_receitaLiquida(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(receita_liquida) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params


def get_margem_bruta(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(margem_bruta) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params



def get_margem_bruta_percentual(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT AVG(margem_bruta_percentual) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params


    
def get_custo_total(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query de faturamento dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(custo_total) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params




def get_desconto_total(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(desconto_total) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params






def get_quantidade_vendida(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(quantidade_vendida) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params




def get_ticket_medio(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(ticket_medio) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params






















###grafico Receita Bruta

def get_grafico_receita_bruta(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT periodo,SUM(faturamento_bruto) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY periodo ORDER BY periodo"
    

    return text(sql), params




def get_grafico_receita_liquida(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query da receita liquida dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT periodo,SUM(receita_liquida) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY periodo ORDER BY periodo"
    

    return text(sql), params

#Grafico Margem Média

def get_grafico_margem_bruta_percentual(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT periodo,AVG(margem_bruta_percentual) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY periodo ORDER BY periodo"
    

    return text(sql), params





def get_grafico_produtos_vendidos(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT nome_produto, SUM(quantidade_vendida) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1 "
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " group by nome_produto Order By SUM(Quantidade_vendida) desc LIMIT 10 "
    

    return text(sql), params




    # Rota das Perguntas 

def pergunta_faturamento(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = " SELECT periodo,SUM(faturamento_bruto) as receita_bruta ," \
    "SUM(desconto_total) as desconto_total, SUM(receita_liquida) as receita_liquida ," \
    "SUM(quantidade_vendida) as quantidade_vendida, " \
    "SUM(quantidade_de_vendas) as quantidade_de_vendas  FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY periodo ORDER BY periodo"
    

    return text(sql), params

def pergunta_receita_liquida(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = " SELECT nome_filial as nome_filial,SUM(faturamento_bruto) as receita_bruta ," \
    "SUM(desconto_total) as desconto_total, SUM(receita_liquida) as receita_liquida ," \
    "SUM(custo_total) as custo_total," \
     "SUM(margem_bruta) as margem_bruta, AVG(margem_bruta_percentual) as margem_bruta_percentual" \
     " FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY nome_filial ORDER BY nome_filial"
    

    return text(sql), params





def pergunta_receita_liquida_por_categoria(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = " SELECT nome_categoria as categoria, SUM(quantidade_vendida) as quantidade_vendida ," \
    "SUM(faturamento_bruto) as receita_bruta, SUM(receita_liquida) as receita_liquida," \
     "SUM(margem_bruta) as margem_bruta, AVG(margem_bruta_percentual)" \
     " FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY nome_categoria ORDER BY nome_categoria"
    

    return text(sql), params





def pergunta_produtos_vendidos(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = " SELECT nome_produto as nome_produto ,nome_categoria as categoria, SUM(quantidade_vendida) as quantidade_vendida ," \
    "SUM(faturamento_bruto) as receita_bruta, SUM(receita_liquida) as receita_liquida" \
     " FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY nome_produto,nome_categoria ORDER BY nome_produto"
    

    return text(sql), params





def pergunta_margem_bruta(filial=None,produto = None,categoria = None, data_inicio=None, data_fim=None):
    """
    Monta a query do grafico margem media percentual a dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = " SELECT periodo as periodo, nome_filial as nome_filial,nome_categoria as categoria, SUM(quantidade_vendida) as quantidade_vendida ," \
    " SUM(receita_liquida) as receita_liquida,SUM(custo_total) as custo_total," \
    "SUM(margem_bruta) as margem_bruta, AVG(margem_bruta_percentual) as margem_bruta_percentual" \
     " FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial

    if produto:
        sql += " AND nome_produto = :produto"
        params['produto'] = produto

    if categoria:
        sql += " AND nome_categoria = :categoria"
        params['categoria'] = categoria
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim
    sql += " GROUP BY periodo, nome_filial, nome_categoria ORDER BY periodo"
    

    return text(sql), params



