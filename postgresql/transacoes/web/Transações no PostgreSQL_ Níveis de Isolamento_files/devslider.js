'use strict';

function DevSlider(selector) {
    this.init(selector);
}

function DevSliderStage(r, el){
    this.base = r;
    this.init(el);
}

function DevSliderSwipe(target, el, callback){
    this.target = target;
    if(typeof callback == "function"){
        this.callback = callback;
    }
    this.init(el);
}

function DevSliderLightBox(e){
    this.init(e);
}

function DevSliderEvents(){
    this.ChangeStepEvent = document.createEvent('Event');
    this.ChangeStepEvent.initEvent('sliderStepChange', true, true);

    this.FirstStepEvent = document.createEvent('Event');
    this.FirstStepEvent.initEvent('sliderFirstStep', true, true);

    this.LastStepEvent = document.createEvent('Event');
    this.LastStepEvent.initEvent('sliderLastStep', true, true);
}

DevSlider.prototype.init = function (selector) {
    var elements = document.querySelectorAll(selector);
    var i;
    this.slidersList = [];
    this.lightbox;

    this.events = new DevSliderEvents();

    if (elements.length < 1) {
        return;
    }

    for (i = 0; i < elements.length; i += 1) {
        this.slidersList.push(new DevSliderStage(this, elements[i]));
    }

    window.addEventListener("resize", function(e){
        this.forEach(function(s) {
            if(s.slides.length > 0){
                s.setImageSize();
            }
        });
    }.bind(this.slidersList), false);

    this.lightbox = new DevSliderLightBox(this);
};

