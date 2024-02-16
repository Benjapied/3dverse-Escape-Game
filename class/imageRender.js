export class ImageRender {
    //Class qui va afficher du text a l'écran
    //Dans le css la frame est définie par la class textFrame
    constructor(link){
        this.link = link;
    }

    printImage(){
        console.log("Image");
        document.getElementsByClassName("overlay")[0].style.display = 'inline';
        document.getElementsByClassName("overlay")[0].innerHTML += '<img class="image" src="img/' + this.link + '"></div>';
    }
}

export class ImageRender {
    static instance = null;
    constructor(){
        this.textArray = [];
    }

    static Init(){  
        if(ImageRender.instance == null){
            ImageRender.instance = new ImageRender();
        }
    }

    static Get(){
        return ImageRender.instance;
    }

    addImge(link){
        this.textArray.push(new TextFrame(link));
        this.printImage();
    }

    printImge(){
        let frame = document.getElementsByClassName("overlay")[0];
        frame.innerHTML = '';
        this.textArray[0].printImage();
    }

}

