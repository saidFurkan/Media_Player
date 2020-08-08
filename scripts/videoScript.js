var file = document.getElementById("File");
var video = document.getElementById("Video");
var customBtn = document.getElementById("custom-button");
var videoName = document.getElementById("name");
var selectVideos = document.getElementById("videoList");


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
            selectVideos.add(option);
            var opt = {text : file.name, value : URL.createObjectURL(file)};
            selectList.push(opt);
        }
    }
    if(alertList.length > 0){
        alert(alertList + " this videos already exist!")
    }
    
}

function loadVideo(number) {
    if(number < 0){
        selectVideos.selectedIndex = (selectVideos.selectedIndex + (selectVideos.children.length + number)) % selectVideos.children.length; 
    }
    else{
        selectVideos.selectedIndex = (selectVideos.selectedIndex + number) % selectVideos.children.length; 
    }
    video.src = selectVideos.options[selectVideos.selectedIndex ].value;
    videoName.innerHTML = selectVideos.options[selectVideos.selectedIndex].text;

    video.hidden = false;

    playVideo()
}


function playAudio() {
    if(isNaN(video.currentSrc)){
        video.play();
    }
}