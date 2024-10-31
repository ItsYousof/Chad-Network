const tabName = document.getElementById('Tabname');
const bubbleColor = document.getElementById('bubbleColor');
const aboutBlank = document.getElementById('aboutBlank');
const panicKey = document.getElementById('panicKey');
const panicKeyInput = document.getElementById('panicKeyInput');
const bubbles = document.getElementsByClassName('bubble');
let aboutBlankCheck = localStorage.setItem('aboutBlank', 'false');
const tabIconsDiv = document.getElementById('tab_icons');
let tabIconsList = ['https://pbs.twimg.com/profile_images/1676663837423194112/yw0xwYoT_400x400.jpg', 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Docs.width-500.format-webp.webp', 'https://sites.gsu.edu/tools/files/2015/03/GSlides-logo-xcfzsu.png', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png', 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw'];
let inFrame

try {
  inFrame = window !== top
} catch (e) {
  inFrame = true
}

function setTabName() {
    document.title = tabName.value;
    localStorage.setItem('tabName', tabName.value);
}
document.addEventListener('DOMContentLoaded', () => {
    tabName.value = localStorage.getItem('tabName');
    setTabName();
})

const aboutblankenableed = localStorage.getItem('aboutBlank') === 'false';
function toggleAboutBlank() {
    if (aboutblankenableed) {
        aboutBlankCheck = localStorage.setItem('aboutBlank', 'true');
        console.log('You are now on About:Blank');
    } else {
        aboutBlankCheck = localStorage.setItem('aboutBlank', 'false');
        console.log('You are no longer on About:Blank');
    }
}

function goAboutBlank() {
    console.log(window.location.href);
    var Newindow = window.open('about:blank', '_blank');
    Newindow.document.write('<style>body{margin: 0; padding: 0; overflow: hidden;} iframe{width: 100%; height: 100%; border: 0; position: absolute; margin: 0; padding: 0;}</style>');
    Newindow.document.write('<iframe src=' + window.location.href + '></iframe>');
}
// Call the function to check pop-ups
// checkPopupsBlocked();


document.addEventListener('DOMContentLoaded', () => {
    // checkPopupsBlocked();

    tabIconsList.forEach((tabIcon) => {
        const tabIconDiv = document.createElement('img');
        tabIconDiv.src = tabIcon;
        tabIconDiv.onclick = () => {
            
            switch (tabIconDiv.src) {
                case 'https://pbs.twimg.com/profile_images/1676663837423194112/yw0xwYoT_400x400.jpg':
                    document.querySelector('link[rel="icon"]').href = 'https://pbs.twimg.com/profile_images/1676663837423194112/yw0xwYoT_400x400.jpg';
                    document.title = 'Clever Portal';
                    localStorage.setItem('tabName', 'Clever Portal');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;
                case 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Docs.width-500.format-webp.webp':
                    document.querySelector('link[rel="icon"]').href = 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Docs.width-500.format-webp.webp';
                    document.title = 'Google Docs';
                    localStorage.setItem('tabName', 'Google Docs');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;
                case 'https://sites.gsu.edu/tools/files/2015/03/GSlides-logo-xcfzsu.png':
                    document.querySelector('link[rel="icon"]').href = 'https://sites.gsu.edu/tools/files/2015/03/GSlides-logo-xcfzsu.png';
                    document.title = 'Google Slides';
                    localStorage.setItem('tabName', 'Google Slides');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;
                case 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw':
                    document.querySelector('link[rel="icon"]').href = 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw';
                    document.title = 'Classlink';
                    localStorage.setItem('tabName', 'Classlink');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;
                case 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png':
                    document.querySelector('link[rel="icon"]').href = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png';
                    document.title = 'Google';
                    localStorage.setItem('tabName', 'Google');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;
                case 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/768px-Google_Drive_logo.png':
                    document.querySelector('link[rel="icon"]').href = 'https://cdn.icon-icons.com/icons2/2642/PNG/512/google_drive_logo_icon_159334.png';
                    document.title = 'Google Drive - My Drive';
                    localStorage.setItem('tabName', 'Google Drive - My Drive');
                    localStorage.setItem('tabIcon', tabIconDiv.src);
                    break;

            }
        }
        console.log(localStorage.getItem('tabIcon'));
        document.querySelector('link[rel="icon"]').href = localStorage.getItem('tabIcon');
        tabIconsDiv.appendChild(tabIconDiv);
    });
})
document.onkeydown = function (event) {
    if (event.key === '`') {
        var openwindow = window.open('https://classroom.google.com' + '', '_blank');
    }
};

window.addEventListener('DOMContentLoaded', function() {
    // Listen for the 'error' event which is fired when a resource (like an image or script) fails to load
    window.addEventListener('error', function(event) {
      // Check if the failed resource is the current page
      if (event.target.nodeName === 'IMG' && event.target.src === window.location.href) {
        // Redirect to the custom 404 page
        window.location.href = '/404.html'; // Change this to the actual path of your 404 page
      }
    }, true);
  });

