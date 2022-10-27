from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.imagenes.imagenes import Imagen, nueva_imagen
from db import db

imagenes = Blueprint('imagenes', __name__)

@imagenes.route('/imagenes/<img>', methods=['GET'])
def imagen(img):
    if not img:
        response = jsonify( {'data': 'imagen'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    imagen = Imagen.query.filter(Imagen.imagen.contains(img)).first()
    response = jsonify( {'img': imagen})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response