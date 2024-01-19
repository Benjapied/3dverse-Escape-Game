import {Entity} from "./entity.js";
import {Mathematique} from "../math.js";


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
        if(slot === undefined)return;
        //Number est entre 1 et -1 pour le sens de rotate
        const children = await slot.getChildren();
        const wheel = children.find((child) =>
            child.getComponent('debug_name').value == 'slot'
        );
        const transform = wheel.getGlobalTransform();
        const radTransform = Mathematique.degToRad(Math.round(transform.eulerOrientation[0]) + (36 * number));
        transform.orientation = [Math.sin((radTransform/2)),0,0,Math.cos((radTransform/2))];
        wheel.setGlobalTransform(transform);
        
        this.code[index-1] -= number;
        if(this.code[index-1] == 10){this.code[index-1] = 0}
        if(this.code[index-1] == -1){this.code[index-1] = 9}
    }

    async openKeypad({ entity, player }){
        const children  = await entity.getChildren();
        const gameCam = children.find((child) =>
        child.isAttached("camera")
        );
    
        SDK3DVerse.engineAPI.detachClientFromScripts(player.entity);
        
        SDK3DVerse.setMainCamera(gameCam);
        
        SDK3DVerse.engineAPI.cameraAPI.setControllerType(SDK3DVerse.cameraControllerType.none);
    
    
        player.isTrigger = false;
    
    }
}

export const openKeypad = Keypad.prototype.openKeypad;