const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

function createBaseScene () {

    // Scene
    const scene = new BABYLON.Scene(engine);

    // // Camera
    // const camera = createArcRotCamera(scene);
    // //camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // // Lights
    // const dLight = createDirLight(scene);
    // const pLight = createPointLight(scene);

    // // Environment
    // const env = createEnvironment(scene);

    // // Shadows
    // const shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
    // shadowGenerator.useBlurExponentialShadowMap = true;

    return scene;
}

function createCamProductViz(scene)
{
    // CAMERA
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 3,
        Math.PI / 1.7,
        4,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    
    //Apply zoom and pan tweaks
    camera = tweakCam(camera);

    return camera;
}

function tweakCam(camera){
    // Some tweaks to limit the zoom and pan
    camera.minZ = 0.1;
    camera.wheelDeltaPercentage = 0.01;
    camera.upperRadiusLimit = 10;
    camera.lowerRadiusLimit = 2;
    camera._panningMouseButton = null;
    
    return camera;
}

function setCameraTarget(scene, camera, target){
    // // Create a 'sphere' to use as camera target
    // const camTarget = BABYLON.MeshBuilder.CreateSphere(
    //     "camTarget",
    //     { diameter: 0.0001, segments: 4 },
    //     scene
    // );
    // // Move the camTarget upward
    // camTarget.position.y = 1;
    //Set camera target
    camera.target = target.absolutePosition;

    return camera;
}

/**
 * 
 * @param {*} scene //The scene to add the light to
 * @param {*} position //Vector3
 * @returns
 */

function createDirLight(scene, position)
{
    // const dLight = new BABYLON.DirectionalLight(
    //     "dLight",
    //     new BABYLON.Vector3(0.02, -0.05, -0.05),
    //     scene
    // );

    const dLight = new BABYLON.DirectionalLight(
        "dLight",
        position,
        scene
    );

    // // Directional light orientation
    // dLight.position = new BABYLON.Vector3(0, 20, 0);

    return dLight;
}

/**
 * 
 * @param {*} scene 
 * @param {*} position //Vector3
 * @returns 
 */
function createPointLight(scene, position)
{
    // const pLight = new BABYLON.PointLight(
    //     "pLight",
    //     new BABYLON.Vector3(5, 10, -5),
    //     scene
    // );

    const pLight = new BABYLON.PointLight(
        "pLight",
        position,
        scene
    );

    // Light colors
    // pLight.diffuse = new BABYLON.Color3(0.53, 0.66, 0.74);
    // pLight.specular = new BABYLON.Color3(0.83, 0.86, 0.89);

    return pLight;
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
        createGround: true,
        groundSize: 100,
        groundColor: new BABYLON.Color3(0.02,0.02,0.02),
        enableGroundShadow: true,
        groundYBias: 0.875,
    });

    return env;
}

function importMeshes()
{

}

//[WIP]
function createPBRGlass(scene)
{
    //Create PBR material
    const pbr = new BABYLON.PBRMaterial("pbr", scene);
    pbr.metallic = 0.0;
    pbr.roughness = 0;
    pbr.subSurface.isRefractionEnabled = true;
    pbr.subSurface.indexOfRefraction = 1.5;
    pbr.subSurface.tintColor = new BABYLON.Color3(1, 1, 1);

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