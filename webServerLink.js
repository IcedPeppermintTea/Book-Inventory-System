function databaseWrite() {
    console.log("writing to database")
    var FirstName = document.getElementById('FirstName').value;
    var LastName = document.getElementById('LastName').value;
    var Username = document.getElementById('Username').value;
    var Password = document.getElementById('Password').value;

    var Users = {
        FirstName: FirstName,
        LastName: LastName,
        Username: Username,
        Password: Password
    }

    var requestInfo = { 
        method: "POST", 
        body: JSON.stringify(Users), 
        headers: { 'Content-Type': 'application/json' }
    }

    fetch("http://localhost:2020/Users", requestInfo) // changed
        .then((response) =>{
        console.log("response = " + response)
        if (!response.ok) {  
                throw new Error('HTTP error: ${response.status}');
            }
            return response.text()
        })
        .then((text) => {
            console.log("text = " + text)
            document.getElementById("database_server_write_result").innerHTML = text
            window.location.href = "log_in.html";
        })
        .catch((error) => console.log('trouble - ' + error));

}

function databaseLogin() {
    console.log("Checking Login")
    var Username = document.getElementById('Username').value;
    var Password = document.getElementById('Password').value;

    var loginData = {
        Username: Username,
        Password: Password
    };

    var requestInfo = {
        method: "POST",
        body: JSON.stringify(loginData), 
        headers: { 'Content-Type': 'application/json' }
    }

    fetch("http://localhost:2020/login", requestInfo)
        .then((response) =>{
            console.log("response = " + response)
            if (response.status === 200) {  
                // Login Successful
                window.location.href = "main_page.html";
            }
            else if (response.status === 401) {
                // Invalid Username or Password, show an error message
                console.error ("Invalid username or password. Please try again.")
            }
            else {
                // handle other response statuses
                console.error("An error occurred during login.");
            }
            })
    
        .catch((error) => console.log('Login error: ' + error));
}