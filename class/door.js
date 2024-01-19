import {Entity} from "./entity.js";
import {Mathematique} from "../math.js";

export class Door extends Entity{
    constructor(entité, func, param, condition){
        super(entité, func, param, condition);

        this.initialTransform = null;
        this.setInitialTransform();

        this.children = [];

        this.initialTransformChildren = [];
        this.setInitialTransformChildren();

        this.func = this.openDoor;
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

    async openDoor(){

        const entity = this.entity;
        const initialPos1 = this.initialTransformChildren[0];
      
        const enfants = await entity.getChildren();
      
        //On recupere l'element enfant correspondant a la porte
        const child = enfants.find((child) =>
          child.isAttached("mesh_ref")
        ); 
        
        // window.SDK3DVerse.extensions.LabelDisplay.labelEntities[i].labelElement.innerText = 'Benjaamin';
      
        const transform1 = child.getGlobalTransform();
      
        let radTransform1;
      
        const transform = child.getGlobalTransform();
        
        if(transform1.orientation[1] == initialPos1.orientation[1] && transform1.orientation[3] == initialPos1.orientation[3]){
          radTransform1 = Mathematique.degToRad(transform1.eulerOrientation[1] + 90);
          
        } else {
          radTransform1 = Mathematique.degToRad(transform1.eulerOrientation[1] + 90);
        }
        
        transform.orientation = [0,Math.sin((radTransform1/2)),0,Math.cos((radTransform1/2))];
        child.setGlobalTransform(transform);
      
      }

}