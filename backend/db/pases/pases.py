from db import db

class Pase(db.Model):
    __tablename__ = 'Pases'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    jugador = db.Column(db.Integer)
    fecha = db.Column(db.Date)
    club_salida = db.Column(db.Integer)#, db.ForeignKey('Clubes.id'))
    club_llegada = db.Column(db.Integer)#, db.ForeignKey('Clubes.id'))
    tipo = db.Column(db.Enum('Nacional', 'Provincial'))


    def __init__(self, id, jugador, fecha, club_salida, club_llegada, tipo):
        self.id = id
        self.jugador = jugador
        self.fecha = fecha
        self.club_salida = club_salida
        self.club_llegada = club_llegada
        self.tipo = tipo

    
    def __asdict__(self):
        return  {'id':self.id, 'jugador':self.jugador, 'fecha':self.fecha, 'club_salida': self.club_salida, 'club_llegada': self.club_llegada, 'tipo': self.tipo}

def nuevo_pase(id, jugador, fecha, club_salida, club_llegada, tipo):
    pase = Pase(id, jugador, fecha, club_salida, club_llegada, tipo)
    db.session.add(pase)
    db.session.commit()
    return pase