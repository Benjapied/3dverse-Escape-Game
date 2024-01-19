import {
    CdoorRomero,
    CdoubleDoorElevator,
    CdoubleDoorHall,
    CdoubleDoorShaker,
    CdoorCarmack,
    CdoorMario,
    CdoorSteeveJobs,
    CdoorHedyLamarr,
    keypadShaker,
    keypadShakerGame,
    CkeypadElevator,
    CkeypadElevatorGame,
    CmapEntree,
    CmapZoom,
    Crct1,
    Crct1Zoom,
    Crct2,
    Crct2Zoom,
    Crct3,
    Crct3Zoom,
  } from "./constanteConfig.js";
  //Import de toutes les constantes pour générer les entités

  import {Entity,Door,DoubleDoor,Keypad,Player} from "./classConfig.js";
  import {isElevator, updateElevator, isShaker, updateShaker, isRomero} from "../functions/conditions.js";
  import { setPlayerCamera } from "./functionConfig.js";
  import {player} from "../main.js";
  
  import { openKeypad } from "../class/keypad.js";

  export async function setEntitiesInTab(){
    const tabEntity = new Map();

    const door = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoorRomero))[0];
    const doubleDoorElevator = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorElevator))[0];
    const doubleDoorHall = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorHall))[0];
    const doubleDoorShaker = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorShaker))[0];
    const doorCarmack = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoorCarmack))[0];
    const doorMario = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoorMario))[0];
    const doorSteveJobs = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoorSteeveJobs))[0];
    const doorHedyLamarr = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoorHedyLamarr))[0];
    const keypadShakerHall = (await SDK3DVerse.engineAPI.findEntitiesByEUID(keypadShaker))[0];
    const keypadShaker_Game = (await SDK3DVerse.engineAPI.findEntitiesByEUID(keypadShakerGame))[0];
    const keypadElevator = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CkeypadElevator))[0];
    const keypadElevator_Game = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CkeypadElevatorGame))[0];
    const mapEntree = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CmapEntree))[0];
    const mapZoom = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CmapZoom))[0];
    const rct1 = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct1))[0];
    const rct1Zoom = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct1Zoom))[0];
    const rct2 = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct2))[0];
    const rct2Zoom = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct2Zoom))[0];
    const rct3 = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct3))[0];
    const rct3Zoom = (await SDK3DVerse.engineAPI.findEntitiesByEUID(Crct3Zoom))[0];

    tabEntity.set(CdoorRomero, new Door(door,null,'self'));
    tabEntity.set(CdoorCarmack,new Door(doorCarmack,null,'self'));
    tabEntity.set(CdoorMario,new Door(doorMario,null,'self'));
    tabEntity.set(CdoorSteeveJobs,new Door(doorSteveJobs,null,'self'));
    tabEntity.set(CdoorHedyLamarr,new Door(doorHedyLamarr,null,'self'));
    tabEntity.set(CdoubleDoorElevator, new DoubleDoor(doubleDoorElevator,null,'self',isElevator));
    tabEntity.set(CdoubleDoorHall, new DoubleDoor(doubleDoorHall,null,'self',isElevator));
    tabEntity.set(CdoubleDoorShaker, new DoubleDoor(doubleDoorShaker,null,'self',isShaker));

    tabEntity.set(CmapEntree,new Entity(mapEntree,openKeypad,{ entity: mapZoom , player}));
    tabEntity.set(CmapZoom,new Entity(mapZoom,setPlayerCamera,player.entity));

    tabEntity.set(Crct1,new Entity(rct1,openKeypad,{ entity: rct1Zoom , player}));
    tabEntity.set(Crct1Zoom,new Entity(rct1Zoom,setPlayerCamera,player.entity));
    tabEntity.set(Crct2,new Entity(rct2,openKeypad,{ entity: rct2Zoom , player}));
    tabEntity.set(Crct2Zoom,new Entity(rct2Zoom,setPlayerCamera,player.entity));
    tabEntity.set(Crct3,new Entity(rct3,openKeypad,{ entity: rct3Zoom , player}));
    tabEntity.set(Crct3Zoom,new Entity(rct3Zoom,setPlayerCamera,player.entity));

    //Keypads
    tabEntity.set(CkeypadElevator,new Entity(keypadElevator,openKeypad,{ entity: keypadElevator_Game , player}));
    tabEntity.set(CkeypadElevatorGame,new Keypad(keypadElevator_Game,setPlayerCamera,3,[2,3,2],updateElevator,player.entity));
    tabEntity.set(keypadShaker,new Entity(keypadShakerHall,openKeypad,{ entity: keypadShaker_Game , player}));
    tabEntity.set(keypadShakerGame,new Keypad(keypadShaker_Game,setPlayerCamera,4,[5,4,7,2],updateShaker,player.entity));


    return tabEntity;

  }

  export function initDicoKeypad(){
    const dicoKeypad = new Map();
  
    dicoKeypad.set('arrow up', -1);
    dicoKeypad.set('arrow down', 1);
    dicoKeypad.set('number 1', 1);
    dicoKeypad.set('number 2', 2);
    dicoKeypad.set('number 3', 3);
    dicoKeypad.set('number 4', 4);
  
    return dicoKeypad;
  }
  