from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from db.jugadores.jugadores import Jugador, nuevo_jugador
from db import db
from db.insertexcel import insert_from_sheet
from datetime import datetime

from google.oauth2 import service_account
from googleapiclient.discovery import build

def writesheet(data, rango='jugadores!A1:V'):
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SERVICE_ACCOUNT_FILE = 'E:/Programacion/javascript/React/ArchivosAmebal-CAH/keys.json'

    credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)

    # The ID and range of a sample spreadsheet.
    SPREADSHEET_ID = '1FO6iagLgh4y8iDoteSxOcI_xOogqaOPGJCcG7A4ujCE'
    RANGE_NAME = 'jugadores!A1:V'

    service = build('sheets', 'v4', credentials=credentials)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()

    values = result.get('values', [])
    print('\n\n VALUES \n')
    print(values)

    print('\n\n Data \n')
    print(data)

    request = sheet.values().update(spreadsheetId=SPREADSHEET_ID, range=rango, valueInputOption='USER_ENTERED', body={"values": data}).execute()
    print(request)

    return values



jugadores = Blueprint('jugadores', __name__)




@jugadores.route('/jugador', methods=['GET', 'POST', 'PUT', 'DELETE'])
def jugador():
    jugadores = Jugador.query.all()
    if request.method == 'GET':
        if request.args:
            dni = request.args.get('dni', type=int)
            jugador = Jugador.query.filter_by(dni=dni).first()
            print(jugador.__asdict__())
            response = jsonify({
            'jugador': jugador.__asdict__(),
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response 
        else:
            jugadores = Jugador.query.all()
            print([j.__asdict__() for j in jugadores])
            response = jsonify({
                'jugadores': [j.__asdict__() for j in jugadores],
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
        equipo = request.json['equipo']
        categoria = request.json['categoria']
        club = request.json['club']
        estado = request.json['estado']
        peso = request.json['peso']
        estatura = request.json['estatura']
        mano = request.json['mano']
        posicion = request.json['posicion']
        sanguineo = request.json['sanguineo']
        telefono = request.json['telefono']
        provincia = request.json['provincia']
        departamento = request.json['departamento']
        localidad = request.json['localidad']
        domicilio = request.json['domicilio']
        obrasocial = request.json['obrasocial']
        carnet = request.json['carnet']

        dni_existe = Jugador.query.filter_by(dni=dni).first()
        
        if dni_existe:
            print('jugador ya existe')
        else:
            nuevo_jugador(id, nombre, apellido, dni, nacimiento, sexo, equipo, categoria, club, estado, peso, estatura, mano, posicion, sanguineo, telefono, provincia, departamento, localidad, domicilio, obrasocial, carnet)
            print(f'jugador {nombre} {apellido}, creado')
            jugadores = Jugador.query.all()
            response = jsonify({
                'jugadores': [j.__asdict__() for j in jugadores],
                })
            response.headers.add('Access-Control-Allow-Origin', '*')
            
            writesheet([[v for v in request.json.values()]], f'jugadores!A{id+1}:V{id+1}')

            return response

    
    if request.method == 'PUT':
        print('PUT')
        valores = request.get_json()
        id = valores['id']
        print(valores)
        jugador = Jugador.query.filter_by(id=id).first()
        print(jugador.nombre, jugador.apellido, jugador.nacimiento)
        jugador.id = valores['id']
        jugador.nombre = valores['nombre']
        jugador.apellido = valores['apellido']
        jugador.dni = valores['dni']
        jugador.nacimiento = valores['nacimiento']
        jugador.sexo = valores['sexo']
        jugador.equipo = valores['equipo']
        jugador.categoria = valores['categoria']
        jugador.club = valores['club']
        jugador.estado = valores['estado']
        jugador.peso = valores['peso']
        jugador.estatura = valores['estatura']
        jugador.mano = valores['mano']
        jugador.posicion = valores['posicion']
        jugador.sanguineo = valores['sanguineo']
        jugador.telefono = valores['telefono']
        jugador.provincia = valores['provincia']
        jugador.departamento = valores['departamento']
        jugador.localidad = valores['localidad']
        jugador.domicilio = valores['domicilio']
        jugador.obrasocial = valores['obrasocial']
        jugador.carnet = valores['carnet']
        db.session.commit()
        print('jugador ', id, ' editado')
        jugadores = Jugador.query.all()
        print([j.__asdict__() for j in jugadores])
        response = jsonify({
            'jugadores': [j.__asdict__() for j in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')

        writesheet([[v for v in valores.values()]], f'jugadores!A{jugador.id+1}:V{jugador.id+1}')

        return response

    if request.method == 'DELETE':
        print('delete')
        id = request.get_json()
        print(id)
        jugador = Jugador.query.filter_by(id=id)
        jugador.delete()
        db.session.commit()
        print('jugador ', id, ' eliminado')
        jugadores = Jugador.query.all()
        print([j.__asdict__() for j in jugadores])
        response = jsonify({
            'jugadores': [j.__asdict__() for j in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 

@jugadores.route('/jugador/planilla', methods=['POST'])
def planilla():
    if request.method == 'POST':
        print('post planilla')
        Jugador.query.delete()
        table = 'Jugadores'
        sheetid = request.json
        data = insert_from_sheet(sheetid, table)
        for i in data:
            nuevo_jugador(i['id'], i['nombre'], i['apellido'], i['dni'], datetime.strptime(i['nacimiento'], "%d/%m/%Y") , i['sexo'], i['equipo'], i['categoria'], i['club'], i['estado'], i['peso'], i['estatura'], i['mano'], i['posicion'], i['sanguineo'], i['telefono'], i['provincia'], i['departamento'], i['localidad'], i['domicilio'], i['obrasocial'], i['carnet'])
        jugadores = Jugador.query.all()
        print([a.__asdict__() for a in jugadores])
        response = jsonify({
            'jugadores': [a.__asdict__() for a in jugadores],
            })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response