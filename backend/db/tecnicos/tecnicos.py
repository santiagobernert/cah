from db import db

class Tecnico(db.Model):
    __tablename__ = 'Tecnicos'
    id = db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    apellido = db.Column(db.String(30))
    dni = db.Column(db.Integer, unique=True)
    nacimiento = db.Column(db.Date())
    sexo = db.Column(db.Enum('Masculino', 'Femenino'))
    asociacion = db.Column(db.Integer, db.ForeignKey('Asociaciones.id'))
    nivel = db.Column(db.Integer)
    equipos = db.Column(db.String(20))
    #pases = db.relationship('Pase', backref='id_tecnico')

    def __init__(self, id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel, equipos):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.nacimiento = nacimiento
        self.sexo = sexo
        self.asociacion = asociacion
        self.nivel = nivel
        self.equipos = equipos
    
    def __asdict__(self):
        return {'nombre':self.nombre, 'apellido':self.apellido, 'dni':self.dni, 'id':self.id, 'nacimiento':self.nacimiento, 'sexo':self.sexo, 'asociacion':self.asociacion, 'nivel':self.nivel, 'equipos':self.equipos}


def nuevo_tecnico(id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel, equipos):
    tecnico = Tecnico(id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel, equipos)
    db.session.add(tecnico)
    db.session.commit()
    return tecnico