  /**
   * ASYNC/AWAIT Function to load a model into the scene
   * @param {*} meshNames | can be "" for any
   * @param {*} rootUrl
   * @param {*} fileName
   */
   async function importMeshes(meshNames, rootUrl, fileName) {
    const model = await BABYLON.SceneLoader.ImportMeshAsync(
      meshNames,
      rootUrl,
      fileName
    );
    //Add shadow caster to each mesh within model
    model.meshes.forEach((element) =>
      shadowGenerator.addShadowCaster(element, true)
    );
    
    //Add the material we've created to each mesh
    model.meshes.forEach((element) =>
    element.material = pbr
    );

           // On pick interpolations
           const prepareButton = function(mesh) {
            mesh.actionManager = new BABYLON.ActionManager(scene);//creo la colision en el cubo y agrego a escena
            
            //accion que va a pasar al tocar el cubo
            mesh.actionManager.registerAction(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    mesh.material.subSurface,
                    'tintColor',
                    BABYLON.Color3.Teal(),
                    // color,
                    1000
                )
            );
        };//*/
    


    const m = model.meshes[1];
    m.actionManager = new BABYLON.ActionManager(scene);

    console.log(m);

    prepareButton(m);

  }