const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
 

//***************PLAYGROUND FUNCTIONAL CODE*****************************************
const createScene =  function () {

const scene = new BABYLON.Scene(engine);

// const vrCam = new BABYLON.FreeCamera("vrCam", new BABYLON.Vector3(0, 1, 1), scene);
// // vrCam.setTarget(BABYLON.Vector3.Zero());
// vrCam.attachControl(canvas, true);
// vrCam.maxZ = 50000;
// vrCam.minZ = 0.1;

//Camera
  let camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 4,
      Math.PI / 2,
      8,
      new BABYLON.Vector3(0, 7, 0),
      scene
  );

  camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

  // Some tweaks to limit the zoom and pan
  camera.minZ = 0.01;
  camera.maxZ = 4000;
  camera.wheelDeltaPercentage = 0.001;
  camera.upperRadiusLimit = 20;
  camera.lowerRadiusLimit = 2;
  camera._panningMouseButton = 2;
  camera.upperBetaLimit = Math.PI/2;

  //Create a 'sphere' to use as camera target
  const camTarget = BABYLON.MeshBuilder.CreateSphere(
      "camTarget",
      { diameter: 0.0001, segments: 4 },
      scene
  );

  //Move the camTarget upward
  camTarget.position.y = 1.1;
  camTarget.position.x = -3;
  // Set camera target
  camera.target = camTarget.absolutePosition;

const meshesToLoad = [
        "SM_Bath_F0.glb",
        "SM_Bath_Gl.glb",
        "SM_Bath_Mi.glb",
        "SM_BigR_F0.glb",
        "SM_Ceiling.glb",
        "SM_LivR_F0.glb",
        "SM_LivR_F1.glb",
        "SM_LivR_F2.glb",
        "SM_LivR_F3.glb",
        "SM_SmallR_F0.glb",
        "SM_Walls.glb",
        "SM_Ground.glb",
        "SM_SkySphere.glb",
        ];

const toLoad = meshesToLoad.length;

  //Lights
  const dLight = new BABYLON.DirectionalLight(
        "dLight",
        new BABYLON.Vector3(0.02, -0.05, -0.05),
        scene
      );
      dLight.position = new BABYLON.Vector3(0, 20, 0);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
      //Shadows
      const shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
      shadowGenerator.useBlurExponentialShadowMap = true;

 /**
   * ASYNC/AWAIT Function to load a model into the scene
   * @param {*} meshNames | can be "" for any
   * @param {*} rootUrl
   * @param {*} fileName
   */
  async function loadMeshes(meshNames, rootUrl, fileName) {
        const model = await BABYLON.SceneLoader.ImportMeshAsync(
          meshNames,
          rootUrl,
          fileName
        );

        console.log(fileName);
        // //Add shadow caster to each mesh within model
        // model.meshes.forEach((element) =>
        //   shadowGenerator.addShadowCaster(element, true)
        // );
    
      }

      for (let index = 0; index < meshesToLoad.length; index++) {
              loadMeshes("", "/src/3Dmodels/VR_Archviz/", meshesToLoad[index]);
      }


//Setup environment
const env = scene.createDefaultEnvironment({
        createSkybox: true,
        skyboxSize: 150,
        skyboxColor: new BABYLON.Color3(0.0375,0.0375,0.0375),
        environmentTexture: "env/lilienstein.env",
        createGround: true,
        groundSize: 10,
        groundColor: new BABYLON.Color3(0.7,0.5,0.5),
        enableGroundShadow: true,
        groundYBias: 1,
      });

//*********WEBXR************************
    const xr = scene.createDefaultXRExperienceAsync({
    floorMeshes: [env.ground]
    });
//*********/WEBXR********************************


return scene;
};
//***************/PLAYGROUND FUNCTIONAL CODE*****************************************

const scene = createScene(); //Call the createScene function
        
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
                scene.render();
});


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
 });

