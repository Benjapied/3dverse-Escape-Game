import {Entity} from "./entity.js";
import {Mathematique} from "../math.js";

export class DoubleDoor extends Entity{
    constructor(entité, func, param, condition){
        super(entité, func, param, condition);

        this.initialTransform = null;
        this.setInitialTransform();

        this.children = [];

        this.initialTransformChildren = [];
        this.setInitialTransformChildren();

        this.func = this.openDoubleDoor;
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

    async openDoubleDoor(){

        const entity = this.entity;
        const initialPos1 = this.initialTransformChildren[0];
        const initialPos2 = this.initialTransformChildren[1];
        
        //On recupere l'element enfant correspondant a la porte
        const portes = await entity.getChildren();
        const porte1 = portes.find((child) =>
          child.getComponent('debug_name').value == 'porte1'
        );
      
        const porte2 = portes.find((child) =>
          child.getComponent('debug_name').value == 'porte2'
        );
      
        const transform1 = porte1.getGlobalTransform();
        const transform2 = porte2.getGlobalTransform();
      
        //Les deux radiant vont rotate les portes
        let radTransform1; 
        let radTransform2; 
      
        
        if(Math.round(transform1.orientation[1]) == Math.round(initialPos1.orientation[1]) 
          && Math.round(transform2.orientation[1]) == Math.round(initialPos2.orientation[1] )){
          radTransform1 = Mathematique.degToRad(transform1.eulerOrientation[1] + 90);
          radTransform2 = Mathematique.degToRad(transform2.eulerOrientation[1] - 90);
      
          transform1.orientation = [0,Math.sin((radTransform1/2)),0,Math.cos((radTransform1/2))];
          porte1.setGlobalTransform(transform1);
      
          transform2.orientation = [0,Math.sin((radTransform2/2)),0,Math.cos((radTransform2/2))];
          porte2.setGlobalTransform(transform2);
          
        } else {
          porte1.setGlobalTransform(initialPos1);
          porte2.setGlobalTransform(initialPos2);
        }
      }

}

export const openDoubleDoor = DoubleDoor.prototype.openDoubleDoor;