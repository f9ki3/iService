function accept_provider() {
    let provider_id = $('.modal-id-provider').text();  // Assuming modal-id-provider is a class; if it's an ID, use $('#modal-id-provider')

    if (!provider_id) {
        console.error('Provider ID not found');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/accept_provider",
        data: JSON.stringify({ id: provider_id }),  // Ensure the data is properly formatted as JSON
        contentType: "application/json",  // Set the correct content type
        dataType: "json",
        success: function (response) {
            console.log(response.message);
            if (response.status === "success") {
                // Close the modal on success
                $('.btn-close').click();
                get_service_provider()
            } else {
                console.error('Error:', response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
