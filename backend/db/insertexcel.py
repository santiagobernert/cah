from sqlalchemy import create_engine
import pandas as pd

DB_NAME = 'cah'
USERNAME = 'root'
PASSWORD =  'santi1005' 
#PASSWORD =  '[$Ant:1005]' 

def insert_from_sheet(sheetid, table):
    sheet = f'https://docs.google.com/spreadsheets/d/{sheetid}/gviz/tq?tqx=out:csv&sheet={table}'
    df = pd.read_csv(sheet)
    print(df)
    engine = create_engine(f'mysql+pymysql://{USERNAME}:{PASSWORD}@127.0.0.1:3308/{DB_NAME}')
    df.to_sql(table, con=engine, index=False)
    print('table updated')