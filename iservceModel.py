import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('service.db')

class Account(Database):
    def createTableAccount(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                contact TEXT NOT NULL,
                password TEXT NOT NULL,
                confirm_password TEXT NOT NULL,
                date_created TEXT DEFAULT (datetime('now')),
                address TEXT,
                account_type TEXT,
                account_status TEXT,
                account_valid_id TEXT,
                account_certification TEXT
            );
        ''')
        conn.commit()
        conn.close()

    def insertAccount(self, first_name, last_name, email, contact, password, confirm_password):
        conn = self.conn
        cursor = conn.cursor()

        # Check if the email already exists
        cursor.execute('''
            SELECT COUNT(*) FROM accounts WHERE email = ?
        ''', (email,))
        email_exists = cursor.fetchone()[0]

        if email_exists:
            conn.close()
            return 1  # Email already exists

        # Insert the new account
        cursor.execute('''
            INSERT INTO accounts (
                first_name, 
                last_name, 
                email, 
                contact, 
                password, 
                confirm_password, 
                date_created, 
                account_type, 
                account_status
            ) VALUES (
                ?, ?, ?, ?, ?, ?, 
                datetime('now'), 'user', 'verified'
            );
        ''', (first_name, last_name, email, contact, password, confirm_password))

        conn.commit()
        conn.close()
        return 0  # Successful insertion


        
        


if __name__ == "__main__":
    pass