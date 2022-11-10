from db import db

class Imagen(db.Model):
    __tablename__ = 'Imagenes'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    imagen = db.Column(db.String(50))


    def __init__(self, id, nombre, imagen):
        self.id = id
        self.nombre = nombre
        self.imagen = imagen

    
    def __asdict__(self):
        return {'id':self.id, 'nombre':self.nombre, 'imagen':self.imagen}

def nueva_imagen(id, nombre, imagen):
    imagen = Imagen(id, nombre, imagen)
    db.session.add(imagen)
    db.session.commit()
    return imagen