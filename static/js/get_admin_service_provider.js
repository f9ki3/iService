const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 1;
let serviceProviders = [];
let filteredProviders = []; // Holds filtered results
let currentStatusFilter = 'all'; // Current status filter
let currentSearchQuery = ''; // Current search query

function get_service_provider(page = 1) {
    $.ajax({
        type: "GET",
        url: "/get_service_provider",
        dataType: "json",
        success: function (response) {
            if (Array.isArray(response)) {
                serviceProviders = response;
                applyFilters(page); // Apply filters and update pagination
            } else {
                console.log('Unexpected response format:', response);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
}

function applyFilters(page = 1) {
    currentPage = page;
    
    // Filter by status
    filteredProviders = serviceProviders.filter(provider => {
        if (currentStatusFilter === 'all') return true;
        return provider.account_status === currentStatusFilter;
    });

    // Further filter by search query
    filteredProviders = filteredProviders.filter(provider => {
        if (currentSearchQuery.trim() === '') return true;
        const lowerCaseQuery = currentSearchQuery.toLowerCase();
        const fullName = `${provider.first_name} ${provider.last_name}`.toLowerCase();
        return fullName.includes(lowerCaseQuery) || 
               provider.email.toLowerCase().includes(lowerCaseQuery);
    });

    // Update total pages and render table
    totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    renderTable(currentPage);
    updatePagination(currentPage);
}

function renderTable(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = filteredProviders.slice(start, end);

    let tableBody = '';

    if (itemsToShow.length === 0) {
        tableBody = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
    } else {
        itemsToShow.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

        itemsToShow.forEach((item) => {
            let statusText = item.account_status === 'verified' ? 'Verified' : 'Pending';
            let statusClass = item.account_status === 'verified' ? 'text-success' : 'text-secondary';
            let statusBackground = item.account_status === 'verified' ? 'rgb(195, 238, 195)' : 'rgb(238, 221, 195)';
            let statusColor = item.account_status === 'verified' ? 'rgb(34, 139, 34)' : 'rgb(190, 126, 7)';

            tableBody += `
                <tr class="service-provider" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#service-applicant" 
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
    }

    $('#table-service-provider').html(tableBody);

    $('#table-service-provider tr').on('click', function () {
    
        // Log the status to the console for debugging
        
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

        // console.log(status);/ 
        // Check if the status is 'verified' and show/hide the modal footer accordingly
        if (status === 'Verified') {
            $('.modal-footer-service-provider').hide();
        } else {
            $('.modal-footer-service-provider').show();
        }

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
}

function updatePagination(current) {
    if (totalPages <= 0) {
        $('#page-numbers').html('');
        $('#prev-page').addClass('disabled');
        $('#next-page').addClass('disabled');
        return;
    }

    let pageNumbers = '';
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);

    if (current > 3) {
        pageNumbers += `<li><a class="page-link border-none text-muted" href="#" data-page="1">1</a></li>`;
        if (current > 4) {
            pageNumbers += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers += `<li class="page-item ${i === current ? '' : ''}">
                            <a class="page-link border-none text-muted" href="#" data-page="${i}">${i}</a>
                        </li>`;
    }

    if (current < totalPages - 2) {
        if (current < totalPages - 3) {
            pageNumbers += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        pageNumbers += `<li><a class="page-link border-none text-muted" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }

    $('#page-numbers').html(pageNumbers);

    $('#prev-page').toggleClass('disabled', current === 1);
    $('#next-page').toggleClass('disabled', current === totalPages);

    $('#prev-page a').off('click').on('click', function (e) {
        e.preventDefault();
        if (current > 1) {
            get_service_provider(current - 1);
        }
    });

    $('#next-page a').off('click').on('click', function (e) {
        e.preventDefault();
        if (current < totalPages) {
            get_service_provider(current + 1);
        }
    });

    $('#page-numbers a').off('click').on('click', function (e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page !== current) {
            get_service_provider(page);
        }
    });
}

function filterProviders(query) {
    currentSearchQuery = query;
    applyFilters(currentPage); // Apply filters after search
}

// Event listener for search input
$('#search-input').on('input', function() {
    const query = $(this).val();
    filterProviders(query);
});

// Event listeners for status buttons
$('#btn-all').on('click', function() {
    currentStatusFilter = 'all';
    applyFilters(currentPage);
});

$('#btn-pending').on('click', function() {
    currentStatusFilter = 'not_verified'; // Adjusted to match the status in the data
    applyFilters(currentPage);
});

$('#btn-verified').on('click', function() {
    currentStatusFilter = 'verified';
    applyFilters(currentPage);
});

// Initial call to populate data and set up pagination
get_service_provider();

