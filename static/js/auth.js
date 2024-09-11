    $('#create_user').html(`
        <div id="log_page" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
            <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
                <div style="width: 5rem;">
                    <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/iservice.png" alt="Icon">
                </div>
            </div>
            <h2 class="fw-bolder w-100 mb-4 text-center">Create Account</h2>
            <div>
                <div id="valdaton" style="display: none;" class="alert ps-4 alert-danger alert-dismissible fade show" role="alert">
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
            
            <div>
                <div id="prm">
                    <div class="row g-2">
                        <div class="col-6">
                            <input autocomplete="off" id="fname" type="text" placeholder="First Name" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                        </div>
                        <div class="col-6">
                            <input autocomplete="off" id="lname" type="text" placeholder="Last Name" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                        </div>
                    </div>
                    <input autocomplete="off" id="email" type="email" placeholder="Email Address" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                    <input autocomplete="off" id="contact" type="text" placeholder="Contact No" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                </div>
            
                <div id="secure">
                    <input autocomplete="off" id="pass" type="password" placeholder="Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                    <input autocomplete="off" id="vpass" type="password" placeholder="Confirm Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                </div>
            
                <button id="create" class="border w-100 btn-lg fs-6 btn" style="background-color: #ff851b; color: white;">
                    <p id="create_text" class="m-0 p-0">Create</p>
                    <div id="create_loader" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status_user">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
            
                
    
            <p class="text-center mt-3 mb-3">Already has an account? <a style="color: #ff851b; text-decoration: none" href="/">Login</a></p>
            
        </div>
        `);
    
        $('#log_').html(`
            <div id="log_page" class="col-12 col-md-6 col-lg-3" style="color: #252422;">
                        <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
                            <div style="width: 5rem;">
                                <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/iservice.png" alt="Icon">
                            </div>
                        </div>
                        <h2 class="fw-bolder w-100 mb-5 text-center">Welcome to iService</h2>
                        <!-- <div>
                            <div id="log_val" style="display: none;" class="alert ps-4 alert-danger alert-dismissible fade show" role="alert">
                                Incorrect email or password.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div> -->
            
                        <div>
                            <div id="prm">
                                <input autocomplete="off" id="log_email" type="email" placeholder="Email Address" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                                <input autocomplete="off" id="log_password" type="password" placeholder="Enter Password" class="ps-4 form-control mb-3 fs-6 form-control-lg">
                            </div>
            
                            <button id="login" disabled class="border w-100 btn-lg fs-6 btn" style="background-color: #ff851b; color: white;">
                                <p id="login_text" class="m-0 p-0">Login</p>
                                <div id="login_loader" style="display: none;" class="spinner-grow spinner-grow-sm m-1" role="status_user">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </button>
                            
                
                        <p class="text-center mt-3 mb-3">Don't have an account?</p>
                        <div>
                            <a href="/user" class="btn-hover mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                                <i class="bi bi-file-person fs-5 me-4 ms-2"></i> Register as Customer
                            </a>
                            <a href="/provider" class=" mt-3 w-100 btn-hover btn btn-lg fs-6 d-flex border flex-row align-items-center text-muted">
                                <i class="bi bi-lightning-charge fs-5 me-4 ms-2"></i> Register as Service Provider
                            </a>
                        </div>
                    </div>
            `);

    // create user
    $(document).ready(function () {
        $(document).on('keydown', function (e) {
            if (e.keyCode === 13) {  // Check if the key pressed is Enter (key code 13)
                e.preventDefault();  // Prevent default Enter key behavior (e.g., form submission)
                $('#create').trigger('click');  // Trigger the click event for the create button
            }
        });
    
        $('#create').on('click', function (e) {
            e.preventDefault();  // Prevent form submission
            $('#create_text').hide();
            $('#create_loader').show();
            
            setTimeout(function () {
                $('#create_text').show();
                $('#create_loader').hide();
                
                // Get the values from the form fields
                const fname = $('#fname').val().trim();
                const lname = $('#lname').val().trim();
                const email = $('#email').val().trim();
                const contact = $('#contact').val().trim();
                const pass = $('#pass').val().trim();
                const vpass = $('#vpass').val().trim();
    
                // Email validation regex
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                // Contact number validation regex (must start with 09 and have 11 digits)
                const contactRegex = /^09\d{9}$/;
    
                // Reset validation classes and message
                $('input').removeClass('is-valid is-invalid');
                $('#valdaton').hide().text('');  // Hide validation message initially
    
                let isValid = true;  // Flag to track overall validation status_user
    
                // First Name validation
                if (fname === '') {
                    $('#fname').addClass('is-invalid');
                    $('#valdaton').show().html('First Name is required.');
                    console.log('Validation failed: First Name is required.');
                    isValid = false;
                } else {
                    $('#fname').addClass('is-valid');
                }
    
                // Last Name validation
                if (lname === '') {
                    $('#lname').addClass('is-invalid');
                    $('#valdaton').show().html('Last Name is required.');
                    console.log('Validation failed: Last Name is required.');
                    isValid = false;
                } else {
                    $('#lname').addClass('is-valid');
                }
    
                // Email validation
                if (!emailRegex.test(email)) {
                    $('#email').addClass('is-invalid');
                    $('#valdaton').show().html('Please enter a valid email address.');
                    console.log('Validation failed: Invalid email.');
                    isValid = false;
                } else {
                    $('#email').addClass('is-valid');
                }
    
                // Contact number validation
                if (!contactRegex.test(contact)) {
                    $('#contact').addClass('is-invalid');
                    $('#valdaton').show().html('Contact number must start with 09 and be 11 digits long.');
                    console.log('Validation failed: Invalid contact number.');
                    isValid = false;
                } else {
                    $('#contact').addClass('is-valid');
                }
    
                // Password validation
                if (pass === '') {
                    $('#pass').addClass('is-invalid');
                    $('#vpass').addClass('is-invalid');
                    $('#valdaton').show().html('Password is required.');
                    console.log('Validation failed: Password is required.');
                    isValid = false;
                } else if (pass !== vpass) {
                    $('#pass').addClass('is-invalid');
                    $('#vpass').addClass('is-invalid');
                    $('#valdaton').show().html('Passwords do not match.');
                    console.log('Validation failed: Passwords do not match.');
                    isValid = false;
                } else {
                    $('#pass').addClass('is-valid');
                    $('#vpass').addClass('is-valid');
                }
    
                // If all validations pass
                if (isValid) {
                    $('#valdaton').hide();  // Hide validation message if valid
                    console.log('Form submitted successfully.');
                    
                    // Prepare data to send as JSON
                    const formData = {
                        fname: fname,
                        lname: lname,
                        email: email,
                        contact: contact,
                        pass: pass,
                        vpass: vpass
                    };
    
                    // Send the data using AJAX
                    $.ajax({
                        url: '/create_user',  // Replace with your API endpoint
                        type: 'POST',
                        contentType: 'application/json',  // Ensure content type is JSON
                        data: JSON.stringify(formData),  // Convert form data to JSON
                        success: function (response) {
                            if (response.data == 1) {
                                $('#email').removeClass('is-valid').addClass('is-invalid');  // Fixed the ID and class names
                                $('#valdaton').show().html('Email already registered.');
                            } else {
                                window.location.href = '/success_create';  // Fixed location assignment
                            }
                            // Handle success actions here
                        },
                        error: function (error) {
                            console.log('Error in form submission:', error);
                            // Handle error actions here
                        }
                    });                        
                }
            }, 3000);
        });
    });
    
    // Log Account
    $('#log_email, #log_password').on('input', function() {
        let email = $('#log_email').val();
        let password = $('#log_password').val();
        
        if (email !== "" && password !== "") {
            $('#login').prop('disabled', false);  // Enable button if both fields are not empty
        } else {
            $('#login').prop('disabled', true);   // Disable button if either field is empty
        }
    });

    $('#login').on('click', function(){
            let email = $('#log_email').val();
            let pass = $('#log_password').val();
        
            // Ensure inputs are not empty
            if(email === '' || pass === '') {
                alert('Email and password cannot be empty.');
                return;
            }
        
            const formData = {
                email: email,
                pass: pass
            };
        
            // Send the data using AJAX
            $.ajax({
                url: '/log_acc',  // Replace with your API endpoint
                type: 'POST',
                contentType: 'application/json',  // Ensure content type is JSON
                data: JSON.stringify(formData),  // Convert form data to JSON
                success: function (response) {
                    console.log('Success:', response);
                    // Handle success actions here, such as redirecting or showing a success message
                    userType = response.account_type
                    status_user = response.status
                    account_status = response.account_status

                    if (status_user == '0'){
                        if (userType == 'admin'){
                            window.location.href = '/admin';
                        }else if(userType == 'customer'){
                            window.location.href = '/customer';
                        }else if(userType == 'service_provider' && account_status == 'verified' ){
                            window.location.href = '/service_provider';
                        }
                    }else if(status_user == '1'){
                        console.log('Password incorrect')
                    }else if(status_user == '2'){
                        console.log('Email not register')
                    }
                },
                error: function (error) {
                    console.log('Error in form submission:', error);
                    // Handle error actions here, such as showing an error message to the user
                }
            });
        });
    
    
    
    

        
        

    