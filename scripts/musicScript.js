var file = document.getElementById("myFile");
var audio = document.getElementById("myAudio");
var timeText = document.getElementById("time");
var audioName = document.getElementById("name");
var selectAudio = document.getElementById("audio_List");
var progress = document.getElementById("myProgress");
var progressParent = document.getElementById("asd");



const customBtn = document.getElementById("custom-button");

customBtn.addEventListener("click", function() {
    file.click();
});

file.addEventListener("change", handleFiles, false);

function handleFiles(event) {
    var files = event.target.files;
    var option = document.createElement("option");
    option.text = files[0].name;
    option.value = URL.createObjectURL(files[0])
    selectAudio.add(option);
    
}

function loadAudio() {
    audio.src = selectAudio.options[selectAudio.selectedIndex].value;
    audioName.innerHTML = selectAudio.options[selectAudio.selectedIndex].text;
}

function getLocation(event) {
    event.stopPropagation();
    var rate = (event.offsetX / progressParent.clientWidth) * 100
    audio.currentTime = rate * (audio.duration / 100);
    console.log(event);
}




function playAudio() {
    audio.play();
}


function pauseAudio() {
    audio.pause();
}

var audioDuration;

audio.ontimeupdate = function() {
    progress.style.width = ((audio.currentTime / audioDuration) * 100) + "%";
    timeText.innerHTML = timeSetFormat(audio.currentTime.toFixed());
};

audio.ondurationchange = function()
{
    audioDuration = audio.duration.toFixed();
    timeText.innerHTML = timeSetFormat(audio.currentTime.toFixed());
}

function timeSetFormat(seconds){
    // saniye dakika cinsinden yazdır
    return seconds + ' / ' + audioDuration;
}