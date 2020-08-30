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
var video = document.getElementById("Video");
var customBtn = document.getElementById("custom-button");
var videoName = document.getElementById("name");
var videoList = document.getElementById("videoList");
var range = document.getElementById("range");
var volume = document.getElementById("Volume");
var volumeBar = document.getElementById("VolumeBar");
var curTimeText = document.getElementById("currentTime");
var durTimeText = document.getElementById("durationTime");
var volumeIcon = document.getElementById("volumeIcon");
var controller = document.getElementById("controller");


function fullScreen(){
    if(isNaN(video.currentSrc)){
        video.requestFullscreen();
    }
}

function resizeFunction(){                                      
    video.width = document.getElementById("col8").clientWidth*0.9;
    controller.style.width = video.width+"px";
    controller.style.left = video.getBoundingClientRect().x + "px"
    range.style.width = controller.width - 270 + "px";        
}
resizeFunction();



var isMouseDown = false;
range.onclick = function(){
    if( isNaN(video.duration)){
        return;
    }
    range.style.backgroundSize = range.value + "%";
    video.currentTime = range.value / 100 * video.duration;
}
range.onpointermove = function(){
    if(isMouseDown){
        range.style.backgroundSize = range.value + "%";
        video.currentTime = range.value / 100 * video.duration;
        curTimeText.innerHTML = timeSetFormat(video.currentTime.toFixed());
    }
    
}

range.onmousedown = function(){
    if( isNaN(video.duration)){
        return;
    }
    isMouseDown = true;
}

document.onmouseup = function(){
    isMouseDown = false;
}



var selectList = []

customBtn.addEventListener("click", function(e) {
    file.click(e);
});

file.addEventListener("change", handleFiles, false);

function handleFiles(event) {
    var files = event.target.files;

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
            let div;
            let canvas;
            let a;
            let videoForPoster = document.createElement("video");
            let url = URL.createObjectURL(file);

            videoForPoster.src = url;
            videoForPoster.currentTime = 25;

            div = document.createElement("div");
            div.className = "h hbcom";
            div.id = "video" +url.substr(url.length-10,url.length-1);
            div.value = url;
            div.onclick = loadVideo.bind(this, {url: url, name: file.name});

            canvas = document.createElement("canvas");
            canvas.style.float = "left";
            canvas.width = "150";
            canvas.height = "80";
            a = document.createElement("a");
            a.style.fontSize = "16px";
            a.style.margin = "0px";
            a.innerHTML = file.name;
            div.appendChild(canvas);
            div.appendChild(a);
            videoList.appendChild(div);

            var opt = {text : file.name, value : url};
            selectList.push(opt);

            videoForPoster.onseeked = function(){
                var context = canvas.getContext('2d');
                context.drawImage(videoForPoster, 0, 0, canvas.width, canvas.height);
                videoForPoster.remove();
            }

        }
        
    }
    if(alertList.length > 0){
        alert(alertList + " this videos already exist!")
    }
    
}

function setVolume(event){
    event.stopPropagation();
    let rate = (event.offsetX / volume.clientWidth);
    if(rate < 0.1){
        video.volume = 0;
        volumeIcon.innerHTML = "volume_off";
    }
    else if(rate < 0.5){
        video.volume = rate;
        volumeIcon.innerHTML = "volume_down";
    }
    else{
        video.volume = rate;
        volumeIcon.innerHTML = "volume_up";
    }
}

function mute(){
    if(volumeIcon.innerHTML != "volume_off"){
        video.volume = 0;
        volumeIcon.innerHTML = "volume_off";
    }
    else{
        video.volume = 0.5;
        volumeIcon.innerHTML = "volume_up";
    }
    
}

function skipVideo(number){
    debugger;
    for(var i = 0; i < selectList.length; i++){
        if(selectList[i].value == video.src){
            if(i+number >= selectList.length){
                loadVideo({url:selectList[0].value, name:selectList[0].text});
            }
            else if(i+number < 0){
                loadVideo({url:selectList[selectList.length-1].value , name:selectList[selectList.length-1].text});
            }
            else{
                loadVideo({url:selectList[i+number].value, name:selectList[i+number].text});
            }
            break;
        }
    }
}

function loadVideo(src) {
    if(src.url == video.src){
        return;
    }
    
    let divs = videoList.children;
    for(var i = 0; i<divs.length; i++){
        divs[i].className = "h hbcom";
        if(divs[i].value == src.url){
            divs[i].className = "h hbcom activevideo";
        }
    }
    
    videoName.innerHTML = src.name;

    video.src = src.url;
    video.currentSrc = src.url;

    video.hidden = false;
    controller.style.removeProperty("display");
    range.disabled = false;

    playVideo()
}

function playVideo() {
    if(isNaN(video.currentSrc)){
        video.play();
        playButton.style.display = "none";
        pauseButton.style.display = "inline";
    }
}
function pauseVideo(){
    if(isNaN(video.currentSrc)){
        video.pause();
        playButton.style.display = "inline";
        pauseButton.style.display = "none";
    }
}



video.ontimeupdate = function() {
    if(!isMouseDown){
        range.value = ((video.currentTime / video.duration) * 100);
        range.style.backgroundSize = range.value + "%";
        curTimeText.innerHTML = timeSetFormat(video.currentTime.toFixed());
    }
};

video.onended = function() {
    loadAudio(1)
};

video.onvolumechange = function() {
    volumeBar.style.width = (video.volume * 100) + "%";
}

video.ondurationchange = function()
{
    durTimeText.innerHTML = timeSetFormat(video.duration.toFixed());
    video.currentTime = 0;
    range.value = 0;
    range.style.backgroundSize = "0%";
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