import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser


DB = 'RecordsDatabase.sqlite'

def get_transaction_row(row):
    row_dict = {
        'transaction_id': row[0],
        'category_name': row[1],
        'amount': row[2],
        'memo': row[3],
        'process_date': row[4],
    }

    return row_dict

def get_monthly_report_row(row):
    row_dict = {
        'total': row[0],
        'category_name': row[1],
    }

    return row_dict

def get_category_row(row):
    row_dict = {
        'category_id': row[0],
        'category_name': row[1]
    }

    return row_dict

app = Flask(__name__)

#Transaction queries-------------------------------------------------------------------------------
#get all transaction rows in a selected day
@app.route('/api/transaction/all/<int:startTime>/<int:endTime>', methods=['GET'])
def select_all_transaction(startTime,endTime):

    transaction_range = (
        str(startTime),
        str(endTime),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(''' 
        SELECT t.transaction_id,c.category_name,t.amount,t.memo,t.process_date FROM transaction_table t, category_table c WHERE t.process_date >= ? AND  t.process_date < ? AND t.category_id = c.category_id ORDER BY t.transaction_id
    ''', transaction_range) 
    rows = cursor.fetchall()

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_transaction_row(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200       #return dictionary: 'transaction_id','category_name','amount','memo','process_date'

#selects a single transaction rows
@app.route('/api/transaction/single/<int:transID>', methods=['GET'])
def select_single_transaction(transID):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT t.transaction_id,c.category_name,t.amount,t.memo,t.process_date FROM transaction_table t,category_table c WHERE transaction_id = ? AND t.category_id = c.category_id', (str(transID),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_transaction_row(row)
        return jsonify(row_as_dict), 200    #return dictionary: 'transaction_id','category_name','amount','memo','process_date'
    else:
        return jsonify(None), 200

#insert a new transaction into table
@app.route('/api/transaction', methods=['POST'])
def insert_single_transaction():
    if not request.json:
        abort(404)

    new_transaction = (
        request.json['category_id'],
        request.json['amount'],
        request.json['memo'],
        request.json['date'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO transaction_table(category_id,amount,memo,process_date) 
        VALUES(?,?,?,?)
    ''', new_transaction)

    transaction_id = cursor.lastrowid

    db.commit()

    response = {
        'id': transaction_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#update a single transaction
@app.route('/api/transaction/<int:transID>', methods=['PUT'])
def update_single_transaction(transID):
    if not request.json:
        abort(400)

    if 'transaction_id' not in request.json:
        abort(400)

    if int(request.json['transaction_id']) != transID:
        abort(400)

    update_transaction = (
        request.json['category_id'],
        request.json['amount'],
        request.json['memo'],
        request.json['process_date'],
        str(transID),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE transaction_table 
        SET amount=?,category_id=?,memo=?,date=? 
        WHERE transaction_id=?
    ''', update_transaction)

    db.commit()

    response = {
        'id': transID,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#delete a single transaction
@app.route('/api/transaction/<int:transID>', methods=['DELETE'])
def delete_single_transaction(transID):
    if not request.json:
        abort(400)

    if 'transaction_id' not in request.json:
        abort(400)

    if int(request.json['transaction_id']) != transID:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM transaction_table WHERE transaction_id = ?', (str(transID),))

    db.commit()

    response = {
        'id': transID,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#Monthly Rpoert queries-------------------------------------------------------------------------------
#select sum of amount group by category in selected month
@app.route('/api/transaction/monthlyReport/<int:startMonth>/<int:endMonth>', methods=['GET'])
def select_monthly_transaction_report(startMonth,endMonth):
    transaction_range = (
        str(startMonth),
        str(endMonth),
    )
    
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(''' 
        SELECT SUM(t.amount),c.category_name FROM transaction_table t, category_table c WHERE process_date >= ? AND  process_date < ? AND t.category_id = c.category_id GROUP BY c.category_name ORDER BY SUM(amount)
    ''', transaction_range)     #returns the grouped transactions between selected month. If select Aug 2021, then transaction date >= 1 Aug 2021 AND transaction date < 1 Sept 2021 will be displayed.
    rows = cursor.fetchall()

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_monthly_report_row(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200       #return dictionary: 'total','category_name'

#Category queries-------------------------------------------------------------------------------
#get all category rows
@app.route('/api/category', methods=['GET'])
def select_all_category():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM category_table ORDER BY category_id')
    rows = cursor.fetchall()

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_category_row(row)
        rows_as_dict.append(row_as_dict)

    print(rows_as_dict)

    return jsonify(rows_as_dict), 200       #return dictionary: 'category_id','category_name'

#selects a single category rows
@app.route('/api/category/<int:catID>', methods=['GET'])
def select_single_category(catID):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM category_table WHERE category_id = ?', (str(catID),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_category_row(row)
        return jsonify(row_as_dict), 200    ##return dictionary: 'category_id','category_name'
    else:
        return jsonify(None), 200

#insert a new category into table
@app.route('/api/category', methods=['POST'])
def insert_single_category():
    if not request.json:
        abort(404)

    new_category = (
        request.json['category_name'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO category_table(category_name) 
        VALUES(?)
    ''', new_category)

    category_id = cursor.lastrowid

    db.commit()

    response = {
        'id': category_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#update a single category
@app.route('/api/category/<int:catID>', methods=['PUT'])
def update_single_category(catID):
    if not request.json:
        abort(400)

    if 'category_id' not in request.json:
        abort(400)

    if int(request.json['category_id']) != catID:
        abort(400)

    update_category = (
        request.json['category_name'],
        str(catID),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE category_table 
        SET name=?
        WHERE category_id=?
    ''', update_category)

    db.commit()

    response = {
        'id': catID,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#delete a single category
@app.route('/api/category/<int:catID>', methods=['DELETE'])
def delete_single_category(catID):
    if not request.json:
        abort(400)

    if 'category_id' not in request.json:
        abort(400)

    if int(request.json['category_id']) != catID:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM category_table WHERE category_id = ?', (str(catID),))

    db.commit()

    response = {
        'id': catID,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

if __name__ == '__main__':
#-----------------------------------------------
    #testing space
    
#-----------------------------------------------
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000,
                        type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='192.168.1.192', port=port)

    
