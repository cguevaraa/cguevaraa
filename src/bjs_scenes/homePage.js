const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

function createBaseScene () {

    let dlightPosition = new BABYLON.Vector3(0.02, -0.05, -0.05);
    let dLightOrientation = new BABYLON.Vector3(0, 20, 0);
    const meshesToLoad = [
        "dragonRocks.glb",
        ];

    // Scene
    const scene = new BABYLON.Scene(engine);

    // Camera
    let camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 3,
        Math.PI / 1.7,
        4,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    //Create PBR material
    const pbr = new BABYLON.PBRMaterial("pbr", scene);
    pbr.metallic = 0.0;
    pbr.roughness = 0;      
    pbr.subSurface.isRefractionEnabled = true;
    pbr.subSurface.indexOfRefraction = 1.5;
    pbr.subSurface.tintColor = new BABYLON.Color3(0, 0, 0);
    
    // This targets the camera to scene origin with Y bias: +1
    //camera.setTarget(new BABYLON.Vector3(0,1,0));
    camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // Some tweaks to limit the zoom and pan
    camera.minZ = 0.1;
    camera.wheelDeltaPercentage = 0.01;
    camera.upperRadiusLimit = 10;
    camera.lowerRadiusLimit = 2;
    camera._panningMouseButton = null;

    // Create a 'sphere' to use as camera target
    const camTarget = BABYLON.MeshBuilder.CreateSphere(
        "camTarget",
        { diameter: 0.0001, segments: 4 },
        scene
    );

    // Move the camTarget upward
    camTarget.position.y = 1;
    // Set camera target
    camera.target = camTarget.absolutePosition;

    //Directional light
    const dLight = new BABYLON.DirectionalLight(
        "dLight",
        dlightPosition,
        scene
    );

    // Directional light orientation
    dLight.position = dLightOrientation;

    //Point light
    lightPos = (5, 10, -5);
    const pLight = new BABYLON.PointLight(
        "pLight",
        lightPos,
        scene
    );
    // Light colors
    pLight.diffuse = new BABYLON.Color3(0.53, 0.66, 0.74);
    pLight.specular = new BABYLON.Color3(0.83, 0.86, 0.89);

    //Shadows
    let shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    
    //Setup environment
    let env = scene.createDefaultEnvironment({
    createSkybox: true,
    skyboxSize: 150,
    skyboxColor: new BABYLON.Color3(0.01,0.01,0.01),
    createGround: true,
    groundSize: 100,
    groundColor: new BABYLON.Color3(0.02,0.02,0.02),
    enableGroundShadow: true,
    groundYBias: 0.875,
    });
    
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

        console.log(fileName);

        //Add shadow caster to each mesh within model
        model.meshes.forEach((element) =>
        shadowGenerator.addShadowCaster(element, true)
        );

        //Add the material we've created to each mesh
        model.meshes.forEach((element) =>
        element.material = pbr
        );
    
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
        loadMeshes("", "/src/3Dmodels/", meshesToLoad[index]);
    }


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

/**
 * 
 * @param {*} scene 
 * @param {*} createSB // bool (create SkyBox (SB)?)
 * @param {*} SBSize // number
 * @param {*} SBColor // Color3
 * @param {*} createGR // bool (create ground (GR)?)
 * @param {*} GRSize // number
 * @param {*} GRColor //Color3
 * @param {*} enableGRShadow // bool
 * @param {*} GRYBias // number
 * @param {*} envText // string (path file.env)
 * @returns 
 */
function createEnvironment(scene, 
    createSB, 
    SBSize, 
    SBColor, 
    createGR,
    GRSize,
    GRColor,
    enableGRShadow,
    GRYBias,
    envText = '')
{
    const env = scene.createDefaultEnvironment({
        createSkybox: true,
        skyboxSize: 150,
        skyboxColor: new BABYLON.Color3(0.01,0.01,0.01),
        environmentTexture: envText,
        createGround: true,
        groundSize: 100,
        groundColor: new BABYLON.Color3(0.02,0.02,0.02),
        enableGroundShadow: true,
        groundYBias: 0.875,
    });

    return env;
}

//[WIP]
function createPBRGlass(scene)
{
    //Create PBR material
    let pbr = new BABYLON.PBRMaterial("pbr", scene);
    pbr.metallic = 0.0;
    pbr.roughness = 0;      
    pbr.subSurface.isRefractionEnabled = true;
    pbr.subSurface.indexOfRefraction = 1.5;
    pbr.subSurface.tintColor = new BABYLON.Color3(0, 0, 0);

    return pbr;
}

//[WIP]
function createPBRFromTextures(scene, albedo, bump, orm)
{
    //Create and setup pbr material
    const pbr = new BABYLON.PBRMaterial("pbr", scene);

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.useRoughnessFromMetallicTextureAlpha = false;

    pbr.albedoTexture = new BABYLON.Texture(albedo, scene);
    pbr.bumpTexture = new BABYLON.Texture(bump, scene);
    pbr.metallicTexture = new BABYLON.Texture(orm, scene);
    //pbr.bumpTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_nrm_invr.png", scene);

    return pbr;
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