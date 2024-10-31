let darkBlueTheme = document.getElementsByClassName('darkblue');
let darkGreenTheme = document.getElementsByClassName('darkgreen');
let defualt = document.getElementsByClassName('darkshard');
const themeSelector = document.getElementById('themes');

themeSelector.addEventListener('change', (event) => {
    if (event.target.value === 'darkblue') {
        setTheme(darkBlueTheme);
        console.log(darkBlueTheme);
    } else if (event.target.value === 'darkgreen') {
        setTheme(darkGreenTheme);
        console.log(darkGreenTheme);
    } else if (event.target.value === 'darkshard') {
        setTheme(defualt);
    }
})
function setTheme(theme) {
    if (theme === darkBlueTheme) {
        localStorage.setItem('theme', 'darkblue');
        document.body.style.background = "linear-gradient(to bottom right, rgb(16, 52, 82), rgb(9, 34, 55), black)";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.height = "100%";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    } else if (theme === darkGreenTheme) {
        localStorage.setItem('theme', 'darkgreen');
        document.body.style.background = "linear-gradient(to bottom, rgb(33, 116, 47), rgb(0, 0, 0)";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.height = "100%";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    } else if (theme === defualt) {
        localStorage.setItem('theme', 'darkshard');
        document.body.style.backgroundColor = '#222';
        document.body.style.color = '#fff';
    }
}