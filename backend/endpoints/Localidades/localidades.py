from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
import requests
from urllib.parse import urlencode

API_BASE_URL_PROVINCIAS = "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"
API_BASE_URL_LOCALIDADES = "https://apis.datos.gob.ar/georef/api/departamentos?"

def get_provincias():
    return requests.get(API_BASE_URL_PROVINCIAS).json()['provincias']

def get_localidades(provincia=''):
    url = f"{API_BASE_URL_LOCALIDADES}provincia={provincia}&campos=nombre&max=20"
    return requests.get(url).json()['departamentos']

localidades = get_localidades('mendoza')
print([i['nombre'] for i in localidades])


localidades = Blueprint('localidades', __name__)

@localidades.route('/localidad', methods=['GET'])
def localidad():
    if request.method == 'GET':
        nombre = request.args['provincia']
        localidades = get_localidades(nombre)
        response = jsonify({
            'localidades': localidades
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

@localidades.route('/provincia', methods=['GET'])
def localidad():
    if request.method == 'GET':
        provincias = get_provincias()
        response = jsonify({
            'localidades': provincias
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response