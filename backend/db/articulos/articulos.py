from db import db

class Articulo(db.Model):
    __tablename__ = 'Articulos'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    titulo = db.Column(db.String(100))
    portada = db.Column(db.String(100))
    tags = db.Column(db.String(40))
    cuerpo = db.Column(db.String(10))
    fecha = db.Column(db.Date)
    

    def __init__(self, id, titulo, portada, tags, cuerpo, fecha):
        self.id = id
        self.titulo = titulo
        self.portada = portada
        self.tags = tags
        self.cuerpo = cuerpo
        self.fecha = fecha

    
    def __asdict__(self):
        return  {'id':self.id, 'titulo':self.titulo, 'portada':self.portada, 'tags': self.tags, 'cuerpo': self.cuerpo, 'fecha': self.fecha}

def nuevo_articulo(id, titulo, portada, tags, cuerpo, fecha):
    articulo = Articulo(id, titulo, portada, tags, cuerpo, fecha)
    db.session.add(articulo)
    db.session.commit()
    return articulo