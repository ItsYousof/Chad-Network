document.addEventListener('contextmenu', function(e) {
    // Prevent the default context menu
    e.preventDefault();
    
    // Show the custom menu
    var customMenu = document.getElementById('custom-menu');
    customMenu.style.display = 'block';
    customMenu.style.left = e.pageX + 'px';
    customMenu.style.top = e.pageY + 'px';
});

// Hide the custom menu when clicking outside of it
document.addEventListener('click', function(e) {
    var customMenu = document.getElementById('custom-menu');
    customMenu.style.display = 'none';
});