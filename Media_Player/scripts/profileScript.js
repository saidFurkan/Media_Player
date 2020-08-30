function fillValue(){
    document.getElementById("userName").innerHTML = "You can update profile information here " + sessionStorage.getItem('userName');

    document.getElementById("name").value = sessionStorage.getItem('name');

    document.getElementById("email").value = sessionStorage.getItem('email');

    document.getElementById("age").value = sessionStorage.getItem('age');

    document.getElementById("pwd").value = "";
}
fillValue();



function update(){
    if( document.getElementById("name").value == "" || document.getElementById("email").value == "" 
        || document.getElementById("age").value == "" || document.getElementById("pwd").value == ""){
        sweetAlert("warning","All fields must be filled");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8000/user/update", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', localStorage.getItem("token") );

    xhr.send(JSON.stringify({
        userName :  sessionStorage.getItem('userName'), 
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        age : document.getElementById("age").value,
        password : document.getElementById("pwd").value
    }));
    
    xhr.onload = function() {
        let responseObj = JSON.parse(xhr.response);
        if(responseObj.status == 1){
            sessionStorage.setItem('name', responseObj.user.name);
            sessionStorage.setItem('userName', responseObj.user.userName);
            sessionStorage.setItem('age', responseObj.user.age);
            sessionStorage.setItem('email', responseObj.user.email);
            
            sweetAlert("success",responseObj.message);
            fillValue();
        }
        else{
            sweetAlert("error",responseObj.message);
        }
    };
}



function goMedia(target){
    if(localStorage.getItem("token") == undefined || localStorage.getItem('userName') == undefined){
        sweetAlert("warning","Please login");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8000/user/authorization", true);
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

function logout(){
    localStorage.clear();
    sessionStorage.clear();

    window.open("http://127.0.0.1:5500/index.html","_self");
}

//localStorage.setItem('name', 'Furkan');
//localStorage.removeItem('name');

//sessionStorage.setItem('name', 'Bob');
//sessionStorage.removeItem('name');

//document.cookie = 'surname=fatih; expires=' + new Date(2021, 0, 1).toUTCString();
//document.cookie = 'surname=; expires=' + new Date(1970, 0, 1).toUTCString;



function sweetAlert(icon, text){
    Swal.fire({
        icon: icon,
        text: text,
    })
}