/* INICIO STAGE */

    DevSliderStage.prototype.init = function (el) {
        this.root = el;
        this.rootsize = 0;
        this.currentPage = 0;
        this.totalSlideItens = 0;
        this.slideWrapper;
        this.slides = this.root.querySelectorAll('img');
        this.slidesImagesWrappers =  []
        this.sliderInnerArea;
        this.pagination = [];
        var self = this;

        if (this.slides.length === 0) {
            return;
        }

        this.touch = new DevSliderSwipe(this.root, this);
        this.build();

    };

    DevSliderStage.prototype.build = function () {
        this.rootsize = this.root.offsetWidth;
        this.totalSlideItens = this.slides.length;

        var innerArea = document.createElement("div");
        innerArea.className = "slider-inner-area";

        var wrapper = document.createElement("div");
        wrapper.className = "slide-wrapper";

        this.slideWrapper = wrapper;
        this.sliderInnerArea = innerArea;

        this.root.appendChild(this.sliderInnerArea);
        this.sliderInnerArea.appendChild(this.slideWrapper);

        for (var i = 0; i < this.slides.length; i += 1) {
            var siw = document.createElement("div");
            siw.classList.add("slide-img-wrapper");

            siw.src = this.slides[i].src;
            siw.alt = this.slides[i].alt;
            
            siw.style.backgroundImage = "url('" + siw.src + "')";

            this.slides[i].parentNode.removeChild(this.slides[i]);

            siw.addEventListener("click", function(e){
                this.base.lightbox.openImg(this);
            }.bind(this), false);

            this.slidesImagesWrappers.push(siw);
            this.slideWrapper.appendChild(siw);
        }

        this.slides = this.slidesImagesWrappers;


        this.initNavigation();
        this.setImageSize();        
    };

    DevSliderStage.prototype.setImageSize = function (){
        this.rootsize = this.root.offsetWidth;
        this.slideWrapper.style.width = (this.totalSlideItens * this.rootsize)+"px";

        for (var i = 0; i < this.slidesImagesWrappers.length; i++) 
        {
            this.slides[i].style.width = this.rootsize+"px";
            this.slides[i].style.height = (this.rootsize / 1.759) +"px";
        }

        this.setSlide(this.currentPage,0);
    };

    DevSliderStage.prototype.setSlide = function (slideNumber,animate){
        if(slideNumber < 0)
        {
            slideNumber = 0;
        }

        if(slideNumber > this.totalSlideItens - 1)
        {
            slideNumber = this.totalSlideItens - 1;
        }

        if(slideNumber != this.currentPage){
            this.base.events.ChangeStepEvent.index = slideNumber;
            this.root.dispatchEvent(this.base.events.ChangeStepEvent);
        }

        if(slideNumber == 0){
            this.root.dispatchEvent(this.base.events.FirstStepEvent);
        }

        if(slideNumber == this.totalSlideItens - 1){
            this.root.dispatchEvent(this.base.events.LastStepEvent);
        }


        this.currentPage = slideNumber;
        var totalMove = slideNumber * this.rootsize;
        this.slideWrapper.style.left = (totalMove * -1)+"px";

        if(animate!=0)
        {
            this.slideWrapper.style.transition = "left 0.5s";
        }
        else
        {
            this.slideWrapper.style.transition = "left 0s";
        }

        this.changeNavigation(this.currentPage);
    };

    DevSliderStage.prototype.initNavigation = function(){
        this.pagination = document.createElement("div");
        this.pagination.setAttribute("class","slide-pagination");
        this.paginationNav = [];
        this.paginationBtnBefore;
        this.paginationBtnAfter;

        this.root.appendChild(this.pagination);

        for (var i = 0; i < this.totalSlideItens; i++) 
        {
            var btn = document.createElement("span");
            btn.slideRoot = this;
            btn.slidePage = i;
            btn.addEventListener("click", function(e){
                this.slideRoot.setSlide(this.slidePage);
            }.bind(btn), false);
            this.paginationNav.push(btn);
            this.pagination.appendChild(btn);
        }

        this.paginationBtnBefore = document.createElement("span");
        this.paginationBtnBefore.setAttribute("class","slide-pagination-arrow before-arrow");
        var bIcon = document.createElement("span");
        bIcon.setAttribute("class","slide-pagination-arrow-icon");
        this.paginationBtnBefore.appendChild(bIcon);
        this.paginationBtnBefore.addEventListener("click", function(e){
            this.setSlide(this.currentPage -1);
        }.bind(this), false);

        this.paginationBtnAfter = document.createElement("span");
        this.paginationBtnAfter.setAttribute("class","slide-pagination-arrow after-arrow");
        var aIcon = document.createElement("span");
        aIcon.setAttribute("class","slide-pagination-arrow-icon");
        this.paginationBtnAfter.appendChild(aIcon);
        this.paginationBtnAfter.addEventListener("click", function(e){
            this.setSlide(this.currentPage +1);
        }.bind(this), false);

        this.sliderInnerArea.appendChild(this.paginationBtnBefore);
        this.sliderInnerArea.appendChild(this.paginationBtnAfter);

        this.changeNavigation(this.currentPage);
    };

    DevSliderStage.prototype.changeNavigation = function(i){
        if(this.paginationNav != undefined){
            this.paginationNav.forEach(function(b) {
                if(b.slidePage == i){
                    b.setAttribute("class","slide-pagination-item active");
                }else{
                    b.setAttribute("class","slide-pagination-item");
                }
            },this);
        }

        if(this.paginationBtnBefore != undefined){
            if(i == 0){
                this.paginationBtnBefore.classList.add("slide-button-hidden");
            }else{
                this.paginationBtnBefore.classList.remove("slide-button-hidden");
            }
        }

        if(this.paginationBtnAfter != undefined){
            if(i == this.totalSlideItens - 1){
                this.paginationBtnAfter.classList.add("slide-button-hidden");
            }else{
                this.paginationBtnAfter.classList.remove("slide-button-hidden");
            }
        }
    };

/* FIM STAGE */

