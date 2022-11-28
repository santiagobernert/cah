from db import db
from db.estadisticas.estadisticas import Estadistica

class Jugador(db.Model):
    __tablename__ = 'Jugadores'
    id = db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    apellido = db.Column(db.String(30))
    dni = db.Column(db.Integer, unique=True)
    nacimiento = db.Column(db.Date())
    sexo = db.Column(db.Enum('Masculino', 'Femenino'))
    equipo = db.Column(db.Integer)
    categoria = db.Column(db.String(20))
    club = db.Column(db.String(100))

    def __init__(self, id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.nacimiento = nacimiento
        self.sexo = sexo
        self.equipo = equipo
        self.categoria = categoria
        self.club = club
    
    def __asdict__(self):
        return {'nombre':self.nombre, 'apellido':self.apellido, 'dni':self.dni, 'id':self.id, 'nacimiento':self.nacimiento, 'sexo':self.sexo, 'equipo':self.equipo, 'categoria':self.categoria, 'club':self.club}


def nuevo_jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club):
    jugador = Jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club)
    db.session.add(jugador)
    db.session.commit()
    return jugador


