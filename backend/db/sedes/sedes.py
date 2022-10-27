from db import db

class Sede(db.Model):
    __tablename__ = 'Sedes'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    club = db.Column(db.Integer, db.ForeignKey('Clubes.id'))
    ubicacion = db.Column(db.String(200))
    localidad = db.Column(db.String(3))


    def __init__(self, id, nombre, club, ubicacion, localidad):
        self.id = id
        self.nombre = nombre
        self.club = club
        self.ubicacion = ubicacion
        self.localidad = localidad

    
    def __asdict__(self):
        return {'id':self.id, 'nombre':self.nombre, 'club':self.club, 'ubicacion': self.ubicacion, 'localidad': self.localidad}

def nueva_sede(id, nombre, club, ubicacion, localidad):
    sede = Sede(id, nombre, club, ubicacion, localidad)
    db.session.add(sede)
    db.session.commit()
    return sede