/* INICIO SWIPE */

    DevSliderSwipe.prototype.init = function(el){
        this.root = el;
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        this.currentTouchX = 0;
        this.ctr = 0;
        this.isHorizontal = false;
        this.isVertical = false;

        this.endTarget = null;
        this.triggerElementID = null; // this variable is used to identity the triggering element
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.horzDiff = 0;
        this.vertDiff = 0;
        this.minLength = 72; // the shortest distance the user may swipe
        this.swipeLength = 0;
        this.swipeAngle = null;
        this.swipeDirection = null;

        var self = this;

        this.target.addEventListener("touchstart", this.touchStart.bind(this), false);
        this.target.addEventListener("touchmove", this.touchMove.bind(this), false);
        this.target.addEventListener("touchend", this.touchEnd.bind(this), false);
        this.target.addEventListener("touchcancel", this.touchCancel.bind(this), false);
    };

    DevSliderSwipe.prototype.touchStart = function(event) {
        this.endTarget = self;

        this.fingerCount = event.touches.length;
        if ( this.fingerCount == 1 ) {
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
        } else {
            this.touchCancel(event);
        }
    };

    DevSliderSwipe.prototype.touchMove = function(event) {
        var self = this.target;

        if(this.isHorizontal)
        {
            event.preventDefault();
        }
        else
        {
            this.checkHorizontal(event);
        }
        
        if ( event.touches.length == 1 ) {
            this.curX = event.touches[0].pageX;
            this.curY = event.touches[0].pageY;
        } else {
            this.touchCancel(event);
        }
    };

    DevSliderSwipe.prototype.checkHorizontal = function(event){
        var self = this.target;

        var valueX = Math.abs(event.touches[0].pageX - this.startX) >= 20;
        var valueY = Math.abs(event.touches[0].pageY - this.startY) >= 20;
        
        if(valueX && !valueY)
        {
            this.isHorizontal = true;
        }
    };

    DevSliderSwipe.prototype.touchEnd = function(event) {
        var self = this.target;

        if ( this.fingerCount == 1 && this.curX != 0 ) {
            this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX,2) + Math.pow(this.curY - this.startY,2)));
            if ( this.swipeLength >= this.minLength ) {
                this.caluculateAngle();
                this.determineSwipeDirection();
                this.processingRoutine();
                if(this.callback != undefined){
                    this.callback();
                }
                this.touchCancel(event); // reset the variables
            } else {
                this.touchCancel(event);
            }
        } else {
            this.touchCancel(event);
        }
    };

    DevSliderSwipe.prototype.touchCancel = function(event) {
        var self = this.target;

        // reset the variables back to default values
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.horzDiff = 0;
        this.vertDiff = 0;
        this.swipeLength = 0;
        this.swipeAngle = null;
        this.swipeDirection = null;
        this.triggerElementID = null;
        this.isHorizontal = false;
    };

    DevSliderSwipe.prototype.caluculateAngle = function() {
        var X = this.startX - this.curX;
        var Y = this.curY - this.startY;
        var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
        var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
        this.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
        if ( this.swipeAngle < 0 ) { this.swipeAngle =  360 - Math.abs(this.swipeAngle); }
    };

    DevSliderSwipe.prototype.determineSwipeDirection = function() {
        if ( (this.swipeAngle <= 45) && (this.swipeAngle >= 0) ) {
            this.swipeDirection = 'left';
        } else if ( (this.swipeAngle <= 360) && (this.swipeAngle >= 315) ) {
            this.swipeDirection = 'left';
        } else if ( (this.swipeAngle >= 135) && (this.swipeAngle <= 225) ) {
            this.swipeDirection = 'right';
        } else if ( (this.swipeAngle > 45) && (this.swipeAngle < 135) ) {
            this.swipeDirection = 'down';
        } else {
            this.swipeDirection = 'up';
        }
    };

    DevSliderSwipe.prototype.processingRoutine = function() {
        var swipedElement = document.getElementById(this.triggerElementID);
        if ( this.swipeDirection == 'left' ) 
        {
            this.root.setSlide(this.root.currentPage+1);
        } 
        else if ( this.swipeDirection == 'right' ) 
        {
            this.root.setSlide(this.root.currentPage-1);
        } 
        else if ( this.swipeDirection == 'up' ) 
        {    
        } 
        else if ( thisswipeDirection == 'down' ) 
        {
        }
    };

    DevSliderSwipe.prototype.update = function(element, callback) {
        this.target.removeEventListener("touchstart", this.touchStart.bind(this), false);
        this.target.removeEventListener("touchmove", this.touchMove.bind(this), false);
        this.target.removeEventListener("touchend", this.touchEnd.bind(this), false);
        this.target.removeEventListener("touchcancel", this.touchCancel.bind(this), false);

        this.root = element;
        if(typeof callback == "function"){
            this.callback = callback;
        }

        this.target.addEventListener("touchstart", this.touchStart.bind(this), false);
        this.target.addEventListener("touchmove", this.touchMove.bind(this), false);
        this.target.addEventListener("touchend", this.touchEnd.bind(this), false);
        this.target.addEventListener("touchcancel", this.touchCancel.bind(this), false);
    }

