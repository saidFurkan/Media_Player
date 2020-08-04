var file = document.getElementById("myFile");
var audio = document.getElementById("myAudio");
var timeText = document.getElementById("time");
var audioName = document.getElementById("name");
var selectAudio = document.getElementById("audio_List");
var progress = document.getElementById("myProgress");
var progressParent = document.getElementById("asd");


audio.ontimeupdate = function() {
    progress.style.width = ((audio.currentTime / audio.duration.toFixed()) * 100) + "%";
    timeText.innerHTML = audio.currentTime.toFixed() + " / " + (isNaN(audio.duration) ? '0' : audio.duration.toFixed());
    progress.innerHTML = audio.currentTime.toFixed()
};

const customBtn = document.getElementById("custom-button");

customBtn.addEventListener("click", function() {
    file.click();
});

audio.ondurationchange = function()
{
    timeText.innerHTML = audio.currentTime.toFixed() + " / " + (isNaN(audio.duration) ? '0' : audio.duration.toFixed());
}

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

file.addEventListener("change", handleFiles, false);


function playAudio() {
    // if(audio.currentSrc == "" || audio.currentSrc != selectAudio.options[selectAudio.selectedIndex].value){
    //     audio.src = selectAudio.options[selectAudio.selectedIndex].value;
    //     // audio.load();
    //     audioName.innerHTML = selectAudio.options[selectAudio.selectedIndex].text;
    // }

    audio.play();
}



function pauseAudio() {
    audio.pause();
}
