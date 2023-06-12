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
            self.posiciones[e] = 0

        for p in partidos:
            if p.resultado[:2] > p.resultado[-2:]:
                self.posiciones[p.equipoA] += 3
                self.posiciones[p.equipoB] += 1
            elif p.resultado[:2] < p.resultado[-2:]:
                self.posiciones[p.equipoB] += 3
                self.posiciones[p.equipoA] += 1
            else:
                self.posiciones[p.equipoA] += 2
                self.posiciones[p.equipoB] += 2

    def str(self):
        posiciones = [(v, k) for k,v in self.posiciones.items()]
        posiciones = sorted(posiciones, reverse=True)
        posiciones = {k:v for v,k in posiciones}
        return posiciones

            

 
