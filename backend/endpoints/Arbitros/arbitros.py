from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.arbitros.arbitros import Arbitro, nuevo_arbitro
from db import db

arbitros = Blueprint('arbitros', __name__)

@arbitros.route('/arbitro', methods=['GET', 'POST', 'PUT', 'DELETE'])
def arbitro():
    arbitros = Arbitro.query.all()
    if request.method == 'GET':
        arbitros = Arbitro.query.all()
        print([a.__asdict__() for a in arbitros])
        response = jsonify({
            'arbitros': [a.__asdict__() for a in arbitros],
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
        asociacion = request.json['asociacion']
        nivel = request.json['nivel']

        dni_existe = Arbitro.query.filter_by(dni=dni).first()
        
        if dni_existe:
            print('arbitro ya existe')
        else:
            nuevo_arbitro(id, nombre, apellido, dni, nacimiento, sexo, asociacion, nivel)
            print(f'arbitro {nombre} {apellido}, creado')
            arbitros = Arbitro.query.all()
            response = jsonify({
                'arbitros': [a.__asdict__() for a in arbitros],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        arbitro = Arbitro.query.filter_by(id=id).first()
        print(arbitro.nombre, arbitro.apellido, arbitro.nacimiento)
        arbitro.id = valores['id']
        arbitro.nombre = valores['nombre']
        arbitro.apellido = valores['apellido']
        arbitro.dni = valores['dni']
        arbitro.nacimiento = valores['nacimiento']
        arbitro.sexo = valores['sexo']
        arbitro.asociacion = valores['asociacion']
        arbitro.nivel = valores['nivel']
        db.session.commit()
        print('arbitro ', id, ' editado')
        arbitros = Arbitro.query.all()
        print([a.__asdict__() for a in arbitros])
        response = jsonify({
            'arbitros': [a.__asdict__() for a in arbitros],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        arbitro = Arbitro.query.filter_by(id=id)
        arbitro.delete()
        db.session.commit()
        print('arbitro ', id, ' eliminado')
        arbitros = Arbitro.query.all()
        print([a.__asdict__() for a in arbitros])
        response = jsonify({
            'arbitros': [a.__asdict__() for a in arbitros],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 