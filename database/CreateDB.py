import sqlite3
db = sqlite3.connect('RecordsDatabase.sqlite')

db.execute('DROP TABLE IF EXISTS transaction_table')
db.execute('DROP TABLE IF EXISTS category_table')

db.execute('''CREATE TABLE transaction_table(
    transaction_id integer PRIMARY KEY,
    category_id integer NOT NULL,
    amount float NOT NULL,
    memo text,
    process_date integer NOT NULL
)''')

db.execute('''CREATE TABLE category_table(
    category_id integer PRIMARY KEY,
    category_name text NOT NULL
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO transaction_table(category_id,amount,memo,process_date)
    VALUES('1','300','nothing','1274716800000')
''')

cursor.execute('''
    INSERT INTO transaction_table(category_id,amount,memo,process_date)
    VALUES('2','100','nothing','1374716800000')
''')

cursor.execute('''
    INSERT INTO transaction_table(category_id,amount,memo,process_date)
    VALUES('2','50','nothing','1374716800000')
''')

cursor.execute('''
    INSERT INTO transaction_table(category_id,amount,memo,process_date)
    VALUES('1','75','nothing','1374716800000')
''')

cursor.execute('''
    INSERT INTO transaction_table(category_id,amount,memo,process_date)
    VALUES('1','150','nothing','1364716800000')
''')

cursor.execute('''
    INSERT INTO category_table(category_name)
    VALUES('food')
''')

cursor.execute('''
    INSERT INTO category_table(category_name)
    VALUES('movie')
''')

db.commit()
db.close()