from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.roles.roles import Rol, nuevo_rol
from db import db

roles = Blueprint('roles', __name__)

@roles.route('/roles', methods=['GET'])
def rol():
    if request.method == 'GET':
        roles = Rol.query.all()
        response = jsonify( [r.__asdict__() for r in roles])
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response