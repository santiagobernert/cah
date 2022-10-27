from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.sedes.sedes import Sede, nueva_sede
from db import db

sedes = Blueprint('sedes', __name__)

@sedes.route('/sede', methods=['GET', 'POST', 'PUT', 'DELETE'])
def sede():
    sedes = Sede.query.all()
    if request.method == 'GET':
        print([s.__asdict__() for s in sedes])
        response = jsonify({
            'sedes': [s.__asdict__() for s in sedes]
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'POST':
        print(request.get_json())
        id = request.json[-1]['id']
        nombre = request.json[-1]['nombre']
        club = request.json[-1]['club']
        ubicacion = request.json[-1]['ubicacion']
        localidad = request.json[-1]['localidad']

        id_existe = Sede.query.filter_by(id=id).first()
        nombre_existe = Sede.query.filter_by(nombre=nombre).first()
        
        if id_existe:
            print('id ya existe')
            return'id ya existe'
        if nombre_existe:
            print('sede ya existe')
            return'sede ya existe'
        else:
            nueva_sede(id, nombre, club, ubicacion, localidad)
            print(f'sede {id} {nombre} {club} {localidad} creado')
            response = jsonify({
            'sedes': [s.__asdict__() for s in sedes]
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        sede = Sede.query.filter_by(id=id).first()
        print(sede.nombre, sede.club, sede.localidad)
        sede.nombre = valores['nombre']
        sede.club = valores['club']
        sede.ubicacion = valores['ubicacion']
        sede.localidad = valores['localidad']
        db.session.commit()
        print('sede ', id, ' editado')
        sedes = Sede.query.all()
        print([s.__asdict__() for s in sedes])
        response = jsonify({
            'sedes': [s.__asdict__() for s in sedes],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        sede = Sede.query.filter_by(id=id)
        sede.delete()
        db.session.commit()
        print('sede ', id, ' eliminado')
        sedes = Sede.query.all()
        print([s.__asdict__() for s in sedes])
        response = jsonify({
            'sedes': [s.__asdict__() for s in sedes],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    response = jsonify({
            'sedes': [s.__asdict__() for s in sedes]
            })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
