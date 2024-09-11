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
                datetime('now'), 'customer', 'verified'
            );
        ''', (first_name, last_name, email, contact, password, confirm_password))

        conn.commit()
        conn.close()
        return 0  # Successful insertion

    def log_account(self, email, password):
        conn = self.conn
        cursor = conn.cursor()

        # Check if the email exists and get account details
        cursor.execute('''
            SELECT password, account_type, account_status  FROM accounts WHERE email = ?
        ''', (email,))
        result = cursor.fetchone()

        if result:
            # Check if the provided password matches the stored password
            stored_password, account_type, account_status = result
            if password == stored_password:
                conn.close()
                return {
                    'status': 0,  # Login successful
                    'account_type': account_type, 
                    'account_status': account_status
                }
            else:
                conn.close()
                return {
                    'status': 1,  # Incorrect password
                    'account_type': None, 
                    'account_status': None
                }
        else:
            conn.close()
            return {
                'status': 2,  # Email does not exist
                'account_type': None, 
                'account_status': None
            }



        
        


if __name__ == "__main__":
    pass