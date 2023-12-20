//------------------------------------------------------------------------------
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
  door1,
  CdoubleDoorElevator,
  CdoubleDoorHall,
  CdoubleDoorShaker,
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
} from "./config.js";

import {
  Entity,
  Player,
  DoubleDoor,
  Door,
  Keypad,
} from "./class.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------

const tabEntity = new Map();
const dicoKeypad = new Map();
let player;

async function initDicoKeypad(){
  dicoKeypad.set('arrow up', -1);
  dicoKeypad.set('arrow down', 1);
  dicoKeypad.set('number 1', 1);
  dicoKeypad.set('number 2', 2);
  dicoKeypad.set('number 3', 3);
  dicoKeypad.set('number 4', 4);
}

async function InitApp() {

  await SDK3DVerse.joinOrStartSession({
    userToken: publicToken,
    sceneUUID: mainSceneUUID,
    canvas: document.getElementById("display-canvas"),
    createDefaultCamera: false,
    startSimulation: "on-assets-loaded",
  });

  await InitFirstPersonController(characterControllerSceneUUID);

  await SDK3DVerse.installExtension(SDK3DVerse_ViewportDomOverlay_Ext);
  await SDK3DVerse.installExtension(SDK3DVerse_LabelDisplay_Ext);

  requestAnimationFrame(gameLoop);

  const door = (await SDK3DVerse.engineAPI.findEntitiesByEUID(door1))[0];
  const doubleDoorElevator = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorElevator))[0];
  const doubleDoorHall = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorHall))[0];
  const doubleDoorShaker = (await SDK3DVerse.engineAPI.findEntitiesByEUID(CdoubleDoorShaker))[0];
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

  tabEntity.set(door1, new Door(door,openDoor,'self'));
  tabEntity.set(CdoubleDoorElevator, new DoubleDoor(doubleDoorElevator,openDoubleDoor,'self',isElevator));
  tabEntity.set(CdoubleDoorHall, new DoubleDoor(doubleDoorHall,openDoubleDoor,'self',isElevator));
  tabEntity.set(CdoubleDoorShaker, new DoubleDoor(doubleDoorShaker,openDoubleDoor,'self',isShaker));
  tabEntity.set(keypadShakerGame,new Entity(keypadShaker_Game,setPlayerCamera,'self'));
  tabEntity.set(keypadShaker,new Entity(keypadShakerHall,openKeypad,keypadShaker_Game));
  tabEntity.set(CkeypadElevator,new Entity(keypadElevator,openKeypad,keypadElevator_Game));
  tabEntity.set(CkeypadElevatorGame,new Entity(keypadElevator_Game,setPlayerCamera,player.entity));
  tabEntity.set(CmapEntree,new Entity(mapEntree,openKeypad,mapZoom));
  tabEntity.set(CmapZoom,new Entity(mapZoom,setPlayerCamera,player.entity));

  tabEntity.set(Crct1,new Entity(rct1,openKeypad,rct1Zoom));
  tabEntity.set(Crct1Zoom,new Entity(rct1Zoom,setPlayerCamera,player.entity));
  tabEntity.set(Crct2,new Entity(rct2,openKeypad,rct2Zoom));
  tabEntity.set(Crct2Zoom,new Entity(rct2Zoom,setPlayerCamera,player.entity));
  tabEntity.set(Crct3,new Entity(rct3,openKeypad,rct3Zoom));
  tabEntity.set(Crct3Zoom,new Entity(rct3Zoom,setPlayerCamera,player.entity));


  
  tabEntity.set(CkeypadElevator,new Entity(keypadElevator,openKeypad,keypadElevator_Game));
  tabEntity.set(CkeypadElevatorGame,new Keypad(keypadElevator_Game,setPlayerCamera,3,[2,0,0],() => {player.save["elevator"] = true;},player.entity));
  tabEntity.set(keypadShaker,new Entity(keypadShakerHall,openKeypad,keypadShaker_Game));
  tabEntity.set(keypadShakerGame,new Keypad(keypadShaker_Game,setPlayerCamera,4,[5,4,7,2],() => {player.save["shaker"] = true;},player.entity));
  
  initDicoKeypad();
  SetCollideEntities();

  window.addEventListener('keydown',inputManager);
  window.addEventListener('keyup',resetKey);
  window.addEventListener('click',onClick);
  window.addEventListener('unclicked',resetClick);
  window.addEventListener('click', changeNumber);
  window.addEventListener('click',confirmKeypad);

  console.log(tabEntity.get(CkeypadElevatorGame));
  

