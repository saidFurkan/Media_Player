var url = "http://localhost:8000/";


function goMedia(target){
    if(localStorage.getItem("token") == undefined || localStorage.getItem('userName') == undefined){
        sweetAlert("warning","Please login");
        return;
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
            window.open("http://127.0.0.1:5500/"+target+".html","_self");
		}
		else{
			sweetAlert("error","Token artık geçersiz yeniden giriş yapın\n" + responseObj.message);
		}
	};
}




function autoLogin(){
    if(localStorage.getItem("token") == undefined || localStorage.getItem('userName') == undefined){
        console.log("localStorage is not exist!!!");
        return;
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
			document.getElementById('login').hidden = true;
            document.getElementById('register').hidden = true;
            document.getElementById('logout').hidden = false;
			let profile = document.getElementById('profile');
			profile.hidden = false;
            profile.innerHTML = "Merhaba " + localStorage.getItem('userName');
		}
		else{
			console.log("Token artık geçersiz yeniden giriş yapın\n" + responseObj.message);
		}
	};
}

autoLogin();






function openLoginForm() {
    
	document.getElementById("loginForm").style.display = "block";
    document.getElementById('div').className = document.getElementById('div').className + " blur disabled";
    document.getElementById('nav').className = document.getElementById('nav').className + " disabled";
}
  
function closeLoginForm() {
	document.getElementById("loginForm").style.display = "none";
    document.getElementById('div').className = document.getElementById('div').className.replace(' blur disabled','');
    document.getElementById('nav').className = document.getElementById('nav').className.replace(' disabled','');
}

function openRegisterForm() {
	document.getElementById("registerForm").style.display = "block";
    document.getElementById('div').className = document.getElementById('div').className + " blur disabled";
    document.getElementById('nav').className = document.getElementById('nav').className + " disabled";
}
  
function closeRegisterForm() {
	document.getElementById("registerForm").style.display = "none";
    document.getElementById('div').className = document.getElementById('div').className.replace(' blur disabled','');    
    document.getElementById('nav').className = document.getElementById('nav').className.replace(' disabled','');
}

function openResetForm() {
    document.getElementById("loginForm").style.display = "none";
	document.getElementById("resetForm").style.display = "block";
}
  
function closeResetForm() {
	document.getElementById("resetForm").style.display = "none";
    document.getElementById('div').className = document.getElementById('div').className.replace('blur disabled','');    
    document.getElementById('nav').className = document.getElementById('nav').className.replace(' disabled','');
}






function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function resetPwd(){
    let name = document.getElementById('nameReset').value;
	let uname = document.getElementById('unameReset').value;
	let email = document.getElementById('emailReset').value;
	let age = document.getElementById('ageReset').value;
	let pwd = document.getElementById('pwdReset').value;
    let pwd_repeat = document.getElementById('pwdRepeatReset').value;


    if( name == "" || uname == "" || email == "" || age == "" || pwd == "" || pwd_repeat == ""){
        sweetAlert("warning","All fields must be filled");
        return;
    }
    if(age < 18 || age > 85){
		sweetAlert("warning","User must be over 18 years old and under 85 years old")
        return;
	}
	if(pwd != pwd_repeat){
		sweetAlert("warning","Passwords do not match")
        return;
    }
    if(!validateEmail(email)){
        sweetAlert("warning",email + " this email is not valid");
        return;
    }


    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8000/user/resetPwd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        name : name,
        userName : uname,
        email : email,
        age : age,
        password : pwd
    }));

    xhr.onload = function() {
        let responseObj = JSON.parse(xhr.response);
        if(responseObj.status == 1){
            sweetAlert("success",responseObj.message);
            closeResetForm();
        }
        else if(responseObj.status == 0){
            sweetAlert("warning",responseObj.message);
        }
        else if(responseObj.status == -1){
            sweetAlert("error",responseObj.message);
        }
    };
}




function register(){
	let name = document.getElementById('nameRegister').value;
	let uname = document.getElementById('unameRegister').value;
	let email = document.getElementById('emailRegister').value;
	let age = document.getElementById('ageRegister').value;
	let pwd = document.getElementById('pwdRegister').value;
    let pwd_repeat = document.getElementById('pwdRepeatRegister').value;
    

    if( name == "" || uname == "" || email == "" || age == "" || pwd == "" || pwd_repeat == ""){
        sweetAlert("warning","All fields must be filled")
        return;
    }
    if(age < 18 || age > 85){
		sweetAlert("warning","User must be over 18 years old and under 85 years old");
        return;
	}
	if(pwd != pwd_repeat){
		sweetAlert("warning","Passwords do not match");
        return;
    }
    if(!validateEmail(email)){
        sweetAlert("warning",email + " this email is not valid");
        return;
    }


    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/user/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        name :name,
        userName : uname,
        email : email,
        age : age,
        password : pwd
    }));

    xhr.onload = function() {
        let responseObj = JSON.parse(xhr.response);
        if(responseObj.status == 1){
            sweetAlert("success",responseObj.message);
            closeRegisterForm();
        }
        else if(responseObj.status == -1){
            sweetAlert("error",responseObj.message);
        }
    };
}


function login(){
	let uname = document.getElementById('unameLogin').value;
    let pwd = document.getElementById('pwdLogin').value;
    
    if( uname == "" || pwd == "" ){
        sweetAlert("warning","All fields must be filled");
        return;
    }

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8000/user/login", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		userName : uname, password : pwd
	}));
	
	xhr.onload = function() {
		let responseObj = JSON.parse(xhr.response);
		if(responseObj.status == 1){
			closeLoginForm();
			document.getElementById('login').hidden = true;
            document.getElementById('register').hidden = true;
            document.getElementById('logout').hidden = false;
			let profile = document.getElementById('profile');
            profile.hidden = false;
            profile.innerHTML = "Merhaba " + uname;

            localStorage.setItem("userName",uname);
            localStorage.setItem("token",responseObj.accessToken);
            sweetAlert("success", responseObj.message);
		}
		else{
			sweetAlert("error",responseObj.message);
		}
	};
}


function logout(){
    document.getElementById('login').hidden = false;
    document.getElementById('register').hidden = false;
    let profile = document.getElementById('profile');
    profile.hidden = true;
    profile.innerHTML = "";
    document.getElementById('logout').hidden = true;
    
    localStorage.clear();
    sessionStorage.clear();
}


function keyDownEnter(e) {
    if(e.code === "Enter" || e.code === "NumpadEnter") {
        login();
    }
}


function goProfile(){ 
    
    if(!isNaN(localStorage.getItem("token"))){
        sweetAlert("error","You are not logged in");
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
            sweetAlert("warning",responseObj.message);
        }
        else if(responseObj.status == -1){
            sweetAlert("error",responseObj.message);
        }
    };
}



function sweetAlert(icon, text){
    Swal.fire({
        icon: icon,
        text: text,
    })
}