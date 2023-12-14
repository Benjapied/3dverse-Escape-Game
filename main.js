//------------------------------------------------------------------------------
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
  switch1,
  door1,
} from "./config.js";

import {
  Entity,
} from "./class.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------

const tabEntity = new Map();

async function InitApp() {
  await SDK3DVerse.joinOrStartSession({
    userToken: publicToken,
    sceneUUID: mainSceneUUID,
    canvas: document.getElementById("display-canvas"),
    createDefaultCamera: false,
    startSimulation: "on-assets-loaded",
  });

  await InitFirstPersonController(characterControllerSceneUUID);

  requestAnimationFrame(gameLoop);

  const player = await SDK3DVerse.engineAPI.findEntitiesByNames('Player');
  const entity = await SDK3DVerse.engineAPI.findEntitiesByEUID(switch1);
  const door = await SDK3DVerse.engineAPI.findEntitiesByEUID(door1);

  const Cplayer = player[0];
  const Centity = entity[0];
  const Cdoor = door[0];

  tabEntity.set(switch1, new Entity(Centity,printOue));
  tabEntity.set(door1, new Entity(Cdoor,openDoor,Cdoor));

  
  SetCollideEntities();

  Cdoor.setGlobalTransform({ orientation : [0, 0, 0, 1] });

  window.addEventListener('keydown',inputManager);
  window.addEventListener('keyup',resetKey);

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

  // The character controller scene is setup as having a single entity at its
  // root which is the first person controller itself.
  const firstPersonController = (await playerSceneEntity.getChildren())[0];
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

//--------------------Fonctions----------------------

let keyIsDown  = false;

function resetKey(){
  keyIsDown = false;
}

function inputManager(event) {
  if(keyIsDown){return;};
  if(event.key == 'a'){
    tabEntity.forEach(function(valeur) {
      if(valeur.isTrigger == true){
        valeur.triggerFunction();
      }
    });
    keyIsDown = true;
  };
}



function SetCollideEntities(){
  SDK3DVerse.engineAPI.onEnterTrigger((emitterEntity, triggerEntity) =>
    {
      tabEntity.get(String(triggerEntity.linker.components.euid.value)).isTrigger = true;
    });
  SDK3DVerse.engineAPI.onExitTrigger((emitterEntity, triggerEntity) =>
    {
      tabEntity.get(String(triggerEntity.linker.components.euid.value)).isTrigger = false;
    });
}

//------------------Fonctions des entities interractifs----------------

function printOue(){
  console.log("oue")
}

async function openDoor(entity){
  const child = (await entity.getChildren())[0];

  console.log(child.components.local_transform);

  const transform = child.getGlobalTransform();
  
  if(transform.orientation[1] == 0){
    transform.orientation[1] = 90;
    child.setGlobalTransform(transform);

    //child.components.local_transform.orientation = [0,90,0] ;
  } else {
    transform.orientation[1] = 0;
    child.setGlobalTransform(transform);

    //child.components.local_transform.orientation = [0,0,0] ;
  }

  console.log(child.components.local_transform);
  console.log(transform);
  
}