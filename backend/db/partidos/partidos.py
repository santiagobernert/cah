from db import db
from db.categorias.categorias import Categoria

class Partido(db.Model):
    __tablename__ = 'Partidos'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    titulo = db.Column(db.String(30))
    torneo = db.Column(db.String(30))
    categoria = db.Column(db.String(30))
    sexo = db.Column(db.Enum('Masculino', 'Femenino'))
    equipoA = db.Column(db.Integer)
    equipoB = db.Column(db.Integer)
    sede = db.Column(db.String(60))
    fecha = db.Column(db.String(50))
    jornada = db.Column(db.String(50))
    resultado = db.Column(db.String(50))
    arbitro1 = db.Column(db.Integer)
    arbitro2 = db.Column(db.Integer)
    mesa1 = db.Column(db.Integer)
    mesa2 = db.Column(db.Integer)


    def __init__(self, id, titulo, torneo, categoria, sexo, equipoA, equipoB, sede, fecha, jornada, resultado, arbitro1, arbitro2, mesa1, mesa2):
        self.id = id
        self.titulo = titulo
        self.torneo = torneo
        self.categoria = categoria
        self.sexo = sexo
        self.equipoA = equipoA
        self.equipoB = equipoB
        self.sede = sede
        self.fecha = fecha
        self.jornada = jornada
        self.resultado = resultado
        self.arbitro1 = arbitro1
        self.arbitro2 = arbitro2
        self.mesa1 = mesa1
        self.mesa2 = mesa2
    
    def __asdict__(self):
        return {'id':self.id,'titulo': self.titulo,'torneo': self.torneo,'categoria': self.categoria, 'sexo': self.sexo,'equipoA': self.equipoA,'equipoB': self.equipoB,'sede': self.sede,'fecha': self.fecha,'jornada': self.jornada,'resultado': self.resultado, 'arbitro1': self.arbitro1, 'arbitro2': self.arbitro2, 'mesa1': self.mesa1, 'mesa2': self.mesa2}

    def string_club_categoria(self):
        return f' {self.club} {self.categoria} '

def nuevo_partido(id, titulo, torneo, categoria, sexo, equipoA, equipoB, sede, fecha, jornada, resultado, arbitro1, arbitro2, mesa1, mesa2):
    partido = Partido(id, titulo, torneo, categoria, sexo, equipoA, equipoB, sede, fecha, jornada, resultado, arbitro1, arbitro2, mesa1, mesa2)
    db.session.add(partido)
    db.session.commit()
    return partido
