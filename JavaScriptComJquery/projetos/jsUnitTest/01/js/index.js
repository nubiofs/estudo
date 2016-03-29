function welcome() {

    var userName = document.getElementById("userName").value;
    var msg = "Welcome " + userName + "!";

    /* It does not work in Firefox! The reason behind this problem 
    is that the innerText property is not supported in Firefox.
    */
    // if (document.getElementById("welcomeMessage").innerText === undefined) {
    //     //
    //     //Mas para esse tipo de problema pode-se utilizar o jQuery:
    //     //
    //     $("#welcomeMessage").text(msg);

    // } else {
    //     document.getElementById("welcomeMessage").innerText = msg;
    // }
    
    $("#welcomeMessage").text(msg);
    
}
