var musicArray = [
    "https://tommustbe12.com/assets/music/echoes-of-solitude.mp3",
    "https://tommustbe12.com/assets/music/lost-in-reflection.mp3",
    "https://tommustbe12.com/assets/music/shadows-of-existence.mp3"
];

var titleArray = [
    "Echoes of Solitude",
    "Lost in Reflection",
    "Shadows of Existence"
];

var descArray = [
    "This is the first real song that I've created. A mysterious, far out sounding short song",
    "This is my favorite song that I've created so far. It is another mysterious and far-out sounding song.",
    "This is the 3rd song I've created in this mysterious song series."
];

var interval = 1;

var musicPlayer = document.getElementById("musicPlayer");
var currentSong = document.getElementById("currentSong");
var descSong = document.getElementById("descSong");

function nextSong() {
    interval += 1;
}

soundtrack.src = musicArray[interval];
currentSong.innerHTML = titleArray[interval];
descSong.innerHTML = descArray[interval];
