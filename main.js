//------------------------------------------------------------------------------

import {Entity,Door,DoubleDoor,Keypad,Player,TextFrame, TextManager} from "./config/classConfig.js";
import {setEntitiesInTab, initDicoKeypad} from "./config/entitiesConfig.js"
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
} from "./config/constanteConfig.js";

import { setPlayerCamera, setFPSCameraController, gameLoop} from "./config/functionConfig.js";

import { CkeypadElevatorGame , keypadShakerGame} from "./config/constanteConfig.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------

//variable qui seront set plus tard dans le code, fonctions présentes dans entitiesConfig.js
let dicoKeypad;
export let player;
export let tabEntity;
let textManager;

async function InitApp() {
  await SDK3DVerse.startSession({
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

  tabEntity = await setEntitiesInTab();
  TextManager.Init();
  
  dicoKeypad = initDicoKeypad();
  SetCollideEntities();

  window.addEventListener('keydown',inputManager);
  window.addEventListener('keyup',resetKey);
  window.addEventListener('click',onClick);
  window.addEventListener('unclicked',resetClick);
  window.addEventListener('click', changeNumber);
  window.addEventListener('click',confirmKeypad);

  window.addEventListener('click',TextManager.Get().disableText.bind(TextManager.Get()));


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

  await setPlayerCamera(playerSceneEntity, player);

  player = new Player(playerSceneEntity);

}

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
    setPlayerCamera(player.entity,player);
    keyIsDown = true;
  };
  if(event.key == 'b'){
    TextManager.Get().addText('zob','neuy');
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

