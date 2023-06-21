from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.partidos.partidos import Partido, nuevo_partido
from db import db
from functools import reduce

posiciones = Blueprint('posiciones', __name__)

@posiciones.route('/posiciones', methods=['GET'])
def posicion():
    categoria = request.args.get('categoria')
    sexo = request.args.get('sexo')
    torneo = request.args.get('torneo')
    partidos = Partido.query.filter_by(**request.args)
    tabla = Tabla(partidos)
    response = jsonify({
                'tabla': tabla.str(),
                })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


class Tabla:
    def __init__(self, partidos):
        self.partidos = partidos
        # Obteniendo equipos de cada partido, convirtiendolos en una sola lista y eliminando duplicados
        self.equipos = list(dict.fromkeys(reduce(lambda x,y: x+y, [[p.equipoA,p.equipoB]for p in partidos])))
        self.posiciones = {}

        print(self.equipos)
        for e in self.equipos:
            self.posiciones[e] = {"J":0, "G":0, "P":0, "E":0, "GF":0, "GC":0, "DG":0, "PTS":0, }

        for p in partidos:
            self.posiciones[p.equipoA]["J"] += 1
            self.posiciones[p.equipoB]["J"] += 1
            # sum goal difference
            self.posiciones[p.equipoA]["GF"] += int(p.resultado.split("-")[0])
            self.posiciones[p.equipoB]["GF"] += int(p.resultado.split("-")[1])
            self.posiciones[p.equipoA]["GC"] += int(p.resultado.split("-")[1])
            self.posiciones[p.equipoB]["GC"] += int(p.resultado.split("-")[0])
            self.posiciones[p.equipoA]["DG"] = self.posiciones[p.equipoA]["GF"]-self.posiciones[p.equipoA]["GC"]
            self.posiciones[p.equipoB]["DG"] = self.posiciones[p.equipoB]["GF"]-self.posiciones[p.equipoB]["GC"]
            # sum points to winner and loser
            if p.resultado.split("-")[0] > p.resultado.split("-")[1]:
                self.posiciones[p.equipoA]["PTS"] += 3
                self.posiciones[p.equipoA]["G"] += 1
                self.posiciones[p.equipoB]["PTS"] += 1
                self.posiciones[p.equipoB]["P"] += 1
            elif p.resultado.split("-")[0] < p.resultado.split("-")[1]:
                self.posiciones[p.equipoB]["PTS"] += 3
                self.posiciones[p.equipoA]["G"] += 1
                self.posiciones[p.equipoA]["PTS"] += 1
                self.posiciones[p.equipoB]["P"] += 1
            else:
                self.posiciones[p.equipoA]["PTS"] += 2
                self.posiciones[p.equipoB]["PTS"] += 2
                self.posiciones[p.equipoA]["E"] += 1
                self.posiciones[p.equipoB]["E"] += 1

    def str(self):
        # turning into list (points, name)
        pts = [(v["PTS"], k) for k,v in self.posiciones.items()]
        # sorting by points
        order = sorted(pts, reverse=True)
        # turning to dict again
        posiciones = {k:self.posiciones[k] for v,k in order}
        return posiciones

            

 
