//------------------Fonction conditionnelles--------------

import { player } from "../main.js";
import { setPlayerCamera } from "./setPlayerCamera.js";
import { CdoubleDoorElevator, CdoubleDoorShaker } from "../config/constanteConfig.js";
import { openDoubleDoor } from "../class/doubleDoor.js";
import { tabEntity } from "../main.js";


//Fonctions qui checkent tout au long du jeu sur quelle phase de jeu le joueur est

function isElevator(){
    return player.save['elevator'];
  }
  
function updateElevator(){
    player.save["elevator"] = true;
    setPlayerCamera(player.entity, player);
    tabEntity.get(CdoubleDoorElevator).openDoubleDoor();
  }
  
function isShaker(){
    return player.save['shaker'];
  }
  
function updateShaker(){
    player.save["shaker"] = true;
    setPlayerCamera(player.entity, player);
    tabEntity.get(CdoubleDoorShaker).openDoubleDoor();
  }
  
function isRomero(){
    return player.save['romero'];
  }

export {isElevator, updateElevator, isShaker, updateShaker, isRomero};