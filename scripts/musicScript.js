var file = document.getElementById("File");
var audio = document.getElementById("Audio");
var timeText = document.getElementById("time");
var audioName = document.getElementById("name");
var selectAudio = document.getElementById("audio_List");
var progress = document.getElementById("Progress");
var progressBar = document.getElementById("ProgressBar");
var volume = document.getElementById("Volume");
var volumeBar = document.getElementById("VolumeBar");
var playButton = document.getElementById("playButton");
var pauseButton = document.getElementById("pauseButton");
var volumeIcon = document.getElementById("volumeIcon");

const customBtn = document.getElementById("custom-button");

customBtn.addEventListener("click", function() {
    file.click();
});

file.addEventListener("change", handleFiles, false);

function handleFiles(event) {
    var files = event.target.files;
    var option;


    for (const file of files) {
        option = document.createElement("option");
        option.text = file.name;
        option.value = URL.createObjectURL(file)
        selectAudio.add(option);
    }
    
    
}

function loadAudio() {
    audio.src = selectAudio.options[selectAudio.selectedIndex].value;
    audioName.innerHTML = selectAudio.options[selectAudio.selectedIndex].text;
}

function getLocation(event) {
    event.stopPropagation();
    let rate = (event.offsetX / progress.clientWidth) * 100;
    audio.currentTime = rate * (audio.duration / 100);
}


function setVolume(event){
    event.stopPropagation();
    let rate = (event.offsetX / volume.clientWidth);
    if(rate < 0.1){
        audio.volume = 0;
        volumeIcon.innerHTML = "volume_off";
    }
    else{
        audio.volume = rate;
        volumeIcon.innerHTML = "volume_up";
    }
}

function mute(){
    if(volumeIcon.innerHTML == "volume_up"){
        audio.volume = 0;
        volumeIcon.innerHTML = "volume_off";
    }
    else{
        audio.volume = 0.5;
        volumeIcon.innerHTML = "volume_up";
    }
    
}



function playAudio() {
    if(isNaN(audio.currentSrc)){
        audio.play();
        playButton.style.display = "none";
        pauseButton.style.display = "inline";
    }
}
function pauseAudio() {
    if(!audio.paused){
        audio.pause();
        playButton.style.display = "inline";
        pauseButton.style.display = "none";
    }
}
function stopAudio(){
    pauseAudio();
    audio.currentTime = 0;
}

var audioDuration;
var audioDurationString;

audio.ontimeupdate = function() {
    progressBar.style.width = ((audio.currentTime / audioDuration) * 100) + "%";
    timeText.innerHTML = timeSetFormat(audio.currentTime.toFixed()) + ' / ' + audioDurationString;
};

audio.onvolumechange = function() {
    volumeBar.style.width = (audio.volume * 100) + "%";
}

audio.ondurationchange = function()
{
    audioDuration = audio.duration.toFixed();
    audioDurationString = timeSetFormat(audio.duration.toFixed());
    timeText.innerHTML = "0:00 / " + audioDurationString;
}

function timeSetFormat(currentTime){
    minutes = Math.floor(currentTime / 60);
    seconds = currentTime - (minutes * 60);
    timeString = minutes.toString().padStart(1, '0') + ':' + seconds.toString().padStart(2, '0');

    return timeString;
}