$(document).ready(function () {
    $('.nav-link').on('click', function (e) {
        e.preventDefault();
        let pageNumber = $(this).data('page');
        changePage(pageNumber);
    });
    
    function changePage(pageNumberz) {
        // Hide all pages
        $('.page').hide();
        
        // Show the selected page
        $('#page' + pageNumberz).show();
    }
});
