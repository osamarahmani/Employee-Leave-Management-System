import mysql.connector

DB_HOST = "acela.proxy.rlwy.net"
DB_USER = "root"
DB_PASS = "mAvvZTaGUuPXxMBkSLojDeGQyaUnuhvu"   # ← paste the password after clicking show
DB_NAME = "railway"
DB_PORT = 59903

def setup():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST, user=DB_USER,
            password=DB_PASS, database=DB_NAME, port=DB_PORT
        )
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                name       VARCHAR(100) NOT NULL,
                email      VARCHAR(100) NOT NULL UNIQUE,
                password   VARCHAR(100) NOT NULL,
                role       ENUM('employee','admin') NOT NULL,
                department VARCHAR(100)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leaves (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                user_id    INT NOT NULL,
                leave_type VARCHAR(100),
                from_date  DATE,
                to_date    DATE,
                days       INT,
                reason     TEXT,
                status     ENUM('pending','approved','declined') DEFAULT 'pending',
                admin_note TEXT,
                applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        if count == 0:
            cursor.executemany(
                "INSERT INTO users (name,email,password,role,department) VALUES (%s,%s,%s,%s,%s)",
                [
                    ('Alice Johnson','alice@company.com','alice123','employee','Engineering'),
                    ('Bob Smith','bob@company.com','bob123','employee','Marketing'),
                    ('Admin User','admin@company.com','admin123','admin','HR'),
                ]
            )
            conn.commit()
            print("✅ Default users inserted.")
        else:
            print(f"✅ Users already exist ({count} found).")

        conn.close()
        print("🎉 Database setup complete!")

    except mysql.connector.Error as e:
        print(f"❌ Database error: {e}")
        exit(1)

def get_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        port=DB_PORT
    )
