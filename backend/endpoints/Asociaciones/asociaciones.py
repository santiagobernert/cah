from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.asociaciones.asociaciones import Asociacion, nueva_asociacion
from db import db

asociaciones = Blueprint('asociaciones', __name__)

@asociaciones.route('/asociacion', methods=['GET', 'POST', 'PUT', 'DELETE'])
def asociacion():
    asociaciones = Asociacion.query.all()
    print([a.__asdict__() for a in asociaciones])
    if request.method == 'GET':
        asociaciones = Asociacion.query.all()
        response = jsonify({
            'asociaciones': [a.__asdict__() for a in asociaciones],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    if request.method == 'POST':
        id = request.json['id']
        nombre = request.json['nombre']
        abreviatura = request.json['abreviatura']
        provincia = request.json['provincia']

        id_existe = Asociacion.query.filter_by(id=id).first()
        nombre_existe = Asociacion.query.filter_by(nombre=nombre).first()
        abreviatura_existe = Asociacion.query.filter_by(abreviatura=abreviatura).first()
        
        if id_existe:
            print('id ya existe')
            return 'id ya existe'
        if nombre_existe:
            print('Asociacion ya existe')
            return 'Asociacion ya existe'
        if abreviatura_existe:
            print('abreviatura ya existe')
            return 'abreviatura ya existe'
        else:
            nueva_asociacion(id, nombre, abreviatura, provincia)
            print(f'Asociacion {id} {nombre} {abreviatura} {provincia}, creado')
            asociaciones = Asociacion.query.all()
            response = jsonify({
            'asociaciones': [a.__asdict__() for a in asociaciones],
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        asociacion = Asociacion.query.filter_by(id=id).first()
        print(asociacion.nombre, asociacion.abreviatura, asociacion.provincia)
        asociacion.id = valores['id']
        asociacion.nombre = valores['nombre']
        asociacion.abreviatura = valores['abreviatura']
        asociacion.provincia = valores['provincia']
        db.session.commit()
        print('Asociacion ', id, ' editado')
        asociaciones = Asociacion.query.all()
        print([a.__asdict__() for a in asociaciones])
        response = jsonify({
            'asociaciones': [a.__asdict__() for a in asociaciones],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        asociacion = Asociacion.query.filter_by(id=id)
        clubes_relacionados = Club.query.filter_by(asociacion=id)
        clubes_relacionados.update({'asociacion': None})
        asociacion.delete()
        db.session.commit()
        print('Asociacion ', id, ' eliminado')
        asociaciones = Asociacion.query.all()
        print([a.__asdict__() for a in asociaciones])
        response = jsonify({
            'asociaciones': [a.__asdict__() for a in asociaciones],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response