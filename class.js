
export class Entity {

    constructor(entité, func, param = null) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
        this.param = param;
    }

    getEntity() {return this.entity;}

    getIsTrigger() {return this.isTrigger;}

    getFunction() {return this.func;}

    triggerFunction() {return this.func(this.param); }

   
}