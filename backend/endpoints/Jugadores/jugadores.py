from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.jugadores.jugadores import Jugador, nuevo_jugador
from db import db
from db.insertexcel import insert_from_sheet
from datetime import datetime

jugadores = Blueprint('jugadores', __name__)

@jugadores.route('/jugador', methods=['GET', 'POST', 'PUT', 'DELETE'])
def jugador():
    jugadores = Jugador.query.all()
    if request.method == 'GET':
        jugadores = Jugador.query.all()
        print([j.__asdict__() for j in jugadores])
        response = jsonify({
            'jugadores': [j.__asdict__() for j in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response    
    if request.method == 'POST':
        id = request.json['id']
        nombre = request.json['nombre']
        apellido = request.json['apellido']
        dni = request.json['dni']
        nacimiento = request.json['nacimiento']
        sexo = request.json['sexo']
        equipo = request.json['equipo']
        categoria = request.json['categoria']
        club = request.json['club']

        dni_existe = Jugador.query.filter_by(dni=dni).first()
        
        if dni_existe:
            print('jugador ya existe')
        else:
            nuevo_jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club)
            print(f'jugador {nombre} {apellido}, creado')
            jugadores = Jugador.query.all()
            response = jsonify({
                'jugadores': [j.__asdict__() for j in jugadores],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        jugador = Jugador.query.filter_by(id=id).first()
        print(jugador.nombre, jugador.apellido, jugador.nacimiento)
        jugador.id = valores['id']
        jugador.nombre = valores['nombre']
        jugador.apellido = valores['apellido']
        jugador.dni = valores['dni']
        jugador.nacimiento = valores['nacimiento']
        jugador.sexo = valores['sexo']
        jugador.equipo = valores['equipo']
        jugador.categoria = valores['categoria']
        jugador.club = valores['club']
        db.session.commit()
        print('jugador ', id, ' editado')
        jugadores = Jugador.query.all()
        print([j.__asdict__() for j in jugadores])
        response = jsonify({
            'jugadores': [j.__asdict__() for j in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        jugador = Jugador.query.filter_by(id=id)
        jugador.delete()
        db.session.commit()
        print('jugador ', id, ' eliminado')
        jugadores = Jugador.query.all()
        print([j.__asdict__() for j in jugadores])
        response = jsonify({
            'jugadores': [j.__asdict__() for j in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 

@jugadores.route('/jugador/planilla', methods=['POST'])
def planilla():
    if request.method == 'POST':
        print('post planilla')
        Jugador.query.delete()
        table = 'Jugadores'
        sheetid = request.json
        data = insert_from_sheet(sheetid, table)
        for i in data:
            nuevo_jugador(i['id'], i['nombre'], i['apellido'], i['dni'], datetime.strptime(i['nacimiento'], "%d/%m/%Y") , i['sexo'], i['equipo'], i['categoria'], i['club'])
        jugadores = Jugador.query.all()
        print([a.__asdict__() for a in jugadores])
        response = jsonify({
            'jugadores': [a.__asdict__() for a in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response