document.addEventListener('DOMContentLoaded', () => {
    let mainFrame = document.getElementById('mainFrameIframe');
    let fullScreenOn = false;
    document.getElementById('game-search').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            let url = document.getElementById("game-search").value;
            let searchUrl = "https://www.google.com/search?q=";

            if (!url.includes(".")) {
                url = searchUrl + encodeURIComponent(url);
            } else {
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "https://" + url;
                }
            }

            mainFrame.style.display = 'block';
            fullScreenOn = true;

            mainFrame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            openMainFrame();
        }
    });

    function closeMainFrame() {
        mainFrame.style.display = 'none';
        fullScreenOn = false;
    }

    
    function openMainFrame() {
        mainFrame.style.display = 'block';
    }


    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (fullScreenOn) {
                closeMainFrame();
            }
        }
    });
});

function openGame(url) {
    let mainFrame = document.getElementById('mainFrameIframe');
    mainFrame.style.display = 'block';
    fullScreenOn = true;
    mainFrame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
}