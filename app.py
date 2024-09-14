from flask import Flask, redirect, render_template,request,jsonify,session
from iserviceModel import *
import os

app = Flask(__name__)

#Configuration
# Define paths for saving files
UPLOAD_FOLDER_FILES = 'static/files'
UPLOAD_FOLDER_UPLOADS = 'static/uploads'

app.config['UPLOAD_FOLDER_FILES'] = UPLOAD_FOLDER_FILES
app.config['UPLOAD_FOLDER_UPLOADS'] = UPLOAD_FOLDER_UPLOADS

# Ensure directories exist
if not os.path.exists(UPLOAD_FOLDER_FILES):
    os.makedirs(UPLOAD_FOLDER_FILES)

if not os.path.exists(UPLOAD_FOLDER_UPLOADS):
    os.makedirs(UPLOAD_FOLDER_UPLOADS)

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

@app.route('/logout')
def logout():
    # session.clear()
    return redirect('/')

@app.route('/customer')
def customer():
    return render_template('customer.html')

@app.route('/service_provider')
def service_provider():
    return render_template('service_provider.html')

@app.route('/success_create_service', methods=['GET'])
def success_create_service():
    return render_template('success_create_service.html')

@app.route('/not_verified', methods=['GET'])
def not_verified():
    return render_template('not_verified.html')

# administrator
@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/admin_service_provider')
def admin_service_provider():
    return render_template('admin_service_provider.html')

@app.route('/admin_service_offer')
def admin_service_offer():
    return render_template('admin_service_offer.html')


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

@app.route('/log_acc', methods=['POST'])
def log_acc():
    try:
        # Retrieve the JSON data from the request
        data = request.get_json()

        # Extract email and password from the JSON data
        email = data.get('email')
        passw = data.get('pass')

        if not email or not passw:
            return jsonify({'error': 'Email or password is missing.'}), 400

        # Call your method to handle the login logic
        # Make sure Account().log_account(email=email, passw=passw) is a valid call
        result = Account().log_account(email, passw)

        return jsonify(result), 200
    
    except ValueError as ve:
        # Handle specific errors
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        # Handle general errors
        return jsonify({'error': 'An unexpected error occurred: ' + str(e)}), 500

@app.route('/create_user_service', methods=['POST'])
def create_user_service():
    try:
        # Get form data
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        email = request.form.get('email')
        contact = request.form.get('contact')
        passw = request.form.get('pass')
        vpass = request.form.get('vpass')
        address = request.form.get('address')
        service_role = request.form.get('serviceRole')

        # Check if files are uploaded
        valid_id = request.files.get('valid_id')
        certificate = request.files.get('certificate')

        # Validation check (this can be extended as needed)
        if not fname or not lname or not email or not contact or not passw or not vpass or not address:
            return jsonify({'error': 'All fields are required!'}), 400

        # Check if passwords match
        if passw != vpass:
            return jsonify({'error': 'Passwords do not match!'}), 400

        # Save valid_id if it exists
        valid_id_filename = None
        if valid_id:
            valid_id_filename = os.path.join(app.config['UPLOAD_FOLDER_FILES'], valid_id.filename)
            valid_id.save(valid_id_filename)

        # Save certificate if it exists
        certificate_filename = None
        if certificate:
            certificate_filename = os.path.join(app.config['UPLOAD_FOLDER_FILES'], certificate.filename)
            certificate.save(certificate_filename)

        # Handle form data saving logic here (e.g., database)
        # Call the function to create the service account, passing the collected data dynamically
        Account().createServiceAccount(
            fname=fname,
            lname=lname,
            email=email,
            contact=contact,
            password=passw,
            confirm_password=vpass,
            address=address,
            service_role=service_role,
            valid_id_filename=valid_id_filename,
            certificate_filename=certificate_filename
        )

        # Example response for success
        return jsonify({'message': 'User service created successfully!'}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

@app.route('/get_service_provider', methods=['GET'])
def get_service_provider():
    data = Account().getAccountsServiceProvider()
    return jsonify(data)

@app.route('/accept_provider', methods=['POST'])
def accept_provider():
    data = request.get_json()  # Get JSON data from the request
    id = data.get('id')  # Extract 'id' from the data
    
    if id:
        try:
            # Assuming Account().updateAcceptProvider(id) is performing the update
            Account().updateAcceptProvider(id)
            return jsonify({"status": "success", "message": "Provider accepted successfully"}), 200
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500  # Return error message if update fails
    else:
        return jsonify({"status": "error", "message": "ID not provided"}), 400


    
if __name__ == "__main__":
    app.run(debug=True)