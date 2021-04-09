class DevbotHumor{
    static default(){
        return "default";
    }

    static sad(){
        return "sad";
    }       
}

class DevbotBgColor{
    static default(){
        return "default";
    }

    static erro(){
        return "erro";
    }

    static medalha(){
        return "medalha";
    }       
}

class Devbot {
    constructor (element, humor, message, color){
        this.wrapper = element;
        this.avatar = element.getElementsByClassName("devbot-avatar")[0];
        this.dialog = element.getElementsByClassName("devbot-dialog")[0];
        this.currentDialog = null;

        this.typewriter = null;

        
        if(typeof humor != "undefined"){
            this.setHumor(humor);
        }

        if(typeof color != "undefined"){
            this.setColor(color);
        }
        
        if(this.dialog != null){
            this.dialog.classList.add("dialog-hidden");
            if(typeof message != "undefined"){
                setTimeout(() => {
                    this.setMessage(message);
                }, 800);
            }            
        }
    }

    setHumor(humor){
        this.avatar.classList.remove("sad-avatar");

        if(humor == DevbotHumor.sad){
            this.avatar.classList.add("sad-avatar");
        }

        return this;
    }

    setMessage(msg){
        if(typeof Typewriter == "function"){
            if(this.typewriter == null){
                this.typewriter = new Typewriter(this.dialog, {
                    loop: false,
                    cursor: "",
                    delay: 10
                });
            }

            if(this.currentDialog == null){
                this.dialog.classList.remove("dialog-hidden");
                this.avatar.classList.add("talk-avatar");

                this.typewriter
                .typeString(msg)
                .callFunction(function(){
                    this.avatar.classList.remove("talk-avatar");
                }.bind(this))
                .start();
            }else{
                this.dialog.classList.add("dialog-hidden");
                setTimeout(() => {
                    this.dialog.getElementsByClassName("Typewriter__wrapper")[0].innerHTML = "";
                }, 200);

                this.typewriter
                .pauseFor(700)
                .callFunction(function(){
                    this.dialog.classList.remove("dialog-hidden");
                    this.avatar.classList.add("talk-avatar");
                }.bind(this))
                .typeString(msg)
                .callFunction(function(){
                    this.avatar.classList.remove("talk-avatar");
                }.bind(this))
                .start();
            }

            this.currentDialog = msg;

        }else{
            var callbackSetMsg = function(msg){
                this.dialog.classList.remove("dialog-hidden");
                this.avatar.classList.add("talk-avatar");

                this.dialog.innerHTML = msg;

                setTimeout(() => {
                    this.avatar.classList.remove("talk-avatar");
                }, msg.length * 10);
            }

            if(this.currentDialog == null){
                callbackSetMsg();
            }else{
                this.dialog.classList.add("dialog-hidden");

                setTimeout(() => {
                    this.dialog.innerHTML = "";
                    setTimeout(callbackSetMsg, 500);
                },200);
            }

            this.currentDialog = msg;
        }

        return this;
    }

    setColor(color){
        this.dialog.classList.remove("dialog-erro","dialog-medalha");

        if(color == DevbotBgColor.erro){
            this.dialog.classList.add("dialog-erro");
        }

        if(color == DevbotBgColor.medalha){
            this.dialog.classList.add("dialog-medalha");
        }

        return this;
    }
}