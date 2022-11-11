from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.categorias.categorias import Categoria, nueva_categoria
from db import db

categorias = Blueprint('categorias', __name__)

@categorias.route('/categoria', methods=['GET'])
def categoria():
    categorias = Categoria.query.all()
    if request.method == 'GET':
        print([c.__asdict__() for c in categorias])
        response = jsonify({
            'categorias': [c.__asdict__() for c in categorias],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

