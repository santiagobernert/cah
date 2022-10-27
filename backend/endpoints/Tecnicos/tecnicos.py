from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.tecnicos.tecnicos import Tecnico, nuevo_tecnico
from db import db

tecnicos = Blueprint('tecnicos', __name__)

@tecnicos.route('/tecnico', methods=['GET', 'POST', 'PUT', 'DELETE'])
def tecnico():
    tecnicos = Tecnico.query.all()
    if request.method == 'GET':
        tecnicos = Tecnico.query.all()
        print([a.__asdict__() for a in tecnicos])
        response = jsonify({
            'tecnicos': [a.__asdict__() for a in tecnicos],
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

        dni_existe = Tecnico.query.filter_by(dni=dni).first()
        
        if dni_existe:
            print('tecnico ya existe')
        else:
            nuevo_tecnico(id, nombre, apellido, dni, nacimiento, sexo, equipo)
            print(f'tecnico {nombre} {apellido}, creado')
            tecnicos = Tecnico.query.all()
            response = jsonify({
                'tecnicos': [a.__asdict__() for a in tecnicos],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        tecnico = Tecnico.query.filter_by(id=id).first()
        print(tecnico.nombre, tecnico.apellido, tecnico.nacimiento)
        tecnico.id = valores['id']
        tecnico.nombre = valores['nombre']
        tecnico.apellido = valores['apellido']
        tecnico.dni = valores['dni']
        tecnico.nacimiento = valores['nacimiento']
        tecnico.sexo = valores['sexo']
        tecnico.equipo = valores['equipo']
        db.session.commit()
        print('tecnico ', id, ' editado')
        tecnicos = Tecnico.query.all()
        print([a.__asdict__() for a in tecnicos])
        response = jsonify({
            'tecnicos': [a.__asdict__() for a in tecnicos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        tecnico = Tecnico.query.filter_by(id=id)
        tecnico.delete()
        db.session.commit()
        print('tecnico ', id, ' eliminado')
        tecnicos = Tecnico.query.all()
        print([a.__asdict__() for a in tecnicos])
        response = jsonify({
            'tecnicos': [a.__asdict__() for a in tecnicos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 