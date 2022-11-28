from db import db
from db.clubes.clubes import Club


class Asociacion(db.Model):
    __tablename__ = 'Asociaciones'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(100))
    abreviatura = db.Column(db.String(12))
    provincia = db.Column(db.String(25))

    def __init__(self, id, nombre, abreviatura, provincia):
        self.id = id
        self.nombre = nombre
        self.abreviatura = abreviatura
        self.provincia = provincia

    
    def __asdict__(self):
        return  {'id':self.id, 'nombre':self.nombre, 'abreviatura':self.abreviatura, 'provincia': self.provincia}

def nueva_asociacion(id, nombre, abreviatura, provincia):
    asociacion = Asociacion(id, nombre, abreviatura, provincia)
    db.session.add(asociacion)
    db.session.commit()
    return asociacion