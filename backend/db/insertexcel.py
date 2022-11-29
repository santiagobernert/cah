from sqlalchemy import create_engine
import pandas as pd, numpy as np

DB_NAME = 'cah'
USERNAME = 'root'
PASSWORD =  'santi1005' 
#PASSWORD =  '[$Ant:1005]' 

def insert_from_sheet(sheetid, table):
    sheet = f'https://docs.google.com/spreadsheets/d/{sheetid}/gviz/tq?tqx=out:csv&sheet={table}'
    df = pd.read_csv(sheet)
    df = df.replace({np.NaN:None})
    columns = df.columns
    #engine = create_engine(f'mysql+pymysql://{USERNAME}:{PASSWORD}@127.0.0.1:3308/{DB_NAME}')
    #df.to_sql(table, con=engine, if_exists='replace', index=False, method='multi')
    data = []
    for i, row in df.iterrows():
        data.append({})
        for c in columns:
            data[i][c] = row[c]
    return data