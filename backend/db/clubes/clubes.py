from db import db

class Club(db.Model):
    __tablename__ = 'Clubes'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    asociacion = db.Column(db.Integer, db.ForeignKey('Asociaciones.id'))
    nombrecorto = db.Column(db.String(12))
    abreviatura = db.Column(db.String(3))
    escudo = db.Column(db.String(100))
    jugadores = db.relationship('Jugador', backref='nombre_club')
    equipos = db.relationship('Equipo', backref='id_club')


    def __init__(self, id, nombre, asociacion, nombrecorto, abreviatura, escudo):
        self.id = id
        self.nombre = nombre
        self.asociacion = asociacion
        self.nombrecorto = nombrecorto
        self.abreviatura = abreviatura
        self.escudo = escudo

    
    def __asdict__(self):
        return {'id':self.id, 'nombre':self.nombre, 'asociacion':self.asociacion, 'nombrecorto': self.nombrecorto, 'abreviatura': self.abreviatura, 'escudo': self.escudo,}

def nuevo_club(id, nombre, asociacion, nombrecorto, abreviatura, escudo):
    club = Club(id, nombre, asociacion, nombrecorto, abreviatura, escudo)
    db.session.add(club)
    db.session.commit()
    return club