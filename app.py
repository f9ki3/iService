from flask import Flask, redirect, render_template,request,jsonify
from iservceModel import *
app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/user')
def user():
    return render_template('user.html')

@app.route('/provider')
def provider():
    return render_template('provider.html')

@app.route('/success_create')
def success_create():
    return render_template('success_create.html')

#API ENDPONTS
@app.route('/create_user', methods=['POST'])
def create_user():
    try:
        # Retrieve the JSON data from the request
        data = request.get_json()
        
        # Extract fields from the JSON data
        fname = data.get('fname')
        lname = data.get('lname')
        email = data.get('email')
        contact = data.get('contact')
        pass_ = data.get('pass')
        vpass = data.get('vpass')

        data = Account().insertAccount(fname, lname, email, contact, pass_, vpass)
        
        # Here, you can process the data (e.g., save it to a database)
        # For demonstration, we'll just return the received data
        response = {
            'data': data
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        # Handle any errors that occur
        return jsonify({'error': str(e)}), 400
    
if __name__ == "__main__":
    app.run(debug=True)