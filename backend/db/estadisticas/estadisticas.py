from db import db
from db.partidos.partidos import Partido

class Estadistica(db.Model):
    __tablename__ = 'Estadisticas'
    id = db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=False)
    partido = db.Column(db.Integer, db.ForeignKey(Partido.id))
    equipo = db.Column(db.Integer)
    goles = db.Column(db.Integer)
    tiros = db.Column(db.Integer)
    amarilla = db.Column(db.Integer)
    dos_minutos = db.Column(db.Integer)
    roja = db.Column(db.Integer)
    azul = db.Column(db.Integer)
    atajadas = db.Column(db.Integer)

    def __init__(self, id, id_partido, id_club, id_jugador, goles, tiros, amarilla, dos_minutos, roja, azul, atajadas):
        self.id = id
        self.id_partido = id_partido
        self.id_club = id_club
        self.id_jugador = id_jugador
        self.goles = goles
        self.tiros = tiros
        self.amarilla = amarilla
        self.dos_minutos = dos_minutos
        self.roja = roja
        self.azul = azul
        self.atajadas = atajadas
    
    def __str__(self):
        return f'{self.nombre} {self.apellido} {self.dni} {self.id} {self.nacimiento} {self.sexo} {self.club} {self.categoria}'


def nuevo_jugador(id, id_partido, id_club, id_jugador, goles, tiros, amarilla, dos_minutos, roja, azul, atajadas):
    estadistica = Estadistica(id, id_partido, id_club, id_jugador, goles, tiros, amarilla, dos_minutos, roja, azul, atajadas)
    db.session.add(estadistica)
    db.session.commit()
    return estadistica