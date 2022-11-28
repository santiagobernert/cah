from db import db

class Rol(db.Model):
    __tablename__ = 'Roles'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    letra = db.Column(db.String(2))


    def __init__(self, id, nombre, letra):
        self.id = id
        self.nombre = nombre
        self.letra = letra

    
    def __asdict__(self):
        return  {'id':self.id, 'nombre':self.nombre, 'letra':self.letra}

def nuevo_rol(id, nombre, letra):
    rol = Rol(id, nombre, letra)
    db.session.add(rol)
    db.session.commit()
    return rol