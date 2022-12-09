from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from db.usuarios.usuarios import Usuario, nuevo_usuario
from db import db
from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

login = Blueprint('login', __name__)
jwt = JWTManager(login)




@login.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        usuario = request.form.get('username')
        email = request.form.get('email')
        contraseña = request.form.get('contraseña')
        contraseña2 = request.form.get('contraseña2')

        us_existe = Usuario.query.filter_by(nombre=usuario).first()
        email_existe = Usuario.query.filter_by(nombre=email).first()
        
        if us_existe or email_existe:
            print('usuario ya existe')
            flash('usuario ya existe')
        elif email_existe:
            print('email ya usado')
            flash('email ya usado')
        elif contraseña != contraseña2:
            flash('las constraseñas no coinciden')
        elif contraseña == '':
                flash('contraseña incompleta')
        elif len(contraseña) < 6:
            print('contraseña muy corta')
            flash('contraseña muy corta')
        elif len(usuario) < 3:
            flash('nombre de usuario muy corto')
        else:
            nu = nuevo_usuario(usuario, email, generate_password_hash(contraseña, method='sha256'))
            print('usuario creado')
            flash('usuario creado')
            login_user(nu, remember=True)
            return redirect(url_for('login.log_in'))

    return render_template('index.html', pagina='signup', error='no se encontro usuario', usuario='')

@login.route('/login', methods=['GET'])
def log_in():
    if request.method == 'GET':
        dni = request.args['dni']
        contraseña = request.args['password']
        usuario = Usuario.query.filter_by(dni=dni).first()
        if usuario:
            #if check_password_hash(usuario.contraseña, contraseña):
            if usuario.contraseña == contraseña:
                print('Logged in successfully!')
                print(f'Usuario {usuario.nombre} {usuario.apellido} {dni}, logueado')
                token = create_access_token(identity=dni)
                response = jsonify(access_token=token, usuario=usuario.__asdict__())
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            else:
                print('Incorrect password, try again.')
                flash('Incorrect password, try again.')
                return jsonify({'error': 'contraseña incorrecta'}), 401
        else:
            print('User does not exist.')
            flash('User does not exist.')
            return jsonify({'error': 'usuario no existe'}), 404

    return jsonify({'error': 'algo'})

@login_required
@login.route('/logout')
def logout():
    logout_user(current_user)
    return redirect(url_for('paginas.home'))


@login.route('/usuario', methods=['GET', 'POST', 'PUT', 'DELETE'])
def usuario():
    usuarios = Usuario.query.all()
    print([u.__asdict__() for u in usuarios])
    if request.method == 'GET':
        usuarios = Usuario.query.all()
        response = jsonify({
            'usuarios': [u.__asdict__() for u in usuarios],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    if request.method == 'POST':
        id = request.json['id']
        nombre = request.json['nombre']
        apellido = request.json['apellido']
        dni = request.json['dni']
        email = request.json['email']
        contraseña = request.json['contraseña']
        rol = request.json['rol']

        id_existe = Usuario.query.filter_by(id=id).first()
        dni_existe = Usuario.query.filter_by(dni=dni).first()
        
        if id_existe:
            print('id ya existe')
            return 'id ya existe'
        if dni_existe:
            print('usuario ya existe')
            return 'usuario ya existe'
        else:
            nuevo_usuario(id, nombre, apellido, dni, email, contraseña, rol)
            print(f'Usuario {id} {nombre} {apellido} {dni} {rol}, creado')
            usuarios = Usuario.query.all()
            response = jsonify({
            'usuarios': [u.__asdict__() for u in usuarios],
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        usuario = Usuario.query.filter_by(id=id).first()
        #clubes_relacionados = Club.query.filter_by(usuario=id)
        #clubes_relacionados.update({'usuario': None})
        print(usuario.nombre, usuario.dni, usuario.email)
        usuario.id = valores['id']
        usuario.nombre = valores['nombre']
        usuario.apellido = valores['apellido']
        usuario.dni = valores['dni']
        usuario.email = valores['email']
        usuario.contraseña = valores['contraseña']
        usuario.rol = valores['rol']
        db.session.commit()
        print('Usuario ', id, ' editado')
        usuarios = Usuario.query.all()
        print([u.__asdict__() for u in usuarios])
        response = jsonify({
            'usuarios': [u.__asdict__() for u in usuarios],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        usuario = Usuario.query.filter_by(id=id)
        usuario.delete()
        db.session.commit()
        print('Usuario ', id, ' eliminado')
        usuarios = Usuario.query.all()
        print([u.__asdict__() for u in usuarios])
        response = jsonify({
            'usuarios': [u.__asdict__() for u in usuarios],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@login.route('/crear', methods=['GET'])
def crear_usuarios():
    return