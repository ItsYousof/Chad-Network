function loadFile(event) {
    var file = event.target.files[0];
    var objectURL = URL.createObjectURL(file);
    localStorage.setItem('objectURL', objectURL);
    document.getElementById('fileInfo').innerText = "File: " + file.name;
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('loadButton').style.display = 'block';
}

function loadContent() {
    var objectURL = localStorage.getItem('objectURL');
    var newWindow = window.open(objectURL, '_blank');
    newWindow.focus();
}