from db import db
from db.partidos.partidos import Partido

class Arbitro(db.Model):
    __tablename__ = 'Arbitros'
    id = db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    apellido = db.Column(db.String(30))
    dni = db.Column(db.Integer, unique=True)
    nacimiento = db.Column(db.Date())
    sexo = db.Column(db.Enum('Masculino', 'Femenino'))
    asociacion = db.Column(db.String(100))
    nivel = db.Column(db.Integer)
    #partidos = db.relationship(Partido, backref='id_arbitro', foreign_keys=[Partido.arbitro1, Partido.arbitro2])


    def __init__(self, id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.nacimiento = nacimiento
        self.sexo = sexo
        self.asociacion = asociacion
        self.nivel = nivel
    
    def __asdict__(self):
        return {'nombre':self.nombre, 'apellido':self.apellido, 'dni':self.dni, 'id':self.id, 'nacimiento':self.nacimiento, 'sexo':self.sexo, 'asociacion':self.asociacion, 'nivel':self.nivel}


def nuevo_arbitro(id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel):
    arbitro = Arbitro(id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel)
    db.session.add(arbitro)
    db.session.commit()
    return arbitro