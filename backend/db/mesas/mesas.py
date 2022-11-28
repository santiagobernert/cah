from db import db
from db.partidos.partidos import Partido

class Mesa(db.Model):
    __tablename__ = 'Mesas'
    id = db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    apellido = db.Column(db.String(30))
    dni = db.Column(db.Integer, unique=True)
    nacimiento = db.Column(db.Date())
    sexo = db.Column(db.Enum('Masculino', 'Femenino'))


    def __init__(self, id, nombre, apellido, dni, nacimiento, sexo):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.nacimiento = nacimiento
        self.sexo = sexo
    
    def __asdict__(self):
        return {'nombre':self.nombre, 'apellido':self.apellido, 'dni':self.dni, 'id':self.id, 'nacimiento':self.nacimiento, 'sexo':self.sexo}


def nuevo_mesa(id, nombre, apellido, dni, nacimiento, sexo):
    mesa = Mesa(id, nombre, apellido, dni, nacimiento, sexo)
    db.session.add(mesa)
    db.session.commit()
    return mesa