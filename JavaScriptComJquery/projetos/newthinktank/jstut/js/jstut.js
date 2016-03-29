
// var yourName = prompt("What is your name?");

// if (yourName != null) {
//     var msg = "Hello " + yourName + " !";
//     document.getElementById("sayHello")
//         .innerHTML = msg;
// }

// //comando ok, pois "msg" não está em um escopo de função!
// console.log("ver: " + msg);

/*
function onDocumentLoad() {

    var yourName = prompt("What is your name?");

    if (yourName != null) {
        //Para o comando "console.log("consegui? " + msg);" 
        //abaixo vai dar:
        //"ReferenceError: msg is not defined""
        var msg = "Hello " + yourName + " !";
        document.getElementById("sayHello")
            .innerHTML = msg;
    }
    
}

window.onload = onDocumentLoad;

console.log("consegui? " + msg);
*/

function editNodeText(regex, input, helpId, helpMessage)

{
  // See if the info matches the regex that was defined
  // If the wrong information was entered, warn them
  if (!regex.test(input)) {

    if (helpId != null)
      // We need to show a warning
      // Remove any warnings that may exist
      while (helpId.childNodes[0]){
        helpId.removeChild(helpId.childNodes[0]);
      }

      // Add new warning
      helpId.appendChild(document.createTextNode(helpMessage));

    } else {

      // If the right information was entered, clear the help message
      if (helpId != null){

        // Remove any warnings that may exist
        while (helpId.childNodes[0]){
          helpId.removeChild(helpId.childNodes[0]);
        }

      }

    }
}

function isEmailOk(inputField, helpId) {

  return editNodeText(/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, inputField.value, helpId, "Enter an Email (Ex. derekbanas@newthinktank.com)");

}

// inputField – ID Number for the html text box
// helpId – ID Number for the child node I want to print a warning in
function isTheFieldEmpty(inputField, helpId) {

  // See if the input value contains any text
  return editNodeText(/^[A-Za-z\.\' \-]{1,15}\s?[A-Za-z\.\' \-]{1,15}\s?[A-Za-z\.\' \-]{1,15}/, inputField.value, helpId, "Please enter a valid name.");
}

function isPhoneOk(inputField, helpId) {

  return editNodeText(/^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/, inputField.value, helpId, "Enter a Phone Number (Ex.412-828-3000)");

}

