from db import db

class Fecha(db.Model):
    __tablename__ = 'Fechas'
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=False)
    torneo = db.Column(db.Integer, db.ForeignKey('Torneos.id'))
    inicio = db.Column(db.Date)
    fin = db.Column(db.Date)
    partidos = db.relationship('Partido', backref='id_fecha')


    def __init__(self, id, torneo, inicio, fin):
        self.id = id
        self.torneo = torneo
        self.inicio = inicio
        self.fin = fin
    
    def __asdict__(self):
        return {'id': self.id,'torneo': self.torneo,'inicio': self.inicio,'fin': self.fin}

    def string_club_fin(self):
        return f' {self.club} {self.fin} '

def nueva_fecha(id, torneo, inicio, fin):
    fecha = Fecha(id, torneo, inicio, fin)
    db.session.add(fecha)
    db.session.commit()
    return fecha
