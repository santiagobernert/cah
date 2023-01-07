from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.equipos.equipos import Equipo, nuevo_equipo
from db import db

equipos = Blueprint('equipos', __name__)

@equipos.route('/equipo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def equipo():
    equipos = Equipo.query.all()
    if request.method == 'GET':
        print([e.__asdict__() for e in equipos])
        response = jsonify({
            'equipos': [e.__asdict__() for e in equipos]
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'POST':
        print(request.get_json())
        id = request.json[-1]['id']
        club = request.json[-1]['club']
        categoria = request.json[-1]['categoria']
        año = request.json[-1]['año']
        jugadores = request.json[-1]['jugadores']
        tecnicos = request.json[-1]['tecnicos']
        refuerzos = request.json[-1]['refuerzos']

        id_existe = Equipo.query.filter_by(id=id).first()
        
        if id_existe:
            print('id ya existe')
            return'id ya existe'
        else:
            nuevo_equipo(id, club, categoria, año, jugadores, tecnicos, refuerzos)
            print(f'equipo {id} {club} {categoria} {año} creado')
            response = jsonify({
            'equipos': [e.__asdict__() for e in equipos]
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        equipo = Equipo.query.filter_by(id=id).first()
        print(equipo.club, equipo.categoria, equipo.año)
        equipo.club = valores['club']
        equipo.categoria = valores['categoria']
        equipo.año = valores['año']
        equipo.jugadores = valores['jugadores']
        equipo.tecnicos = valores['tecnicos']
        equipo.refuerzos = valores['refuerzos']
        db.session.commit()
        print('equipo ', id, ' editado')
        equipos = Equipo.query.all()
        print([e.__asdict__() for e in equipos])
        response = jsonify({
            'equipos': [e.__asdict__() for e in equipos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        equipo = Equipo.query.filter_by(id=id)
        equipo.delete()
        db.session.commit()
        print('equipo ', id, ' eliminado')
        equipos = Equipo.query.all()
        print([e.__asdict__() for e in equipos])
        response = jsonify({
            'equipos': [e.__asdict__() for e in equipos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    response = jsonify({
            'equipos': [e.__asdict__() for e in equipos]
            })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
