export class ImageRender {
    //Class qui va afficher du text a l'écran
    //Dans le css la frame est définie par la class textFrame
    constructor(link){
        this.link = link;
    }

    printImage(){
        console.log("Image");
        document.getElementsByClassName("overlay")[0].style.display = 'inline';
        document.getElementsByClassName("overlay")[0].innerHTML += '<img class="image">' +  + '</div>';
    }
}

export class TextManager {
    static instance = null;
    constructor(){
        this.textArray = [];
    }

    static Init(){  
        if(TextManager.instance == null){
            TextManager.instance = new TextManager();
        }
    }

    static Get(){
        return TextManager.instance;
    }

    disableText(){
        if((this.textArray).length == 0)return;
        //Delete de l'objet
        this.textArray.splice(0,1);

        //Delete de la div html
        let frame = document.getElementsByClassName("overlay")[0];
        if(!frame)return;
        frame.innerHTML = '';
        frame.style.display = 'none';
    }

    addText(speaker,content){
        this.textArray.push(new TextFrame(speaker,content));
        this.printText();
    }

    printText(){
        let frame = document.getElementsByClassName("overlay")[0];
        frame.innerHTML = '';
        this.textArray[0].printText();
    }

}