//   document.addEventListener('mousedown', (event) => {
//     setFPSCameraController(document.getElementById("display-canvas"));
// });
}


//------------------------------------------------------------------------------
async function InitFirstPersonController(charCtlSceneUUID) {
  // To spawn an entity we need to create an EntityTempllate and specify the
  // components we want to attach to it. In this case we only want a scene_ref
  // that points to the character controller scene.
  const playerTemplate = new SDK3DVerse.EntityTemplate();
  playerTemplate.attachComponent("scene_ref", { value: charCtlSceneUUID });

  // Passing null as parent entity will instantiate our new entity at the root
  // of the main scene.
  const parentEntity = null;
  // Setting this option to true will ensure that our entity will be destroyed
  // when the client is disconnected from the session, making sure we don't
  // leave our 'dead' player body behind.
  const deleteOnClientDisconnection = true;
  // We don't want the player to be saved forever in the scene, so we
  // instantiate a transient entity.
  // Note that an entity template can be instantiated multiple times.
  // Each instantiation results in a new entity.
  const playerSceneEntity = await playerTemplate.instantiateTransientEntity(
    "Player",
    parentEntity,
    deleteOnClientDisconnection
  );

  await setPlayerCamera(playerSceneEntity);

  player = new Player(playerSceneEntity);

}

let running = true;
let lastFrameTime = 0;
let timer = 0;

function gameLoop(currentTime) {
  const dT = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  UpdateTime(dT);

  if(running) {
    requestAnimationFrame(gameLoop)
  }
}

function UpdateTime(dT) {
  timer += dT;
}

async function setFPSCameraController(canvas){
  // Remove the required click for the LOOK_LEFT, LOOK_RIGHT, LOOK_UP, and
  // LOOK_DOWN actions.
  SDK3DVerse.actionMap.values["LOOK_LEFT"][0] = ["MOUSE_AXIS_X_POS"];
  SDK3DVerse.actionMap.values["LOOK_RIGHT"][0] = ["MOUSE_AXIS_X_NEG"];
  SDK3DVerse.actionMap.values["LOOK_DOWN"][0] = ["MOUSE_AXIS_Y_NEG"];
  SDK3DVerse.actionMap.values["LOOK_UP"][0] = ["MOUSE_AXIS_Y_POS"];
  SDK3DVerse.actionMap.propagate();

  // Lock the mouse pointer.
  canvas.requestPointerLock = (
    canvas.requestPointerLock
    || canvas.mozRequestPointerLock
    || canvas.webkitPointerLockElement
  );
  canvas.requestPointerLock();
};

async function setPlayerCamera(controller) {

  if(player !== undefined){
    player.isTrigger = true;
  }
  
  // The character controller scene is setup as having a single entity at its
  // root which is the first person controller itself.
  const firstPersonController = (await controller.getChildren())[0];
  // Look for the first person camera in the children of the controller.
  const children = await firstPersonController.getChildren();
  const firstPersonCamera = children.find((child) =>
    child.isAttached("camera")
  );

  // We need to assign the current client to the first person controller
  // script which is attached to the firstPersonController entity.
  // This allows the script to know which client inputs it should read.
  SDK3DVerse.engineAPI.assignClientToScripts(firstPersonController);

  // Finally set the first person camera as the main camera.
  SDK3DVerse.setMainCamera(firstPersonCamera);

  
};

//--------------------Fonctions----------------------

let keyIsDown  = false;
let clicked = false;

function resetKey(){
  keyIsDown = false;
}

function resetClick(){
  clicked =false;
}


async function inputManager(event) {
  if(keyIsDown){return;};
  if(event.key == 'a' && player.isTrigger == true){
    tabEntity.forEach(function(valeur) {
      if(valeur.isTrigger == true){
        valeur.triggerFunction();
      }
    });
    keyIsDown = true;
  };
  if(event.key == 'Escape'){
    setPlayerCamera(player.entity);
    keyIsDown = true;
  };
  if(event.key == 'l') {
    await tabEntity.get(CkeypadElevatorGame).rotateNumber(-1,1);
    keyIsDown = true;
  };
  if(event.key == 'k') {
    await tabEntity.get(CkeypadElevatorGame).rotateNumber(1,1);
    keyIsDown = true;
  };
  if(event.key == 'p') {
    tabEntity.get(CkeypadElevatorGame).verifCode();
    keyIsDown = true;
  };
}

