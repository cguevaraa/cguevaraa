const canvas = document.getElementById("rCanvasLP"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

function createBaseScene () {

    // Scene
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = createArcRotCamera(scene);
    //camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // Lights
    const dLight = createDirLight(scene);
    const pLight = createPointLight(scene);

    // Environment
    const env = createEnvironment(scene);

    // Shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
    shadowGenerator.useBlurExponentialShadowMap = true;

    // Build a mathematical ground with its normal and an offset
    //const groundData = new BABYLON.Plane(1, 1, 1, -1);
    
    const promises = [];


    return scene;

}

function createArcRotCamera(scene)
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

    // Some tweaks to limit the zoom and panning
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
    //Set camera target
    camera.target = camTarget.absolutePosition;

    return camera;
}

function createDirLight(scene)
{
    const dLight = new BABYLON.DirectionalLight(
        "dLight",
        new BABYLON.Vector3(0.02, -0.05, -0.05),
        scene
    );

    // Directional light orientation
    dLight.position = new BABYLON.Vector3(0, 20, 0);

    return dLight;
}

function createPointLight(scene)
{
    const pLight = new BABYLON.PointLight(
        "pLight",
        new BABYLON.Vector3(5, 10, -5),
        scene
    );

    // Light colors
    pLight.diffuse = new BABYLON.Color3(0.53, 0.66, 0.74);
    pLight.specular = new BABYLON.Color3(0.83, 0.86, 0.89);

    return pLight;
}

function createEnvironment(scene)
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