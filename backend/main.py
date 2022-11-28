from flask_cors import CORS

from __init__ import create_app

app = create_app()
cors = CORS(app, resources={r"/*": {'origins':"*"}})

if __name__ == '__main__':
    app.run(debug=True, port=8000)