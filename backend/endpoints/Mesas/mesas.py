from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.mesas.mesas import Mesa, nuevo_mesa
from db import db

mesas = Blueprint('mesas', __name__)

@mesas.route('/mesa', methods=['GET', 'POST', 'PUT', 'DELETE'])
def mesa():
    mesas = Mesa.query.all()
    if request.method == 'GET':
        mesas = Mesa.query.all()
        print([a.__asdict__() for a in mesas])
        response = jsonify({
            'mesas': [a.__asdict__() for a in mesas],
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

        dni_existe = Mesa.query.filter_by(dni=dni).first()
        
        if dni_existe:
            print('mesa ya existe')
        else:
            nuevo_mesa(id, nombre, apellido, dni, nacimiento, sexo)
            print(f'mesa {nombre} {apellido}, creado')
            mesas = Mesa.query.all()
            response = jsonify({
                'mesas': [a.__asdict__() for a in mesas],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        mesa = Mesa.query.filter_by(id=id).first()
        print(mesa.nombre, mesa.apellido, mesa.nacimiento)
        mesa.id = valores['id']
        mesa.nombre = valores['nombre']
        mesa.apellido = valores['apellido']
        mesa.dni = valores['dni']
        mesa.nacimiento = valores['nacimiento']
        mesa.sexo = valores['sexo']
        db.session.commit()
        print('mesa ', id, ' editado')
        mesas = Mesa.query.all()
        print([a.__asdict__() for a in mesas])
        response = jsonify({
            'mesas': [a.__asdict__() for a in mesas],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        mesa = Mesa.query.filter_by(id=id)
        mesa.delete()
        db.session.commit()
        print('mesa ', id, ' eliminado')
        mesas = Mesa.query.all()
        print([a.__asdict__() for a in mesas])
        response = jsonify({
            'mesas': [a.__asdict__() for a in mesas],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 