/* FIM SWIPE */

/* INICIO LIGHTBOX */

    DevSliderLightBox.prototype.init = function (e) {
        this.root = e;
        this.box;
        this.boxImg;
        this.btnBefore;
        this.btnAfter;
        
        var lBox = document.createElement("div");
        lBox.className = "lightbox-wrapper";
        this.box = lBox;

        var lImg = document.createElement("img");
        lImg.className = "lightbox-img";
        this.boxImg = lImg;

        var btnClose = document.createElement("span");
        btnClose.className = "lightbox-close";
        var cIcon = document.createElement("span");
        cIcon.className = "lightbox-close-icon";

        btnClose.addEventListener("click", this.closeImg.bind(this), false);
        btnClose.appendChild(cIcon);        

        this.btnBefore = document.createElement("span");
        this.btnBefore.className = "lightbox-slider-arrow before-arrow";
        var bIcon = document.createElement("span");
        bIcon.className = "lightbox-slider-arrow-icon";

        this.btnBefore.addEventListener("click", this.prevSlide.bind(this), false);
        this.btnBefore.appendChild(bIcon);

        this.btnAfter = document.createElement("span");
        this.btnAfter.className = "lightbox-slider-arrow after-arrow";
        var aIcon = document.createElement("span");
        aIcon.className = "lightbox-slider-arrow-icon";

        this.btnAfter.addEventListener("click", this.nextSlide.bind(this), false);
        this.btnAfter.appendChild(aIcon);

        this.box.addEventListener("click", function(e){
            if(e.target == this.box){
                this.closeImg();
            }
        }.bind(this), false);

        document.body.appendChild(this.box);
        this.box.appendChild(this.boxImg);
        this.box.appendChild(btnClose);
        this.box.appendChild(this.btnBefore);
        this.box.appendChild(this.btnAfter);        
    };
    
    DevSliderLightBox.prototype.openImg = function (slider) {
        this.currentSlider = slider;

        if(this.currentSlider != null && this.currentSlider != undefined){
            this.updateImg();
            this.box.classList.add("active");
            document.body.classList.add("lightbox-slider-opened");

            if(this.touch != null && this.touch != undefined){
                this.touch.update(this.currentSlider, this.updateImg.bind(this));
            }else{
                this.touch = new DevSliderSwipe(this.box, this.currentSlider, this.updateImg.bind(this));
            }
        }
    };

    DevSliderLightBox.prototype.updateImg = function () {
        var img = this.currentSlider.slides[this.currentSlider.currentPage];
        this.boxImg.src = img.src;
        this.boxImg.alt = img.alt;

        if(this.currentSlider.currentPage > 0){
            this.btnBefore.classList.remove("hidden");
        }else{
            this.btnBefore.classList.add("hidden");
        }

        if(this.currentSlider.currentPage <  this.currentSlider.totalSlideItens -1){
            this.btnAfter.classList.remove("hidden");
        }else{
            this.btnAfter.classList.add("hidden");
        }
    };

    DevSliderLightBox.prototype.closeImg = function () {
        this.currentSlider = null;
        this.box.classList.remove("active");
        document.body.classList.remove("lightbox-slider-opened");  
    };

    DevSliderLightBox.prototype.prevSlide = function () {
        if(this.currentSlider != null || this.currentSlider != undefined){
            this.currentSlider.setSlide(this.currentSlider.currentPage -1);
            this.updateImg();
        }
    };

    DevSliderLightBox.prototype.nextSlide = function () {
        if(this.currentSlider != null || this.currentSlider != undefined){
            this.currentSlider.setSlide(this.currentSlider.currentPage +1);
            this.updateImg();
        }
    };

/* FIM LIGHTBOX */