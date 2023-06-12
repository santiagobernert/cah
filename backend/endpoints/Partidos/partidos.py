from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.partidos.partidos import Partido, nuevo_partido
from db import db

partidos = Blueprint('partidos', __name__)

@partidos.route('/partidos', methods=['GET', 'POST', 'PUT', 'DELETE'])
def partido():
    partidos = Partido.query.all()
    print([p.__asdict__() for p in partidos])
    if request.method == 'GET':
        if request.args:
            categoria = request.args.get('categoria')
            sexo = request.args.get('sexo')
            torneo = request.args.get('torneo')
            partidos = Partido.query.filter_by(torneo=torneo, sexo=sexo, categoria=categoria)
        else:
            partidos = Partido.query.all()
        response = jsonify({
            'partidos': [p.__asdict__() for p in partidos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    if request.method == 'POST':
        id = request.json['id']
        titulo = request.json['titulo']
        torneo = request.json['torneo']
        categoria = request.json['categoria']
        equipoA = request.json['equipoA']
        equipoB = request.json['equipoB']
        arbitro1 = request.json['arbitro1']
        arbitro2 = request.json['arbitro2']
        mesa1 = request.json['mesa1']
        mesa2 = request.json['mesa2']
        sede = request.json['sede']
        fecha = request.json['fecha']
        jornada = request.json['jornada']
        resultado = request.json['resultado']

        id_existe = Partido.query.filter_by(id=id).first()
        
        if id_existe:
            print('partido ya existe')
        else:
            nuevo_partido(id, titulo, torneo, categoria, equipoA, equipoB, sede, fecha, jornada, resultado, arbitro1, arbitro2, mesa1, mesa2, )
            print(f'partido {id} {equipoA} {equipoB} {sede} {fecha}, creado')
            partidos = Partido.query.all()
            response = jsonify({
                'partidos': [p.__asdict__() for p in partidos],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        partido = Partido.query.filter_by(id=id).first()
        print(partido.id, partido.jugador, partido.fecha)
        id = valores['id']
        titulo = valores['titulo']
        torneo = valores['torneo']
        categoria = valores['categoria']
        equipoA = valores['equipoA']
        equipoB = valores['equipoB']
        arbitro1 = valores['arbitro1']
        arbitro2 = valores['arbitro2']
        mesa1 = valores['mesa1']
        mesa2 = valores['mesa2']
        sede = valores['sede']
        fecha = valores['fecha']
        jornada = valores['jornada']
        resultado = valores['resultado']
        db.session.commit()
        print('partido ', id, ' editado')
        partidos = Partido.query.all()
        print([p.__asdict__() for p in partidos])
        response = jsonify({
            'partidos': [p.__asdict__() for p in partidos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        partido = Partido.query.filter_by(id=id).first()
        partido.delete()
        db.session.commit()
        print('partido ', id, ' eliminado')
        partidos = Partido.query.all()
        print([p.__asdict__() for p in partidos])
        response = jsonify({
            'partidoes': [p.__asdict__() for p in partidos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response