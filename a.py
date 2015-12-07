
import json
import csv
import mysql.connector
user = 'root'
password = ''
port = 'localhost'
db = 'info257'
connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
cursor = connection.cursor(buffered=True)
query = 'SELECT * FROM county;'
cursor.execute(query)
results = cursor.fetchall()
data = results
f=open('county_data.tsv','w+')
csvwriter = csv.writer(f)
for item in data:
    csvwriter.writerow(item)
f.close()