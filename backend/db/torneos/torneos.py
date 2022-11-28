from db import db

class Torneo(db.Model):
    __tablename__ = 'Torneos'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(50))
    inicio = db.Column(db.Date)
    fin = db.Column(db.Date)
    equipos = db.Column(db.String(100))
    ubicacion = db.Column(db.String(100))
    categoria = db.Column(db.String(20))
    partidos = db.relationship('Partido', backref='id_torneo')
    

    def __init__(self, id, nombre, inicio, fin, equipos, ubicacion, categoria):
        self.id = id
        self.nombre = nombre
        self.inicio = inicio
        self.fin = fin
        self.equipos = equipos
        self.ubicacion = ubicacion
        self.categoria = categoria

    
    def __asdict__(self):
        return  {'id':self.id, 'nombre':self.nombre, 'inicio':self.inicio, 'fin': self.fin, 'equipos': self.equipos, 'ubicacion': self.ubicacion, 'categoria': self.categoria}

def nuevo_torneo(id, nombre, inicio, fin, equipos, ubicacion, categoria):
    torneo = Torneo(id, nombre, inicio, fin, equipos, ubicacion, categoria)
    db.session.add(torneo)
    db.session.commit()
    return torneo