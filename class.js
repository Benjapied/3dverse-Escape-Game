
export class Entity {

    constructor(entité, func, param = null, condition = true) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
        this.param = param;
        this.condition = this.setCondition(condition); //Ajoute une condition bool pour lancer la fonction, est true par défaut mais peut etre une fonction tiers

        this.initialTransform = null;
        this.setInitialTransform();

        this.children = [];

        this.initialTransformChildren = [];
        this.setInitialTransformChildren();

        if(param == "self"){ this.param = this;}//si on met le string 'self' en param, on set le parametre à this
    }

    getEntity() {return this.entity;}

    getIsTrigger() {return this.isTrigger;}

    getFunction() {return this.func;}

    triggerFunction() {if(this.condition()){return this.func(this.param);}else{console.log("vous ne pouvez pas faire ça")} }

    setInitialTransform() { this.initialTransform = this.entity.getGlobalTransform()}

    async setChildren() { this.children = await this.entity.getChildren()}

    async setInitialTransformChildren() {
        //renvoie la liste des transform des enfants de l'entité
        //Renvoie dans l'odre inverse à celui de 3dverse (exemple le premier enfant en partant du haut dans 3dverse sera a la fin de la liste)
        await this.setChildren();
        if(this.children.length == 0){return;}
        for(let i = 0; i < this.children.length;i++){
            if(this.children[i].components.local_transform != undefined){
                this.initialTransformChildren.push(this.children[i].getGlobalTransform());
            }
        }
    }

    setCondition(condition){
        if (condition == true){
            return function(){return true;};
        }else{
            return condition;
        }
    }
}

export class Player {
    //La classe contient l'avancée globale du joueur, par exemple si on veut ouvrir une porte d'une salle, 
    //on va regarder ici si le joueur a le droit de l'ouvrir
    constructor(entity){
        this.entity = entity;
        this.save = new Map();

        this.setSave();
    }

    setSave(){
        //Va contenir l'avancée globale du joueur dans le jeu
        this.save = {
        "elevator" : true,
        "shaker" : false,
        "carmack" : false
        };
    }

    updateSave(index){
        this.save[index] = true;
    }

}