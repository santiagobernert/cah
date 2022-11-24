from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.clubes.clubes import Club, nuevo_club
from db import db

clubes = Blueprint('clubes', __name__)

@clubes.route('/club', methods=['GET', 'POST', 'PUT', 'DELETE'])
def club():
    clubes = Club.query.all()
    if request.method == 'GET':
        print([c.__asdict__() for c in clubes])
        response = jsonify({
            'clubes': [c.__asdict__() for c in clubes]
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'POST':
        print(request.get_json())
        id = request.json[-1]['id']
        nombre = request.json[-1]['nombre']
        asociacion = request.json[-1]['asociacion']
        nombrecorto = request.json[-1]['nombrecorto']
        abreviatura = request.json[-1]['abreviatura']
        escudo = request.json[-1]['escudo']

        id_existe = Club.query.filter_by(id=id).first()
        nombre_existe = Club.query.filter_by(nombre=nombre).first()
        abreviatura_existe = Club.query.filter_by(abreviatura=abreviatura).first()
        
        if id_existe:
            print('id ya existe')
            return'id ya existe'
        if nombre_existe:
            print('club ya existe')
            return'club ya existe'
        if abreviatura_existe:
            print('abreviatura ya existe')
            return'abreviatura ya existe'
        else:
            nuevo_club(id, nombre, asociacion, nombrecorto, abreviatura, escudo)
            print(f'club {id} {nombre} {asociacion} {nombrecorto} {abreviatura} creado')
            response = jsonify({
            'clubes': [c.__asdict__() for c in clubes]
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        club = Club.query.filter_by(id=id).first()
        print(club.nombre, club.abreviatura, club.asociacion, club.nombrecorto)
        club.nombre = valores['nombre']
        club.asociacion = valores['asociacion']
        club.nombrecorto = valores['nombrecorto']
        club.abreviatura = valores['abreviatura']
        db.session.commit()
        print('Club ', id, ' editado')
        clubes = Club.query.all()
        print([c.__asdict__() for c in clubes])
        response = jsonify({
            'clubes': [c.__asdict__() for c in clubes],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        club = Club.query.filter_by(id=id)
        club.delete()
        db.session.commit()
        print('Club ', id, ' eliminado')
        clubes = Club.query.all()
        print([c.__asdict__() for c in clubes])
        response = jsonify({
            'clubes': [c.__asdict__() for c in clubes],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    response = jsonify({
            'clubes': [c.__asdict__() for c in clubes]
            })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
