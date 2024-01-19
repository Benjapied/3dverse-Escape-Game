export async function setPlayerCamera(controller,player) {

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