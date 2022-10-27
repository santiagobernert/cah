from db import db
from db.torneos.torneos import Torneo
from db.partidos.partidos import Partido

class Equipo(db.Model):
    __tablename__ = 'Equipos'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    club = db.Column(db.Integer, db.ForeignKey('Clubes.id'))
    categoria = db.Column(db.Integer, db.ForeignKey('Categorias.id'))
    jugadores = db.Column(db.String(40))
    tecnicos = db.Column(db.String(10))
    refuerzos = db.Column(db.String(10))
    año = db.Column(db.String(4))
    estadisticas = db.relationship('Estadistica', backref='id_club')
    partidos = db.relationship('Partido', backref='id_equipo', foreign_keys=[Partido.equipoA, Partido.equipoB])

    

    def __init__(self, id, club, categoria, año, jugadores, tecnicos, refuerzos):
        self.id = id
        self.club = club
        self.categoria = categoria
        self.año = año
        self.jugadores = jugadores
        self.tecnicos = tecnicos
        self.refuerzos = refuerzos

    
    def __asdict__(self):
        return  {'id':self.id, 'club':self.club, 'categoria':self.categoria, 'año':self.año, 'jugadores': self.jugadores, 'tecnicos': self.tecnicos, 'refuerzos': self.refuerzos}

def nuevo_equipo(id, club, categoria, año, jugadores, tecnicos, refuerzos):
    equipo = Equipo(id, club, categoria, año, jugadores, tecnicos, refuerzos)
    db.session.add(equipo)
    db.session.commit()
    return equipo