from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.articulos.articulos import Articulo, nuevo_articulo
from db import db

articulos = Blueprint('articulos', __name__)

@articulos.route('/articulo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articulo():
    articulos = Articulo.query.all()
    if request.method == 'GET':
        if request.args:
            id = request.args.get('id', type=int)
            articulo = Articulo.query.filter_by(id=id).first()
            print(articulo.__asdict__())
            response = jsonify({
            'articulo': articulo.__asdict__(),
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response 
        else:
            articulos = Articulo.query.all()
            print([a.__asdict__() for a in articulos])
            response = jsonify({
                'articulos': [a.__asdict__() for a in articulos],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response    
    if request.method == 'POST':
        id = request.json['id']
        titulo = request.json['titulo']
        portada = request.json['portada']
        tags = request.json['tags']
        cuerpo = request.json['cuerpo']
        fecha = request.json['fecha']

        id_existe = Articulo.query.filter_by(id=id).first()
        
        if id_existe:
            print('articulo ya existe')
        else:
            nuevo_articulo(id, titulo, portada, tags, cuerpo, fecha)
            print(f'articulo {titulo} {fecha} {tags}, creado')
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
        print(articulo.titulo, articulo.tags, articulo.fecha)
        articulo.id = valores['id']
        articulo.titulo = valores['titulo']
        articulo.portada = valores['portada']
        articulo.tags = valores['tags']
        articulo.cuerpo = valores['cuerpo']
        articulo.fecha = valores['fecha']
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