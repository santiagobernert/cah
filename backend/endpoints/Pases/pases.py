from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.pases.pases import Pase, nuevo_pase
from db import db

pases = Blueprint('pases', __name__)

@pases.route('/pases', methods=['GET', 'POST', 'PUT', 'DELETE'])
def pase():
    pases = Pase.query.all()
    print([a.__asdict__() for a in pases])
    if request.method == 'GET':
        pases = Pase.query.all()
        response = jsonify({
            'pases': [p.__asdict__() for p in pases],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    if request.method == 'POST':
        id = request.json['id']
        id_jugador = request.json['jugador']
        nacimiento = request.json['fecha']
        club_salida = request.json['club_salida']
        club_llegada = request.json['club_llegada']
        tipo = request.json['tipo']
        jugador = Jugador.query.filter_by(id=id_jugador).first()
        jugador.club = request.json['club_llegada']

        id_existe = Pase.query.filter_by(id=id).first()
        
        if id_existe:
            print('pase ya existe')
        else:
            nuevo_pase(id, id_jugador, nacimiento, club_salida, club_llegada, tipo)
            print(f'pase {jugador.nombre} {club_salida} {club_llegada}, creado')
            pases = Pase.query.all()
            response = jsonify({
                'pases': [p.__asdict__() for p in pases],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        pase = Pase.query.filter_by(id=id).first()
        print(pase.id, pase.jugador, pase.fecha)
        pase.id = valores['id']
        pase.jugador = valores['jugador']
        pase.fecha = valores['fecha']
        pase.club_salida = valores['club_salida']
        pase.club_llegada = valores['club_llegada']
        pase.tipo = valores['tipo']
        db.session.commit()
        print('pase ', id, ' editado')
        pases = Pase.query.all()
        print([p.__asdict__() for p in pases])
        response = jsonify({
            'pases': [p.__asdict__() for p in pases],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        pase = Pase.query.filter_by(id=id)
        jugador = Jugador.query.filter_by(id=pase.first().jugador).first()
        jugador.club = pase.first().club_salida
        pase.delete()
        db.session.commit()
        print('pase ', id, ' eliminado')
        pases = Pase.query.all()
        print([p.__asdict__() for p in pases])
        response = jsonify({
            'pasees': [p.__asdict__() for p in pases],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response