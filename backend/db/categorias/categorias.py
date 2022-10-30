from db import db

class Categoria(db.Model):
    __tablename__ = 'Categorias'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    años = db.Column(db.String(15))
    jugadores = db.relationship('Jugador', backref='id_categoria')
    equipos = db.relationship('Equipo', backref='id_categoria')
    torneos = db.relationship('Torneo', backref='id_categoria')


    def __init__(self, id, nombre, años):
        self.id = id
        self.nombre = nombre
        self.años = años

    
    def __asdict__(self):
        return {'id': self.id, 'nombre': self.nombre, 'años': self.años}

def nueva_categoria(id, nombre, años):
    categoria = Categoria(id, nombre, años)
    db.session.add(categoria)
    db.session.commit()
    return categoria