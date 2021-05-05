const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

function toggleVideo(name) {
    var x = document.getElementById(name);
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
};

//***PG */
function createBaseScene () {

    let dlightPosition = new BABYLON.Vector3(0.02, -0.05, -0.05);
    let dLightOrientation = new BABYLON.Vector3(0, 20, 0);
    const meshesToLoad = [
        "golfBall.glb",
        "squash.glb",
        ];

    //Scene
    const scene = new BABYLON.Scene(engine);

    //Camera
    let camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 3,
        Math.PI / 2.2,
        10,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // //Create PBR material
    // const pbr = new BABYLON.PBRMaterial("pbr", scene);
    // pbr.metallic = 0.0;
    // pbr.roughness = 0;      
    // pbr.subSurface.isRefractionEnabled = true;
    // pbr.subSurface.indexOfRefraction = 1.5;
    // pbr.subSurface.tintColor = new BABYLON.Color3(0.0, 0.5, 0.1);
    
    //This targets the camera to scene origin with Y bias: +1
    //camera.setTarget(new BABYLON.Vector3(0,1,0));
    camera.attachControl(canvas, false); //Set the last to false to avoid global zoom/scroll in page

    // Some tweaks to limit the zoom and pan
    camera.minZ = 0.1;
    camera.wheelDeltaPercentage = 0.001;
    camera.upperRadiusLimit = 20;
    camera.lowerRadiusLimit = 1;
    camera._panningMouseButton = null;

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
    groundYBias: 0.975,
    });
    
    // const golfBall = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 16}, scene);

    // //Create and setup pbr material
    // const pbr_golfBall = new BABYLON.PBRMaterial("pbr_golfBall", scene);

    // pbr_golfBall.useAmbientOcclusionFromMetallicTextureRed = true;
    // pbr_golfBall.useRoughnessFromMetallicTextureGreen = true; 
    // pbr_golfBall.useMetallnessFromMetallicTextureBlue = true;
    // pbr_golfBall.useRoughnessFromMetallicTextureAlpha = false;

    // pbr_golfBall.albedoTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_albedo.png", scene);
    // pbr_golfBall.bumpTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_nrm_invr.png", scene);
    // pbr_golfBall.metallicTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_orm.png", scene);;

    // golfBall.material = pbr_golfBall;

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

        console.log("Loaded: " + fileName);

        //Add shadow caster to each mesh within model
        model.meshes.forEach((element) =>
        shadowGenerator.addShadowCaster(element, true)
        );

        // //Add the material we've created to each mesh
        // model.meshes.forEach((element) =>
        // element.material = pbr
        // );



    
        // On pick actions
        const onPointerColor = function(mesh) {
            mesh.actionManager = new BABYLON.ActionManager(scene);
                
            //what happens when the mesh is touched
            mesh.actionManager.registerAction(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPointerOverTrigger,
                    mesh.material,
                    'emissiveColor',
                    new BABYLON.Color3.Teal(),
                    1
                )
            );

            mesh.actionManager.registerAction(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    mesh.material,
                    'emissiveColor',
                    new BABYLON.Color3.Black(),
                    1
                )
            );

            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnPickTrigger,
                    },
                    function toggleGolfVideo() {
                        var x = document.getElementById("golfSimVid");
                        if (x.style.display === "block") {
                          x.style.display = "none";
                        } else {
                          x.style.display = "block";
                        }
                      },
                    BABYLON.Condition(mesh.name === "golfBall"),
                )
            );
            
        //     mesh.actionManager.registerAction(
        //         new BABYLON.InterpolateValueAction(
        //             BABYLON.ActionManager.OnPickTrigger,
        //             mesh.material.subSurface,
        //             'tintColor',
        //             new BABYLON.Color3(0.3, 0.0, 0.0),
        //             1000
        //         )
        //     ).then(
        //         new BABYLON.InterpolateValueAction(
        //             BABYLON.ActionManager.OnPickTrigger,
        //             mesh.material.subSurface,
        //             'tintColor',
        //             new BABYLON.Color3(0.8, 0.0, 0.0),
        //             1000
        //         )  
        //     );   
        };            
        
        const m = model.meshes[1];
        console.log("Mesh name: " + m.name);

        onPointerColor(m);
    

    }



    for (let index = 0; index < meshesToLoad.length; index++) {
        loadMeshes("", "/src/3Dmodels/projects/", meshesToLoad[index]);
    }
    
    // Code in this function will run ~60 times per second
    scene.registerBeforeRender(function () {
        //Slowly rotate camera
        camera.alpha += (0.00001 * scene.getEngine().getDeltaTime());
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