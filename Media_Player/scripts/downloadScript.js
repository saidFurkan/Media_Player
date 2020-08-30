let Btn = document.getElementById('btn');
let URLinput = document.getElementById('ytLink');
let select = document.getElementById('opt');
let serverURL = 'http://localhost:8000';

Btn.addEventListener('click', () => {
	if (!URLinput.value) {
		sweetAlert('warning','Enter YouTube URL');
	} else {
		if (select.value == 'mp3') {
			redirectMp3(URLinput.value);
		} else if (select.value == 'mp4') {
			redirectMp4(URLinput.value);
		}
	}
});

function redirectMp3(query) {
	window.location.href = `${serverURL}/download/mp3?url=${query}`;
}

function redirectMp4(query) {
	window.location.href = `${serverURL}/download/mp4?url=${query}`;
}

function sweetAlert(icon, text){
    Swal.fire({
        icon: icon,
        text: text,
    })
}