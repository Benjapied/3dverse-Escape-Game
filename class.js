
export class Entity {

    constructor(entité, func, param = null, condition = true) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
        this.param = param;
        this.condition = this.setCondition(condition); //Ajoute une condition bool pour lancer la fonction, est true par défaut mais peut etre une fonction tiers

        if(param == "self"){ this.param = this;}//si on met le string 'self' en param, on set le parametre à this
    }

    getEntity() {return this.entity;}

    getIsTrigger() {return this.isTrigger;}

    getFunction() {return this.func;}

    triggerFunction() {if(this.condition()){return this.func(this.param);}else{console.log("vous ne pouvez pas faire ça")} }
    
    setCondition(condition){
        if (condition == true){
            return function(){return true;};
        }else{
            return condition;
        }
    }

}

export class DoubleDoor extends Entity{
    constructor(entité, func, param, condition){
        super(entité, func, param, condition);

        this.initialTransform = null;
        this.setInitialTransform();

        this.children = [];

        this.initialTransformChildren = [];
        this.setInitialTransformChildren();
    }

    setInitialTransform() { this.initialTransform = this.entity.getGlobalTransform()}

    async setChildren() { this.children = await this.entity.getChildren()}

    async setInitialTransformChildren() {
        //renvoie la liste des transform des enfants de l'entité
        await this.setChildren();

        const porte1 = this.children.find((child) =>
            child.getComponent('debug_name').value == 'porte1'
        );
        if(porte1.components.local_transform !== undefined){
            this.initialTransformChildren.push(porte1.getGlobalTransform());
        }
        const porte2 = this.children.find((child) =>
            child.getComponent('debug_name').value == 'porte2'
        );

        const trans = porte2.getGlobalTransform();
        trans.eulerOrientation[1] = trans.eulerOrientation[1] - this.initialTransformChildren[0].eulerOrientation[2];
        porte2.setGlobalTransform(trans);
        
        if(porte2.components.local_transform !== undefined){
            this.initialTransformChildren.push(porte2.getGlobalTransform());
        }
        
    }

}

export class Door extends Entity{
    constructor(entité, func, param, condition){
        super(entité, func, param, condition);

        this.initialTransform = null;
        this.setInitialTransform();

        this.children = [];

        this.initialTransformChildren = [];
        this.setInitialTransformChildren();
    }

    setInitialTransform() { this.initialTransform = this.entity.getGlobalTransform()}

    async setChildren() { this.children = await this.entity.getChildren()}

    async setInitialTransformChildren() {
        //renvoie la liste des transform des enfants de l'entité
        await this.setChildren();

        const porte1 = this.children.find((child) =>
            child.getComponent('debug_name').value == 'porte'
        );
        if(porte1.components.local_transform !== undefined){
            this.initialTransformChildren.push(porte1.getGlobalTransform());
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

        this.isTrigger = true;
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

export class Keypad {
    constuctor(entity = null, numbers = null , goodCode = null , func = null) {
        //Entity contient l'entité
        //Contient le nombre de slot dans le pad
        //La bonne combinsaison
        this.entity = entity;
        this.code = [];
        this.setCode(numbers);
        this.goodCode = goodCode;
        this.func = func;
    }

    setCode(numbers){
        for(let i = 0; i < numbers; i++){
            this.code.push(0);
        }
    }

    changeCode(index, value){
        this.code[index] = value;
    }

    verifCode(){
        if(this.code == this.goodCode){
            this.func();
        }
        return false;
    }

    async getNumber(index){
    //Savoir quelle roue du code on va tourner
        const childrenScene  = await this.entity.getChildren();
        const roue = childrenScene.find((child) =>
            child.getComponent('debug_name').value == ('number '+index)
        );
        
        return roue;
    }
        
    async rotateNumber(number, index){
        const slot = await this.getNumber(index);
        //Number est entre 1 et -1 pour le sens de rotate
        const children = await slot.getChildren();
        const wheel = children.find((child) =>
            child.getComponent('debug_name').value == 'slot'
        );
        const transform = wheel.getGlobalTransform();
        const radTransform = degToRad(Math.round(transform.eulerOrientation[0]) + (36 * number));
        transform.orientation = [Math.sin((radTransform/2)),0,0,Math.cos((radTransform/2))];
        wheel.setGlobalTransform(transform);
        
        console.log(transform.eulerOrientation[0]);
    }
}