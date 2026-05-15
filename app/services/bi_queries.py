from sqlalchemy import text

def get_filiais():
    """Retorna a query para listar as filiais únicas."""
    
    
    sql = """
        SELECT nome_filial
        FROM comercial.vm_kpis_comercial_mensal
        GROUP BY nome_filial
        ORDER BY nome_filial
    """
    return text(sql)

def get_faturamento(filial=None, data_inicio=None, data_fim=None):
    """
    Monta a query de faturamento dinamicamente com base nos filtros.
    Se os filtros forem None, retorna o total geral.
    """
    sql = "SELECT SUM(faturamento_bruto) as total FROM comercial.vm_kpis_comercial_mensal WHERE 1=1"
    params = {}

    if filial:
        sql += " AND nome_filial = :filial"
        params['filial'] = filial
    
    if data_inicio and data_fim:
        sql += " AND periodo BETWEEN :inicio AND :fim"
        params['inicio'] = data_inicio
        params['fim'] = data_fim

    return text(sql), params