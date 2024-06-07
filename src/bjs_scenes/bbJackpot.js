const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

function createBaseScene () {

    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
    }, undefined, undefined, undefined, true);

    let dlightPosition = new BABYLON.Vector3(0.02, -0.05, -0.05);
    let dLightOrientation = new BABYLON.Vector3(0, 20, 0);
    const meshesToLoad = [
        "bbJackpot.glb"
        ];

    //Scene
    const scene = new BABYLON.Scene(engine);

    //Camera
    const cameraRadius = 2.8;
    let camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI,
        Math.PI / 1.7,
        cameraRadius,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    //This targets the camera to scene origin with Y bias: +1
    //camera.setTarget(new BABYLON.Vector3(0,1,0));
    camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // Some tweaks to limit the zoom and pan
    camera.minZ = 0.1;
    camera.wheelDeltaPercentage = 0;
    camera.upperRadiusLimit = cameraRadius;
    camera.lowerRadiusLimit = cameraRadius;
    camera.panningSensibility = 0;

    //Create a 'sphere' to use as camera target
    const camTarget = BABYLON.MeshBuilder.CreateSphere(
        "camTarget",
        { diameter: 0.0001, segments: 4 },
        scene
    );

    //Move the camTarget upward
    camTarget.position.y = 1.1;
    // Set camera target
    camera.target = camTarget.absolutePosition;

    //Directional light
    const dLight = new BABYLON.DirectionalLight(
        "dLight",
        dlightPosition,
        scene
    );

    //Directional light orientation
    dLight.position = dLightOrientation;

    //Point light
    lightPos = (5, 10, -5);
    const pLight = new BABYLON.PointLight(
        "pLight",
        lightPos,
        scene
    );
    //Light colors
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
    groundYBias: 1.5,
    });

    /*************** PARTICLES *************/
        var radius = 2;
        var angle = Math.PI / 3;
    
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        var particleSystem2 = new BABYLON.ParticleSystem("particles", 2000, scene);
    
        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("/src/img/flare.png", scene);
        particleSystem2.particleTexture = new BABYLON.Texture("/src/img/flare.png", scene);
    
        // Where the particles come from
        particleSystem.emitter = new BABYLON.Vector3(0,0,1); // the starting location
        particleSystem2.emitter = new BABYLON.Vector3(0,0,-1); // the starting location
    
        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 1.0, 0.8, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        particleSystem2.color1 = new BABYLON.Color4(1.0, 0.7, 0.8, 1.0);
        particleSystem2.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem2.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    
        // Size of each particle (random between...
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.2;
        particleSystem2.minSize = 0.05;
        particleSystem2.maxSize = 0.2;
    
        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.2;
        particleSystem2.minLifeTime = 0.1;
        particleSystem2.maxLifeTime = 0.2;
    
        // Emission rate
        particleSystem.emitRate = 2000;
        particleSystem2.emitRate = 2000;
    
    
        /******* Emission Space ********/
        particleSystem.createConeEmitter(radius, angle);
        particleSystem2.createConeEmitter(radius, angle);
    
        // Speed
        particleSystem.minEmitPower = 5;
        particleSystem.maxEmitPower = 10;
        particleSystem.updateSpeed = 0.008;
        particleSystem2.minEmitPower = 5;
        particleSystem2.maxEmitPower = 10;
        particleSystem2.updateSpeed = 0.008;

        /************************************ */

        /********** SOUND ************/
        const applause = new BABYLON.Sound("applause", "/src/audio/applause.wav", scene);
        const bell = new BABYLON.Sound("bell", "/src/audio/bell.wav", scene);
        const turningWheel = new BABYLON.Sound("bell", "/src/audio/slotMachine.mp3", scene);
        /******************************* */




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

        const anims = model.animationGroups;

        //Add shadow caster to each mesh within model
        model.meshes.forEach((element) => {
            shadowGenerator.addShadowCaster(element, true);
    });

        // On pick interpolations
        const onPointerAnim = function(mesh) {
            mesh.actionManager = new BABYLON.ActionManager(scene);

            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                      trigger: BABYLON.ActionManager.OnPickTrigger,
                      parameter: mesh,
                    },
                    function () {
                        turningWheel.play();
                        anims.forEach(anim => anim.start());
                        setTimeout(() => {
                                // Start the particle system
                                turningWheel.stop();
                                bell.play();
                                applause.play();
                                particleSystem.start();
                                particleSystem2.start();                            
                            }, "6000"
                        )},
                  ),
            );
        };

        // Add pointer interaction to one mesh only
        const slotMachineMesh = model.meshes[1];

        onPointerAnim(slotMachineMesh);

    }

    for (let index = 0; index < meshesToLoad.length; index++) {
        loadMeshes("", "/src/3Dmodels/jackpot/", meshesToLoad[index]);
    }

    // Code in this function will run ~60 times per second
    scene.registerBeforeRender(function () {

        });

    return scene;
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