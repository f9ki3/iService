    $('#auth1').html(`
        
        `);

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
        
                    let isValid = true;  // Flag to track overall validation status
        
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
        
        
        

    