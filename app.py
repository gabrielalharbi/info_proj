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
    table ='<div class="datagrid"><table border=1 frame=void rules="rows">                           \
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

@app.route('/templates/data/debts_data.csv', methods=['GET'])
def debt_data():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir,'flask','templates','data'),'debts_data.csv')


@app.route('/templates/data/earning_data.csv', methods=['GET'])
def earning_data():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir,'flask','templates','data'),'earning_data.csv')


@app.route('/templates/data/county_deviation_data.csv', methods=['GET'])
def county_deviation_data():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir,'flask','templates','data'),'county_deviation_data.csv')


@app.route('/showState')
def state():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT * FROM state;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/employer_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['state_name','median_wage','state_finances','number_of_counties']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item)
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['State Name','Median Wage','State Revenue (in Billions)','Number of Counties']
    results = html_parser.unescape(create_table(results,title_list=title_list2))
    query2 = """SELECT b.county_name, 
                        b.median_wage/a.median_wage as county_deviation,
                        c.median_male_earnings_full_time/a.median_wage as male_deviation, 
                        c.median_female_earnings_full_time/a.median_wage as female_deviation 
                FROM state a 
                JOIN county 
                    b on a.state_name = b.state
                JOIN earning
                    c on c.County_Name = b.county_name"""
    cursor.execute(query2)
    results2 = cursor.fetchall()
    f=open('templates/data/county_deviation_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['county_name','county_deviation','male_deviation','female_deviation']
    for item in results2:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item)
    f.close()
    title_list2 = ['County Name', 'County Wage Deviation', 'Male Wage Deviation', 'Female Wage Deviation']
    results2 = html_parser.unescape(create_table(results2,title_list=title_list2))

    cursor.close()
    connection.close()
    return render_template('state.html', data=results, results=results2)



@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html')

@app.route('/showCounties')
def counties():
    connection = mysql.connector.connect(user=user,password=password,host=port,database=db)
    cursor = connection.cursor(buffered=True)
    query = 'SELECT *, (male_population/female_population) as male_female_income FROM county;'
    cursor.execute(query)
    results = cursor.fetchall()
    data = results
    f=open('templates/data/county_data.csv','w+')
    csvwriter = csv.writer(f)
    i = 0
    title_list = ['largest_employer','state','county_name','median_wage','population','male_population','female_population','households','male_female_income']
    title_list = title_list[1:]
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item[1:])
    f.close()
    html_parser = html.parser.HTMLParser()
    title_list2 = ['Largest Employer','State','County','Median Wage','Population','Male Population','Female Population','Households']
    title_list2 = title_list2[1:]
    query2 = 'SELECT county_name,state,median_wage,population,male_population,female_population,households from county;'
    cursor.execute(query2)
    results = cursor.fetchall()
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
    title_list = ['state','debt_type','debt_amount']
    debt_types = ['average_student_debt','average_credit_card_debt','average_mortgages','average_auto_loan']
    for i in range(len(debt_types)):
        if i == 0:
            csvwriter.writerow(title_list)
        new_list = [data[0][0],debt_types[i],data[0][i+1]]
        csvwriter.writerow(new_list)
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
    title_list = ['County_Name','Total_households','Total_households_Less_than_10000','Percent_Total_households_Less_than_10000','Total_households_10000_14999',
    'Percent_Total_households_10000_14999','Total_households_15000_24999','Percent_Total_households_15000_to_24999','Total_households_25000_to_34999',
    'Percent_Total_households_25000_34999','Total_households_35000_to_49999','Percent_Total_households_35000_to_49999','Total_households_50000_to_74999',
    'Percent_Total_households_50000_to_74999','Total_households_75000_to_99999','Percent_Total_households_75000_to_99999','Total_households_100000_to_149999',
    'Percent_Total_households_100000_to_149999','Total_households_150000_to_199999','Percent_Totalhouseholds_150000_to_199999','Total_households_200000_more',
    'Percent_Total_households_200000_more','Total_households_Median_household_income','Total_households_Mean_household_income','Median_earnings_for_workers',
    'Median_earnings_for_male_fulltime','Median_earnings_for_female_fulltime']
    for item in data:
        if i == 0:
            i = i + 1
            csvwriter.writerow(title_list)
        csvwriter.writerow(item)
    f.close()
    title_list = [title_list[0],'Median_Household_Wage',title_list[-2],title_list[-1]]
    html_parser = html.parser.HTMLParser()
    title_list2 = []
    for item in title_list:
        title_list2.append(item.replace('_'," "))
    query2 = 'SELECT a.county_name, median_wage, median_male_earnings_full_time, median_female_earnings_full_time FROM earning a JOIN county b on a.county_name=b.county_name;'
    cursor.execute(query2)
    results = cursor.fetchall()
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
