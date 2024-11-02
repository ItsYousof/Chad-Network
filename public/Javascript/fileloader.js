function loadFile(event) {
    var file = event.target.files[0];
    var objectURL = URL.createObjectURL(file);
    localStorage.setItem('objectURL', objectURL);
    document.getElementById('fileInfo').innerText = "File: " + file.name;
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('loadButton').style.display = 'block';
}


let folderHandle;

async function selectFolder() {
    try {
        // Request access to a folder
        folderHandle = await window.showDirectoryPicker();
        const indexFile = await findIndexHtml(folderHandle);
        
        if (indexFile) {
            document.getElementById('fileInfo').innerText = "Found: index.html";
            document.getElementById('fileInfo').style.display = 'block';
            document.getElementById('loadButton').style.display = 'block';

            // Store the file URL for loading later
            const objectURL = await fileToUrl(indexFile);
            localStorage.setItem('objectURL', objectURL);
        } else {
            document.getElementById('fileInfo').innerText = "index.html not found in folder.";
        }
    } catch (error) {
        console.error("Folder selection was canceled or failed.", error);
    }
}

async function findIndexHtml(folderHandle) {
    for await (const entry of folderHandle.values()) {
        if (entry.kind === 'file' && entry.name === 'index.html') {
            return entry;
        }
    }
    return null;
}

async function fileToUrl(fileHandle) {
    const file = await fileHandle.getFile();
    return URL.createObjectURL(file);
}

async function loadContent() {
    const objectURL = localStorage.getItem('objectURL');
    const newWindow = window.open(objectURL, '_blank');
    newWindow.focus();

    // Release the object URL when done
    newWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(objectURL));
}