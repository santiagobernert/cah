from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.articulos.articulos import Articulo, nuevo_articulo
from db import db

articulos = Blueprint('articulos', __name__)

@articulos.route('/articulo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articulo():
    articulos = Articulo.query.all()
    if request.method == 'GET':
        articulos = Articulo.query.all()
        print([a.__asdict__() for a in articulos])
        response = jsonify({
            'articulos': [a.__asdict__() for a in articulos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response    
    if request.method == 'POST':
        id = request.json['id']
        usuario = request.json['usuario']
        fecha = request.json['fecha']
        importe = request.json['importe']
        banco = request.json['banco']

        id_existe = Articulo.query.filter_by(id=id).first()
        
        if id_existe:
            print('articulo ya existe')
        else:
            nuevo_articulo(id, usuario, fecha, importe, banco)
            print(f'articulo {usuario} {fecha} {importe} {banco}, creado')
            articulos = Articulo.query.all()
            response = jsonify({
                'articulos': [a.__asdict__() for a in articulos],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        articulo = Articulo.query.filter_by(id=id).first()
        print(articulo.nombre, articulo.apellido, articulo.nacimiento)
        articulo.id = valores['id']
        articulo.usuario = valores['usuario']
        articulo.fecha = valores['fecha']
        articulo.importe = valores['importe']
        articulo.banco = valores['banco']
        db.session.commit()
        print('articulo ', id, ' editado')
        articulos = Articulo.query.all()
        print([a.__asdict__() for a in articulos])
        response = jsonify({
            'articulos': [a.__asdict__() for a in articulos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        articulo = Articulo.query.filter_by(id=id)
        articulo.delete()
        db.session.commit()
        print('articulo ', id, ' eliminado')
        articulos = Articulo.query.all()
        print([a.__asdict__() for a in articulos])
        response = jsonify({
            'articulos': [a.__asdict__() for a in articulos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 