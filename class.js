
export class Entity {

    constructor(entité, func) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
    }

    getEntity() {return this.entity;}

    getIsTrigger() {return this.isTrigger;}

    getFunction() {return this.func;}

    triggerFunction() {this.isTrigger = false; return this.func(); }

   
}