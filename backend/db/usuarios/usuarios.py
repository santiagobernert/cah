from db import db
from db.roles.roles import Rol
from flask_login import UserMixin

class Usuario(db.Model, UserMixin):
    __tablename__ = 'Usuarios'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    nombre = db.Column(db.String(30))
    apellido = db.Column(db.String(30))
    dni = db.Column(db.Integer, unique=True)
    email = db.Column(db.String(50))
    contraseña = db.Column(db.String(50))
    rol = db.Column(db.Integer, db.ForeignKey(Rol.id))
    pagos = db.relationship('Pago', backref='id_usuario')

    def __init__(self, id, nombre, apellido, dni, email, contraseña, rol):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.email = email
        self.contraseña = contraseña
        self.rol = rol
    
    def __asdict__(self):
        return  {'id':self.id, 'nombre':self.nombre, 'apellido':self.apellido, 'dni': self.dni, 'email' : self.email, 'contraseña' : self.contraseña, 'rol' : self.rol}


def nuevo_usuario(id, nombre, apellido, dni, email, contraseña, rol):
    usuario = Usuario(id, nombre, apellido, dni, email, contraseña, rol)
    db.session.add(usuario)
    db.session.commit()
    return usuario

'''
    try:
        with connect(
            host="localhost",
            user=input("Enter username: "),
            password=input("Enter password: "),
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute(create_usuarios_table_query)
                connection.commit()
    except Error as e:
        print(e)'''

