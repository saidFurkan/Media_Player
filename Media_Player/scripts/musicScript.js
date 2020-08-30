var url = "http://localhost:8000/";
function checkAccess(){
    if(localStorage.getItem("token") == undefined || localStorage.getItem('userName') == undefined){
        window.open("http://127.0.0.1:5500/index.html","_self");
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url + "user/authorization", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', localStorage.getItem("token") );

    xhr.send(JSON.stringify({
        userName : localStorage.getItem("userName")
    }));

    xhr.onload = function() {
		let responseObj = JSON.parse(xhr.response);
		if(responseObj.status == 1){
		}
		else{
			window.open("http://127.0.0.1:5500/index.html","_self");
		}
    };
    
    xhr.onerror = function(){
        window.open("http://127.0.0.1:5500/index.html","_self");
    }
}

checkAccess();



var file = document.getElementById("File");
var audio = document.getElementById("Audio");
var customBtn = document.getElementById("custom-button");
var curTimeText = document.getElementById("currentTime");
var durTimeText = document.getElementById("durationTime");
var audioName = document.getElementById("name");
var selectAudio = document.getElementById("audio_List");
var progress = document.getElementById("Progress");
var progressBar = document.getElementById("ProgressBar");
var volume = document.getElementById("Volume");
var volumeBar = document.getElementById("VolumeBar");
var playButton = document.getElementById("playButton");
var pauseButton = document.getElementById("pauseButton");
var volumeIcon = document.getElementById("volumeIcon");


var selectList = []

customBtn.addEventListener("click", function(e) {
    file.click(e);
});

file.addEventListener("change", handleFiles, false);

function handleFiles(event) {
    var files = event.target.files;
    var option;


    let alertList = [];
    for (const file of files) {
        let check = true;
        for(const s of selectList){
            if(s.text == file.name){
                check = false;
                alertList.push(file.name + "\n");
                break;
            }
        }
        if(check){
            option = document.createElement("option");
            option.text = file.name;
            option.value = URL.createObjectURL(file);
            selectAudio.add(option);
            var opt = {text : file.name, value : URL.createObjectURL(file)};
            selectList.push(opt);
        }
    }
    if(alertList.length > 0){
        alert(alertList + " this audios already exist!")
    }
    
}

function loadAudio(number) {
    if(number < 0){
        selectAudio.selectedIndex = (selectAudio.selectedIndex + (selectAudio.children.length + number)) % selectAudio.children.length; 
    }
    else{
        selectAudio.selectedIndex = (selectAudio.selectedIndex + number) % selectAudio.children.length; 
    }
    audio.src = selectAudio.options[selectAudio.selectedIndex ].value;
    audioName.innerHTML = selectAudio.options[selectAudio.selectedIndex].text;

    playAudio()
}

function getLocation(event) {
    event.stopPropagation();
    let rate = (event.offsetX / progress.clientWidth) * 100;
    audio.currentTime = rate * (audio.duration / 100);
}

var mouseMoving = false;

/* var asd = false;

progress.onmousedown = function(){
    asd = true;
}
document.onmouseup = function(){
    asd = false;
}

progress.onpointermove = function(e){
    if(asd){        
        progressBar.style.width = ((e.offsetX / progress.clientWidth) * 100) + "%";
    }
}*/

progress.addEventListener("mousedown", function(e){
    if( isNaN(audio.duration)){
        return;
    }
    mouseMoving = true;
    progressBar.style.width = ((e.offsetX / progress.clientWidth) * 100) + "%";
    curTimeText.innerHTML = timeSetFormat((((e.offsetX / progress.clientWidth) * 100) * (audio.duration / 100)).toFixed());

    var rect = progress.getBoundingClientRect();

    progress.onmousemove = function(e) {
        if(mouseMoving){
            if(e.clientX < rect.left+2 || e.clientX > rect.right-2 || e.clientY < rect.top+2 || e.clientY > rect.bottom-2){
                mouseMoving = false;
                getLocation(e);
                progress.onmousemove = null
            }
            else{
                progressBar.style.width = ((e.offsetX / progress.clientWidth) * 100) + "%";
                curTimeText.innerHTML = timeSetFormat((((e.offsetX / progress.clientWidth) * 100) * (audio.duration / 100)).toFixed());
            }
        }
    }
});



progress.addEventListener("mouseup" , function(e){
    if(mouseMoving){
        mouseMoving = false;
        progress.onmousemove = null
        getLocation(e);
    }
});

var shuffled = false;
function shuffle(){
    if(selectAudio.selectedIndex != -1){
            var selectedOption = selectAudio.options[selectAudio.selectedIndex].label;
    }

    if(!shuffled){
        var currentIndex = selectAudio.options.length, temporaryValue, temporaryText, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
    
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            // And swap it with the current element.
            temporaryValue = selectAudio.options[currentIndex].value;
            temporaryText = selectAudio.options[currentIndex].text;
            selectAudio.options[currentIndex].value = selectAudio.options[randomIndex].value;
            selectAudio.options[currentIndex].text = selectAudio.options[randomIndex].text;
            selectAudio.options[randomIndex].value = temporaryValue;
            selectAudio.options[randomIndex].text = temporaryText;
        }
        
        shuffled = true;
    }
    else{
        var length = selectAudio.children.length;
        for(var i = 0; i < length; i++){
            selectAudio.options[i].value = selectList[i].value;
            selectAudio.options[i].text = selectList[i].text;
        }
        shuffled = false;
    }
    
    if(selectAudio.selectedIndex != -1){
        for (const index in selectAudio.options) {
            if (selectAudio.options.hasOwnProperty(index) && selectedOption == selectAudio.options[index].label) {
                selectAudio.selectedIndex = index;
                break;
            }
        }
    }
    
}


