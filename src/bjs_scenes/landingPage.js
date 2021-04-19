const canvas = document.getElementById("rCanvasLP"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

//Scene and camera
var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  
  //CAMERA NON-VR SETUP
  var camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 3,
    Math.PI / 2,
    3.5,
    new BABYLON.Vector3(0, 0.5, 0),
    scene
  );

  // This targets the camera to scene origin with Y bias: +1
  camera.setTarget(new BABYLON.Vector3(0,1,0));

  camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

  //Create PBR material
  var pbr = new BABYLON.PBRMaterial("pbr", scene);
  pbr.metallic = 0.0;
  pbr.roughness = 0;      
  pbr.subSurface.isRefractionEnabled = true;
  pbr.subSurface.indexOfRefraction = 1.5;
  pbr.subSurface.tintColor = new BABYLON.Color3(0, 0, 0);
  
  //NON-VR SETUP
  camera.minZ = 0.1;
  camera.wheelDeltaPercentage = 0.01;
  camera.upperRadiusLimit = 10;
  camera.lowerRadiusLimit = 2;
  camera._panningMouseButton = null;

  // Create a 'sphere' to use as camera target
  var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.01, segments: 4 },
    scene
  );
  // Move the sphere upward
  sphere.position.y = 1;
  //Set camera target
  camera.target = sphere.absolutePosition;

  /**
   * ASYNC/AWAIT Function to load a model into the scene
   * @param {*} meshNames | can be "" for any
   * @param {*} rootUrl
   * @param {*} fileName
   */
  async function loadMeshes(meshNames, rootUrl, fileName) {
    var model = await BABYLON.SceneLoader.ImportMeshAsync(
      meshNames,
      rootUrl,
      fileName
    );
    //Add shadow caster to each mesh within model
    model.meshes.forEach((element) =>
      shadowGenerator.addShadowCaster(element, true)
    );

    model.meshes.forEach((element) =>
    element.material = pbr
  );

  }

  loadMeshes("", "/src/3Dmodels/", "japanDragon.glb"); //Here the model to load

  //Setup environment
  var env = scene.createDefaultEnvironment({
    createSkybox: true,
    skyboxSize: 150,
    skyboxColor: new BABYLON.Color3(0.01,0.01,0.01),
    createGround: true,
    groundSize: 100,
    groundColor: new BABYLON.Color3(0.02,0.02,0.02),
    enableGroundShadow: true,
    groundYBias: 1,
  });

   //Build a mathematical ground with its normal and an offset
   var groundData = new BABYLON.Plane(1, 1, 1, -1);

  //Lights
  var dLight = new BABYLON.DirectionalLight(
    "dLight",
    new BABYLON.Vector3(0.02, -0.05, -0.05),
    scene
  );
  dLight.position = new BABYLON.Vector3(0, 20, 0);
  var pLight = new BABYLON.PointLight(
    "pLight",
    new BABYLON.Vector3(5, 10, -5),
    scene
  );
  pLight.diffuse = new BABYLON.Color3(0.53, 0.66, 0.74);
  pLight.specular = new BABYLON.Color3(0.83, 0.86, 0.89);

  //Shadows
  var shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
  shadowGenerator.useBlurExponentialShadowMap = true;

  //Auxiliar variable to animate materials
  var a = 0;
  // Code in this function will run ~60 times per second
  scene.registerBeforeRender(function () {
    //Slowly rotate camera
    camera.alpha += 0.002;
    a += 0.005;
    pbr.subSurface.tintColor.g = Math.cos(a) * 0.5 + 0.5;
    pbr.subSurface.tintColor.b = pbr.subSurface.tintColor.g;

  });

  
//*********WEBXR************************
//var env = scene.createDefaultEnvironment({groundYBias: 1}); //Needed only if not already created!

// const xr = scene.createDefaultXRExperienceAsync({
//     floorMeshes: [env.ground]
//     });
//*********/WEBXR********************************

  return scene;
};

//***/PG */

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});