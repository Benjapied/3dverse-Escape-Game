//------------------------------------------------------------------------------
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
  switch1,
} from "./config.js";

import {
  Entity,
} from "./class.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------

const tabEntity = Array();

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

  const player1 = player[0];
  const entity1 = entity[0];
  tabEntity.push(new Entity(entity[0],printOue));

  SetCollidersEntities();

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
    for(let i = 0; i < tabEntity.length; i++){
      if(tabEntity[i].isTrigger == true){
        tabEntity[i].triggerFunction();
      }
    }
    keyIsDown = true;
  };
}

function SetCollidersEntities(){
  SDK3DVerse.engineAPI.onEnterTrigger((player1, entity1) =>
    {
      tabEntity[0].isTrigger = true;
    });
  SDK3DVerse.engineAPI.onExitTrigger((player1, entity1) =>
    {
      tabEntity[0].isTrigger = false;
    });

//   for(let i = 0; i < tabEntity.length(); i++){
//     SDK3DVerse.engineAPI.onEnterTrigger((player1, tabEntity[i].entity) =>
//     {
//       tabEntity[i].isTrigger = true;
//     });
//     SDK3DVerse.engineAPI.onEnterTrigger((player1, tabEntity[i].entity) =>
//     {
//       tabEntity[i].isTrigger = false;
//     });
//   }
}


//------------------Fonctions des entities interractifs----------------

function printOue(){
  console.log("oue")
}
