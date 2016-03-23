var yourName = prompt("What is your name?");

if (yourName != null) {
    document.getElementById("sayHello")
        .innerHTML = "Hello " + yourName + " !";
}
