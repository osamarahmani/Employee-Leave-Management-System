import mysql.connector

def get_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  
        database="leave_db"
    )
    return conn
