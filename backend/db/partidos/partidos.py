from db import db
from db.categorias.categorias import Categoria

class Partido(db.Model):
    __tablename__ = 'Partidos'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    titulo = db.Column(db.String(30))
    torneo = db.Column(db.Integer, db.ForeignKey('Torneos.id'))
    categoria = db.Column(db.Integer, db.ForeignKey(Categoria.id))
    equipos = db.Column(db.String(6))
    arbitros = db.Column(db.String(6))
    mesas = db.Column(db.String(6))
    sede = db.Column(db.String(50))
    fecha = db.Column(db.String(50))
    jornada = db.Column(db.String(50))
    resultado = db.Column(db.String(150))
    estadisticas = db.relationship('Estadistica', backref='id_partido')


    def __init__(self, id, titulo, torneo, categoria, equipoA, equipoB, sede, fecha, jornada, resultado):
        self.id = id
        self.titulo = titulo
        self.torneo = torneo
        self.categoria = categoria
        self.equipoA = equipoA
        self.equipoB = equipoB
        self.sede = sede
        self.fecha = fecha
        self.jornada = jornada
        self.resultado = resultado
    
    def __asdict__(self):
        return {'id':self.id,'titulo': self.titulo,'torneo': self.torneo,'categoria': self.categoria,'equipoA': self.equipoA,'equipoB': self.equipoB,'sede': self.sede,'fecha': self.fecha,'jornada': self.jornada,'resultado': self.resultado}

    def string_club_categoria(self):
        return f' {self.club} {self.categoria} '

def nuevo_partido(id, titulo, torneo, categoria, equipoA, equipoB, sede, fecha, jornada, resultado):
    partido = Partido(id, titulo, torneo, categoria, equipoA, equipoB, sede, fecha, jornada, resultado)
    db.session.add(partido)
    db.session.commit()
    return partido
