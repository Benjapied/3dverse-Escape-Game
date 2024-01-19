
//Classe Entité qui contient une entité et plusieurs parametres et méthode pour intérragir avec elle

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

    triggerFunction() {
        if(this.condition()){
            return this.func(this.param);}else{alert("vous ne pouvez pas faire ça")
        } 
    }
    
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
        if(this.label !== undefined){
            await this.label.setVisibility(false);
        };
        
    }

    async setLabelVisibility(bool){
        if(this.label == null){return;}
        await this.label.setVisibility(bool);
        console.log('label : ' + this.label);
    }

    async openEntity(player){
        const children  = await this.entity.getChildren();
        const gameCam = children.find((child) =>
        child.isAttached("camera")
        );
    
        SDK3DVerse.engineAPI.detachClientFromScripts(player.entity);
        
        SDK3DVerse.setMainCamera(gameCam);
        
        SDK3DVerse.engineAPI.cameraAPI.setControllerType(SDK3DVerse.cameraControllerType.none);
    
    
        player.isTrigger = false;
    
    }

}