async function onClick(event) {
  if(clicked){return;};
  const target = await SDK3DVerse.engineAPI.castScreenSpaceRay(
    event.clientX,
    event.clientY
  );
  if (!target.pickedPosition) return;
  const clickedEntity = target.entity;
  return clickedEntity;
};

async function getKeypad(event) {
  const target = await onClick(event);
  if (!target) return;
  const keypad = await target.getAncestors()[1];
  if (keypad.getComponent('debug_name').value == 'Keypad') {
    return keypadShakerGame;
  } else if (keypad.getComponent('debug_name').value == 'panel elevator big') {
    return CkeypadElevatorGame;
  }
}

async function changeNumber(event){
  const targetPromise = onClick(event);
  const target = await targetPromise;
  if (!target) return;
  const targetResolved = await target;
  const ancestors = await targetResolved.getAncestors();
  const parent = ancestors[0];
  const keypad = await getKeypad(event);

  if (!keypad) return;
  await tabEntity.get(keypad).rotateNumber(dicoKeypad.get(target.getComponent('debug_name').value),dicoKeypad.get(parent.getComponent('debug_name').value));
}

async function confirmKeypad(event){
  const targetPromise = onClick(event);
  const target = await targetPromise;
  if (!target) return;
  const keypad = await getKeypad(event);
  if (!keypad) return;
  if(target.getComponent('debug_name').value == 'button'){
    tabEntity.get(keypad).verifCode();
  }
}


function SetCollideEntities(){
  SDK3DVerse.engineAPI.onEnterTrigger(async(emitterEntity, triggerEntity) =>
    {
      const parent = await emitterEntity.getAncestors()[0];
      if(parent.components.euid.value != player.entity.components.euid.value){return;}
      if(tabEntity.get(String(triggerEntity.linker.components.euid.value)) !== undefined){
        tabEntity.get(String(triggerEntity.linker.components.euid.value)).isTrigger = true;
        tabEntity.get(String(triggerEntity.linker.components.euid.value)).setLabelVisibility(true);
      }
    });
  SDK3DVerse.engineAPI.onExitTrigger(async(emitterEntity, triggerEntity) =>
    {
      const parent = await emitterEntity.getAncestors()[0];
      if(parent.components.euid.value != player.entity.components.euid.value){return;}
      if(tabEntity.get(String(triggerEntity.linker.components.euid.value)) !== undefined){
        tabEntity.get(String(triggerEntity.linker.components.euid.value)).isTrigger = false;
        tabEntity.get(String(triggerEntity.linker.components.euid.value)).setLabelVisibility(false);
      }
    });
}

//------------------Fonctions des entities interractifs----------------

export function degToRad(angle) {
  return angle*Math.PI/180;
}

function printOue(){
  console.log("oue")
}

async function openDoor(param){

  const entity = param.entity;
  const initialPos1 = param.initialTransformChildren[0];

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
    radTransform1 = degToRad(transform1.eulerOrientation[1] + 90);
    
  } else {
    radTransform1 = degToRad(transform1.eulerOrientation[1] + 90);
  }
  
  transform.orientation = [0,Math.sin((radTransform1/2)),0,Math.cos((radTransform1/2))];
  child.setGlobalTransform(transform);

}

async function openDoubleDoor(param){

  const entity = param.entity;
  const initialPos1 = param.initialTransformChildren[0];
  const initialPos2 = param.initialTransformChildren[1];
  
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
    radTransform1 = degToRad(transform1.eulerOrientation[1] + 90);
    radTransform2 = degToRad(transform2.eulerOrientation[1] - 90);

    transform1.orientation = [0,Math.sin((radTransform1/2)),0,Math.cos((radTransform1/2))];
    porte1.setGlobalTransform(transform1);

    transform2.orientation = [0,Math.sin((radTransform2/2)),0,Math.cos((radTransform2/2))];
    porte2.setGlobalTransform(transform2);
    
  } else {
    // radTransform1 = degToRad(initialPos1.eulerOrientation[1]);
    // radTransform2 = degToRad(initialPos2.eulerOrientation[1]);
    porte1.setGlobalTransform(initialPos1);
    porte2.setGlobalTransform(initialPos2);
  }


}

async function openKeypad(entity){
  const children  = await entity.getChildren();
  const gameCam = children.find((child) =>
    child.isAttached("camera")
  );

  SDK3DVerse.setMainCamera(gameCam);

  player.isTrigger = false;

}



//------------------Fonction conditionnelles--------------

function isElevator(){
  return player.save['elevator'];
}

function isShaker(){
  return player.save['shaker'];
}

function isRomero(){
  return player.save['romero'];
}