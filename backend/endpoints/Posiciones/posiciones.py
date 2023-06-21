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
        self.posiciones = []

        print(self.equipos)
        for e in self.equipos:
            self.posiciones.append({"Equipo": e,"J":0, "G":0, "P":0, "E":0, "GF":0, "GC":0, "DG":0, "PTS":0, })

        for p in partidos:
            equipoA = next(e for e in self.posiciones if e["Equipo"] == p.equipoA)
            equipoB = next(e for e in self.posiciones if e["Equipo"] == p.equipoB)
            equipoA["J"] += 1
            equipoB["J"] += 1
            # sum goal difference
            equipoA["GF"] += int(p.resultado.split("-")[0])
            equipoB["GF"] += int(p.resultado.split("-")[1])
            equipoA["GC"] += int(p.resultado.split("-")[1])
            equipoB["GC"] += int(p.resultado.split("-")[0])
            equipoA["DG"] = equipoA["GF"]-equipoA["GC"]
            equipoB["DG"] = equipoB["GF"]-equipoB["GC"]
            # sum points to winner and loser
            if p.resultado.split("-")[0] > p.resultado.split("-")[1]:
                equipoA["PTS"] += 3
                equipoA["G"] += 1
                equipoB["PTS"] += 1
                equipoB["P"] += 1
            elif p.resultado.split("-")[0] < p.resultado.split("-")[1]:
                equipoB["PTS"] += 3
                equipoA["G"] += 1
                equipoA["PTS"] += 1
                equipoB["P"] += 1
            else:
                equipoA["PTS"] += 2
                equipoB["PTS"] += 2
                equipoA["E"] += 1
                equipoB["E"] += 1

    def str(self):
        # sorting by points
        posiciones = sorted(self.posiciones, key=lambda d: d['PTS'],reverse=True)
        return posiciones

            

 
