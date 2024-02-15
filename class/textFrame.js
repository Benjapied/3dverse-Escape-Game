
export class TextFrame {
    //Class qui va afficher du text a l'écran
    //Dans le css la frame est définie par la class textFrame
    constructor(speaker, content){
        this.speaker = speaker;
        this.content = content;
    }

    printText(){
        console.log("zob");
        document.getElementsByClassName("textFrame")[0].style.display = 'block';
        document.getElementsByClassName("textFrame")[0].innerHTML += '<h2 class="speaker">' + this.speaker + '</h2> <div class="content">' + this.content + '</div>';
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
        let frame = document.getElementsByClassName("textFrame")[0];
        if(!frame)return;
        frame.innerHTML = '';
        frame.style.display = 'none';
    }

    addText(speaker,content){
        this.textArray.push(new TextFrame(speaker,content));
        this.printText();
    }

    printText(){
        let frame = document.getElementsByClassName("textFrame")[0];
        frame.innerHTML = '';
        this.textArray[0].printText();
    }

}

