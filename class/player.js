
export class Player {
    //La classe contient l'avancée globale du joueur, par exemple si on veut ouvrir une porte d'une salle, 
    //on va regarder ici si le joueur a le droit de l'ouvrir
    constructor(entity){
        this.entity = entity;
        this.save = new Map();

        this.setSave();

        this.isTrigger = true;
    }

    setSave(){
        //Va contenir l'avancée globale du joueur dans le jeu
        this.save = {
        "elevator" : false,
        "shaker" : false,
        "carmack" : false
        };
    }

    updateSave(index){
        this.save[index] = true;
    }

}