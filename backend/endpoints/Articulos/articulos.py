from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.pagos.pagos import Pago, nuevo_pago
from db import db

articulos = Blueprint('articulos', __name__)

@articulos.route('/articulo', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articulo():
    pagos = Pago.query.all()
    if request.method == 'GET':
        pagos = Pago.query.all()
        print([p.__asdict__() for p in pagos])
        response = jsonify({
            'pagos': [p.__asdict__() for p in pagos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response    
    if request.method == 'POST':
        id = request.json['id']
        usuario = request.json['usuario']
        fecha = request.json['fecha']
        importe = request.json['importe']
        banco = request.json['banco']

        id_existe = Pago.query.filter_by(id=id).first()
        
        if id_existe:
            print('pago ya existe')
        else:
            nuevo_pago(id, usuario, fecha, importe, banco)
            print(f'pago {usuario} {fecha} {importe} {banco}, creado')
            pagos = Pago.query.all()
            response = jsonify({
                'pagos': [p.__asdict__() for p in pagos],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        pago = Pago.query.filter_by(id=id).first()
        print(pago.nombre, pago.apellido, pago.nacimiento)
        pago.id = valores['id']
        pago.usuario = valores['usuario']
        pago.fecha = valores['fecha']
        pago.importe = valores['importe']
        pago.banco = valores['banco']
        db.session.commit()
        print('pago ', id, ' editado')
        pagos = Pago.query.all()
        print([p.__asdict__() for p in pagos])
        response = jsonify({
            'pagos': [p.__asdict__() for p in pagos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        pago = Pago.query.filter_by(id=id)
        pago.delete()
        db.session.commit()
        print('pago ', id, ' eliminado')
        pagos = Pago.query.all()
        print([p.__asdict__() for p in pagos])
        response = jsonify({
            'pagos': [p.__asdict__() for p in pagos],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 