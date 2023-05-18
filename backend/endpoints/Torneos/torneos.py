from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.torneos.torneos import Torneo, nuevo_torneo
from db import db

torneos = Blueprint('torneos', __name__)

@torneos.route('/torneo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def torneo():
    torneos = Torneo.query.all()
    if request.method == 'GET':
        print([t.__asdict__() for t in torneos])
        response = jsonify({
            'torneos': [t.__asdict__() for t in torneos]
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'POST':
        print(request.get_json())
        id = request.json['id']
        nombre = request.json['nombre']
        inicio = request.json['inicio']
        fin = request.json['fin']
        equipos = request.json['equipos']
        ubicacion = request.json['ubicacion']
        categoria = request.json['categoria']

        id_existe = Torneo.query.filter_by(id=id).first()
        nombre_existe = Torneo.query.filter_by(nombre=nombre).first()
        
        if id_existe:
            print('id ya existe')
            return'id ya existe'
        if nombre_existe:
            print('torneo ya existe')
            return'torneo ya existe'
        else:
            nuevo_torneo(id, nombre, inicio, fin, equipos, ubicacion, categoria)
            print(f'torneo {id} {nombre} {inicio} {ubicacion} creado')
            response = jsonify({
            'torneos': [t.__asdict__() for t in torneos]
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        torneo = Torneo.query.filter_by(id=id).first()
        print(torneo.nombre, torneo.inicio, torneo.ubicacion)
        torneo.nombre = valores['nombre']
        torneo.inicio = valores['inicio']
        torneo.fin = valores['fin']
        torneo.equipos = valores['equipos']
        torneo.ubicacion = valores['ubicacion']
        db.session.commit()
        print('torneo ', id, ' editado')
        torneos = Torneo.query.all()
        print([t.__asdict__() for t in torneos])
        response = jsonify({
            'torneos': [t.__asdict__() for t in torneos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        torneo = Torneo.query.filter_by(id=id)
        torneo.delete()
        db.session.commit()
        print('torneo ', id, ' eliminado')
        torneos = Torneo.query.all()
        print([t.__asdict__() for t in torneos])
        response = jsonify({
            'torneos': [t.__asdict__() for t in torneos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    response = jsonify({
            'torneos': [t.__asdict__() for t in torneos]
            })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
