from flask import Flask, render_template, json, request, send_from_directory
import json
import mysql.connector
from werkzeug import generate_password_hash, check_password_hash
import html.parser
import vincent
import csv
import os


app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'info257'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
user = 'root'
password = ''
port = 'localhost'
db = 'info257'


def create_table(material,title_list=None,ns=6):
    table ='<div class="datagrid"><table>                           \
            <thead></thead>                                         \
            <tfoot><tr></tr></tfoot><tbody>'
    i = 0
    for item in material:
        table += '<tr>'
        if i == 0 and title_list != None:
            for title_item in title_list:
                table += '<td>%s' % str(title_item)
                for i in range(ns):
                    table += '&nbsp;'
                table += '</td>'
            i = 1
            table += '</tr><tr>'
        for items in item:
            table += '<td>%s' % str(items)
            for i in range(ns):
                table += '&nbsp;'
            table += '</td>'
        table += '</tr>'
    table += '</tbody></table></div>'
    return table

@app.route('/templates/data/county_data.csv', methods=['GET'])
def county_data():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir,'flask','templates','data'),'county_data.csv')

@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html')

@app.route('/showCounties')
def counties():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT * FROM county;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/county_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['largest_employer','state','county_name','median_wage','population','male_population','female_population','households']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item)
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['Largest Employer','State','County','Median Wage','Population','Male Population','Female Population','Households']
   
    results = html_parser.unescape(create_table(results,title_list2))
    cursor.close()
    connection.close()
    return render_template('counties.html', data=results)

@app.route('/showDebts',methods=['POST','GET'])
def debts():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT * FROM state_debts;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/debts_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['state','average_student_debt','average_credit_card_debt','average_mortgage','average_auto_loan','number_of_bankruptcies']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item[1:-1])
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['State','Average Student Debt','Average Credit Card Debt', 'Average Mortgage','Average Auto Loan','Number of Bankruptcies']
    results = html_parser.unescape(create_table(results,title_list=title_list2, ns=14))
    cursor.close()
    connection.close()
    return render_template('debts.html', data=results)


@app.route('/showEarnings',methods=['POST','GET'])
def earnings():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT * FROM earning;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/earning_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['male_median_wage','female_median_wage','state','county_name']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item[1:-1])
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['Male Median Wage','Feamle Median Wage','State','County Name']
    results = html_parser.unescape(create_table(results,ns=10,title_list=title_list2))
    cursor.close()
    connection.close()
    return render_template('earnings.html', data=results)



@app.route('/showEmployers',methods=['POST','GET'])
def employers():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT * FROM employer;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/employer_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['employer_name','num_employees','founded_year','market_value','company_type','county_name']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item[1:-1])
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['Employer Name','Number Of Employees','Year Founded','Market Value','Company Type','County']
    results = html_parser.unescape(create_table(results,title_list=title_list2))
    cursor.close()
    connection.close()
    return render_template('employers.html', data=results)



if __name__ == "__main__":
    app.run(port=5002)
