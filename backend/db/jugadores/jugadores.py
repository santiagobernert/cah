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
    estado = db.Column(db.String(20))
    peso = db.Column(db.Integer)
    estatura = db.Column(db.Integer)
    mano = db.Column(db.String(20))
    posicion = db.Column(db.String(20))
    sanguineo = db.Column(db.String(20))
    telefono = db.Column(db.String(20))
    provincia = db.Column(db.String(100))
    departamento = db.Column(db.String(100))
    localidad = db.Column(db.String(100))
    domicilio = db.Column(db.String(100))
    obrasocial = db.Column(db.String(50))
    carnet = db.Column(db.String(50))

    def __init__(self, id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club, estado, peso, estatura, mano, posicion, sanguineo, telefono, provincia, departamento, localidad, domicilio, obrasocial, carnet):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.nacimiento = nacimiento
        self.sexo = sexo
        self.equipo = equipo
        self.categoria = categoria
        self.club = club
        self.estado = estado
        self.peso = peso
        self.estatura = estatura
        self.mano = mano
        self.posicion = posicion
        self.sanguineo = sanguineo
        self.telefono = telefono
        self.provincia = provincia
        self.departamento = departamento
        self.localidad = localidad
        self.domicilio = domicilio
        self.obrasocial = obrasocial
        self.carnet = carnet
    
    def __asdict__(self):
        return {'nombre':self.nombre, 'apellido':self.apellido, 'dni':self.dni, 'id':self.id, 'nacimiento':self.nacimiento, 'sexo':self.sexo, 'equipo':self.equipo, 'categoria':self.categoria, 'club':self.club, 'estado': self.estado, 'peso': self.peso, 'estatura': self.estatura, 'mano': self.mano, 'posicion': self.posicion, 'sanguineo': self.sanguineo, 'telefono': self.telefono, 'provincia': self.provincia, 'departamento': self.departamento, 'localidad': self.localidad, 'domicilio': self.domicilio, 'obrasocial': self.obrasocial, 'carnet': self.carnet}


def nuevo_jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club, estado, peso, estatura, mano, posicion, sanguineo, telefono, provincia, departamento, localidad, domicilio, obrasocial, carnet):
    jugador = Jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club, estado, peso, estatura, mano, posicion, sanguineo, telefono, provincia, departamento, localidad, domicilio, obrasocial, carnet)
    db.session.add(jugador)
    db.session.commit()
    return jugador


