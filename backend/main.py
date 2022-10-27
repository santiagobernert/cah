from flask import Flask, request, redirect, url_for, Blueprint, render_template, flash, jsonify
from flask_cors import CORS

from __init__ import create_app

app = create_app()
cors = CORS(app, resources={r"/*": {'origins':"*"}})


@app.route('/')
@app.route('/home')
def home():
    return {'result': 'hola perrito'}


if __name__ == '__main__':
    app.run(debug=True)