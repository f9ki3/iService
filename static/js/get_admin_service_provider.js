function get_service_provider(){
    $.ajax({
        type: "GET",
        url: "/get_service_provider",
        dataType: "json",
        success: function (response) {
            // Ensure response is an array of objects
            if (Array.isArray(response)) {
                let tableBody = '';  // Initialize an empty string for table rows
    
                // Iterate over each item in the response
                response.forEach((item) => {
                    // Determine the status text and styling based on the account_status
                    let statusText = item.account_status === 'verified' ? 'Verified' : 'Pending';
                    let statusClass = item.account_status === 'verified' ? 'text-success' : 'text-secondary';
                    let statusBackground = item.account_status === 'verified' ? 'rgb(195, 238, 195)' : 'rgb(238, 221, 195)';
                    let statusColor = item.account_status === 'verified' ? 'rgb(34, 139, 34)' : 'rgb(190, 126, 7)';  // Adjusted for better contrast
    
                    // Create a new table row with the item data
                    tableBody += `
                        <tr style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#service-applicant" 
                            data-id="${item.id}" data-first-name="${item.first_name}" 
                            data-last-name="${item.last_name}" data-email="${item.email}" 
                            data-contact="${item.contact}" data-address="${item.address}" 
                            data-date-created="${item.date_created}" 
                            data-status="${statusText}" data-account-role="${item.account_role}" 
                            data-account-type="${item.account_type}" 
                            data-account-service="${item.account_service}" 
                            data-account-valid-id="${item.account_valid_id}" 
                            data-account-certification="${item.account_certification}">
                            
                            <th scope="row">${item.id}</th>
                            <td>${item.first_name} ${item.last_name}</td>
                            <td>${item.date_created}</td>
                            <td>${item.email}</td>
                            <td><p class="${statusClass} m-0 border-${statusClass} rounded-5 text-center" 
                                   style="background-color: ${statusBackground}; width: 40%; padding: 5px; color: ${statusColor}">
                                ${statusText}
                            </p></td>
                            <td><a href="${item.account_valid_id}" target="_blank">View ID</a></td>
                            <td><a href="${item.account_certification}" target="_blank">View Certification</a></td>
                        </tr>
                    `;
                });
    
                // Insert the generated rows into the table body
                $('#table-service-provider').html(tableBody); // Ensure to replace with actual table body ID
    
                // Add click event listener to rows
                $('#table-service-provider tr').on('click', function () {
                    // Get data attributes from the clicked row
                    const id = $(this).data('id');
                    const firstName = $(this).data('first-name');
                    const lastName = $(this).data('last-name');
                    const email = $(this).data('email');
                    const contact = $(this).data('contact');
                    const address = $(this).data('address');
                    const dateCreated = $(this).data('date-created');
                    const status = $(this).data('status');
                    const accountRole = $(this).data('account-role');
                    const accountType = $(this).data('account-type');
                    const accountService = $(this).data('account-service');
                    const accountValidId = $(this).data('account-valid-id');
                    const accountCertification = $(this).data('account-certification');
    
                    // Populate modal with data
                    $('#modal-id').text(id);
                    $('#modal-first-name').text(firstName);
                    $('#modal-last-name').text(lastName);
                    $('#modal-email').text(email);
                    $('#modal-contact').text(contact);
                    $('#modal-address').text(address);
                    $('#modal-date-created').text(dateCreated);
                    $('#modal-status').text(status);
                    $('#modal-account-role').text(accountRole);
                    $('#modal-account-type').text(accountType);
                    $('#modal-account-service').text(accountService);
                    $('#modal-account-valid-id').attr('href', accountValidId);
                    $('#modal-account-certification').attr('href', accountCertification);
                });
            } else {
                console.log('Unexpected response format:', response);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
    
}

get_service_provider()