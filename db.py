import mysql.connector

def get_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",    # ← change this to YOUR MySQL password
        database="leave_db1"
    )
    return conn