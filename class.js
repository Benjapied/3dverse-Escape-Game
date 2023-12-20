
import {
    degToRad
  } from "./main.js";

export class Entity {

    constructor(entité, func, param = null, condition = true) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
        this.param = param;
        this.condition = this.setCondition(condition); //Ajoute une condition bool pour lancer la fonction, est true par défaut mais peut etre une fonction tiers
        this.label = undefined;

        this.setLabel();
        this.setLabelVisibility(false);

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

    async setLabel(){
        const children = await this.entity.getChildren();
        const label = children.find((child) =>
            child.getComponent('debug_name').value == 'label'
        );
        this.label = label;
        
    }

    async setLabelVisibility(bool){
        if(this.label == null){return;}
        await this.label.setVisibility(bool);
        console.log('label : ' + this.label);
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
        "elevator" : false,
        "shaker" : false,
        "carmack" : false
        };
    }

    updateSave(index){
        this.save[index] = true;
    }

}

export class Keypad extends Entity {
    constructor(entity, func, numbers, goodCode, goodFunc, param, condition) {
        super(entity, func, param, condition);
        //Entity contient l'entité
        //Contient le nombre de slot dans le pad
        //La bonne combinsaison
        //La fonction qui est lancée quand le code est bon
        this.code = [];
        this.setCode(numbers);
        this.goodCode = goodCode;
        this.goodFunc = goodFunc;

        this.resetNumber();

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
        for(let i = 0; i < this.code.length;i++){
            if(this.code[i] != this.goodCode[i]){
                return false;
            }
        }
        this.goodFunc();
    }

    async getNumber(index){
    //Savoir quelle roue du code on va tourner
        const childrenScene  = await this.entity.getChildren();
        const roue = childrenScene.find((child) =>
            child.getComponent('debug_name').value == ('number '+index)
        );
        
        return roue;
    }

    async resetNumber(){
        for(let i = 0; i < this.number; i++) {
            const slot = await this.getNumber(i);
            //Number est entre 1 et -1 pour le sens de rotate
            const children = await slot.getChildren();
            const wheel = children.find((child) =>
                child.getComponent('debug_name').value == 'slot'
            );
            const transform = wheel.getGlobalTransform();
            transform.orientation = [Math.sin(0),0,0,Math.cos(0)];
            wheel.setGlobalTransform(transform);
        }
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
        
        this.code[index-1] -= number;
        if(this.code[index-1] == 10){this.code[index-1] = 0}
        if(this.code[index-1] == -1){this.code[index-1] = 9}
    }
}