function setVolume(event){
    event.stopPropagation();
    let rate = (event.offsetX / volume.clientWidth);
    if(rate < 0.1){
        audio.volume = 0;
        volumeIcon.innerHTML = "volume_off";
    }
    else if(rate < 0.5){
        audio.volume = rate;
        volumeIcon.innerHTML = "volume_down";
    }
    else{
        audio.volume = rate;
        volumeIcon.innerHTML = "volume_up";
    }
}

function mute(){
    if(volumeIcon.innerHTML != "volume_off"){
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



audio.ontimeupdate = function() {
    if(!mouseMoving){
        progressBar.style.width = ((audio.currentTime / audio.duration) * 100) + "%";
        curTimeText.innerHTML = timeSetFormat(audio.currentTime.toFixed());
    }
    
};

audio.onended = function() {
    loadAudio(1)
};

audio.onvolumechange = function() {
    volumeBar.style.width = (audio.volume * 100) + "%";
}

audio.ondurationchange = function()
{
    durTimeText.innerHTML = timeSetFormat(audio.duration.toFixed());
}

function timeSetFormat(currentTime){
    minutes = Math.floor(currentTime / 60);
    seconds = currentTime - (minutes * 60);
    timeString = minutes.toString().padStart(1, '0') + ':' + seconds.toString().padStart(2, '0');

    return timeString;
}




function goProfile(){ // ----------------------------
    
    if(!isNaN(localStorage.getItem("token"))){
        alert("You are not logged in");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/user/profile", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', localStorage.getItem("token") );

    xhr.send(JSON.stringify({
        userName : localStorage.getItem("userName")
    }));

    xhr.onload = function() {
        let responseObj = JSON.parse(xhr.response);

        if(responseObj.status == 1){
            sessionStorage.setItem('name', responseObj.user.name);
            sessionStorage.setItem('userName', responseObj.user.userName);
            sessionStorage.setItem('age', responseObj.user.age);
            sessionStorage.setItem('email', responseObj.user.email);
            window.open("http://127.0.0.1:5500/profile.html","_self");
        }
        else if(responseObj.status == 0){
            alert(responseObj.message);
        }
        else if(responseObj.status == -1){
            alert(responseObj.message);
        }
    };
}


function logout(){
    localStorage.clear();
    sessionStorage.clear();

    window.open("http://127.0.0.1:5500/index.html","_self");
}