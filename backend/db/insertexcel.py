from sqlalchemy import create_engine
import pandas as pd

DB_NAME = 'cah'
USERNAME = 'root'
PASSWORD =  'santi1005' 
#PASSWORD =  '[$Ant:1005]' 

table = 'Asociaciones'
sheetid = '1sU6CAshM2jg9rAsa4pDM59TuNkLP3xnto-7_RplvAMw'
sheet = f'https://docs.google.com/spreadsheets/d/{sheetid}/gviz/tq?tqx=out:csv&sheet={table}'
df = pd.read_csv(sheet)
engine = create_engine(f'mysql+pymysql://{USERNAME}:{PASSWORD}@127.0.0.1:3308/{DB_NAME}')
df.to_sql(table, con=engine, if_exists='replace')