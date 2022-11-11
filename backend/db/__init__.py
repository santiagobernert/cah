from flask_sqlalchemy import SQLAlchemy
import os
from pymysql import connect, Error

db = SQLAlchemy()
DB_NAME = 'cah'
USERNAME = 'root'
#PASSWORD =  'santi1005' 
PASSWORD =  '[$Ant:1005]' 
#print(os.getenv('MYSQL_PASSWORD'))

show_db_query = "SHOW DATABASES"

'''
try:
    connection = connect(
        host="127.0.0.1",
        port=3308,
        user=USERNAME,
        password=PASSWORD
    )
    cur = connection.cursor()
    print('conexion')
    cur.execute(query)
    print('capo')
except Error as e:
        print(e)

try:
    connection = connect(
        host="127.0.0.1",
        port=3306,
        user=USERNAME,
        #password=PASSWORD
    )
    create_db_query = f"CREATE DATABASE {DB_NAME}"
    cur = connection.cursor()
    print('conexion')
    cur.execute(create_db_query)
    print('db creada')
except Error as e:
    try:
        connection = connect(
            host="127.0.0.1",
            port=3306,
            user=USERNAME,
            #password=PASSWORD,
            database='amebal'
        )
        cur = connection.cursor()
        cur.execute(show_db_query)
        for db in cur:
            print(db)
    except Error as e:
        print(e)

'''
def create_database(app):
    if not os.path.exists('backend/' + DB_NAME):
        db.create_all(app=app)
        print('Base de datos conectada')