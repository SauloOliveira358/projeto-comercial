
from .db import get_connection

def init_routes(app):

    @app.route("/")
    def home():
        try:
            conn = get_connection()
            conn.close()
            return "Banco conectado com sucesso!"
        except Exception as e:
            return f"Erro: {e}"