from google.oauth2 import service_account
from googleapiclient.discovery import build
from db.usuarios.usuarios import nuevo_usuario
from werkzeug.security import generate_password_hash

def insertvalues():
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
    
    values = []
    for i in result.get('values', []):
        if i[1] != 'nombre':
            values.append([i[0],i[1], i[2], i[3], f'{i[1][:1].lower()}{i[2][:1].lower()}{i[3][-3:]}'])

    print(values)
    for i in values:
        nuevo_usuario(i[0], i[1], i[2], i[3], f'{i[1].lower()}{i[2].lower()}@gmail.com', generate_password_hash(i[4], method='sha256'), 1)
        print('usuario creado', i[0], i[1], i[2], i[3], f'{i[1].lower()}{i[2].lower()}@gmail.com', i[4])

    return values