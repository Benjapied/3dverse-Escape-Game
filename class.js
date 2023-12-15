
export class Entity {

    constructor(entité, func, param = null) {
        this.entity = entité;
        this.isTrigger = false;
        this.func = func;
        this.param = param;

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

    triggerFunction() {return this.func(this.param); }

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
}