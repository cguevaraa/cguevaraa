const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

function createBaseScene () {

    let dlightPosition = new BABYLON.Vector3(0.02, -0.05, -0.05);
    let dLightOrientation = new BABYLON.Vector3(0, 20, 0);
    const meshesToLoad = [
      "SM_Bath_F0.glb",
      "SM_Bath_Gl.glb",
      "SM_Bath_Mi.glb",
      "SM_BigR_F0.glb",
      "SM_LivR_F0.glb",
      "SM_LivR_F1.glb",
      "SM_LivR_F2.glb",
      "SM_LivR_F3.glb",
      "SM_SmallR_F0.glb",
      "SM_Walls.glb",
      "SM_Ground.glb",
      "SM_SkySphere.glb",
        ];

    //Scene
    const scene = new BABYLON.Scene(engine);

    //Camera
    let camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 5,
        Math.PI / 3,
        4,
        new BABYLON.Vector3(0, 7, 0),
        scene
    );

    //Create PBR material
    const pbr = new BABYLON.PBRMaterial("pbr", scene);
    pbr.metallic = 0.0;
    pbr.roughness = 0;      
    pbr.subSurface.isRefractionEnabled = true;
    pbr.subSurface.indexOfRefraction = 1.5;
    pbr.subSurface.tintColor = new BABYLON.Color3(0.0, 0.3, 0.1);
    
    //This targets the camera to scene origin with Y bias: +1
    //camera.setTarget(new BABYLON.Vector3(0,1,0));
    camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // Some tweaks to limit the zoom and pan
    camera.minZ = 0.1;
    camera.maxZ = 50000;
    camera.wheelDeltaPercentage = 0.01;
    camera.upperRadiusLimit = 20;
    camera.lowerRadiusLimit = 2;
    camera._panningMouseButton = 2;

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

    // //Directional light
    // const dLight = new BABYLON.DirectionalLight(
    //     "dLight",
    //     dlightPosition,
    //     scene
    // );

    // //Directional light orientation
    // dLight.position = dLightOrientation;

    // //Point light
    // lightPos = (5, 10, -5);
    // const pLight = new BABYLON.PointLight(
    //     "pLight",
    //     lightPos,
    //     scene
    // );
    // //Light colors
    // pLight.diffuse = new BABYLON.Color3(0.53, 0.66, 0.74);
    // pLight.specular = new BABYLON.Color3(0.83, 0.86, 0.89);

    // //Shadows
    // let shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
    // shadowGenerator.useBlurExponentialShadowMap = true;


  //Lights
  var dLight = new BABYLON.DirectionalLight(
    "dLight",
    new BABYLON.Vector3(0.02, -0.05, -0.05),
    scene
  );
  dLight.position = new BABYLON.Vector3(0, 20, 0);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);


  //Shadows
  var shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
  shadowGenerator.useBlurExponentialShadowMap = true;
    
    // //Setup environment
    // let env = scene.createDefaultEnvironment({
    // createSkybox: true,
    // skyboxSize: 150,
    // skyboxColor: new BABYLON.Color3(0.01,0.01,0.01),
    // createGround: true,
    // groundSize: 100,
    // groundColor: new BABYLON.Color3(0.02,0.02,0.02),
    // enableGroundShadow: true,
    // groundYBias: 0.975,
    // });

    //Setup environment
var env = scene.createDefaultEnvironment({
  createSkybox: true,
  skyboxSize: 10,
  skyboxColor: new BABYLON.Color3(0.0375,0.0375,0.0375),
  environmentTexture: "/src/env/lilienstein.env",
  createGround: true,
  groundSize: 10,
  groundColor: new BABYLON.Color3(0.7,0.5,0.5),
  enableGroundShadow: true,
  groundYBias: 1.5,
});
    
    /**
    * ASYNC/AWAIT Function to load a model into the scene
    * @param {*} meshNames | can be "" for any
    * @param {*} rootUrl
    * @param {*} fileName
    */
    async function loadMeshes(meshNames, rootUrl, fileName) {
    let model = await BABYLON.SceneLoader.ImportMeshAsync(
        meshNames,
        rootUrl,
        fileName
        );

        console.log(fileName);

        //Add shadow caster to each mesh within model
        model.meshes.forEach((element) =>
        shadowGenerator.addShadowCaster(element, true)
        );

        // //Add the material we've created to each mesh
        // model.meshes.forEach((element) =>
        // element.material = pbr
        // );
    
        // // On pick interpolations
        // const prepareButton = function(mesh) {
        //     mesh.actionManager = new BABYLON.ActionManager(scene);//create collision and add to scene
                
        //     //what happens when the mesh is touched
        //     mesh.actionManager.registerAction(
        //         new BABYLON.InterpolateValueAction(
        //             BABYLON.ActionManager.OnPickTrigger,
        //             mesh.material.subSurface,
        //             'tintColor',
        //             BABYLON.Color3.Teal(),
        //             // color,
        //             1000
        //         )
        //     );
        // };
        
        // const m = model.meshes[1];
        // m.actionManager = new BABYLON.ActionManager(scene);
    
        // console.log(m);
    
        // prepareButton(m);
    }

    for (let index = 0; index < meshesToLoad.length; index++) {
        loadMeshes("", "/src/3Dmodels/VR_Archviz/", meshesToLoad[index]);
    }

    //Auxiliar variable to animate materials
    //var a = 0;
    
    // Code in this function will run ~60 times per second
    scene.registerBeforeRender(function () {
        //Slowly rotate camera
        camera.alpha += (0.00001 * scene.getEngine().getDeltaTime());
    //     a += 0.005;
    //     pbr.subSurface.tintColor.g = Math.cos(a) * 0.5 + 0.5;
    //     pbr.subSurface.tintColor.b = pbr.subSurface.tintColor.g;
        });

    return scene;
}

function createCamProductViz(scene)
{
    // CAMERA
    const cam = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 3,
        Math.PI / 1.7,
        4,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    return cam;
}

//***/PG */

const scene = createBaseScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});