const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const meshesToLoad = [
    "pRocks.glb",
    "golfBall.glb",
    "squash.glb",
    "poi.glb",
    "groot.glb",
    "reel.glb",
    "VRGlasses.glb",
    ];

const iframeVid = {
    "golfBall": "https://player.vimeo.com/video/544493063",
    "poi": "https://player.vimeo.com/video/451139384",
    "reel_primitive0": "https://player.vimeo.com/video/342067546",
    "reel_primitive1": "https://player.vimeo.com/video/342067546",
};

const redirect = {
    "squash_primitive0": "wasmGames/squashTheCreeps.html",
    "squash_primitive1": "wasmGames/squashTheCreeps.html",
    "squash_primitive2": "wasmGames/squashTheCreeps.html",
    "groot": "https://sketchfab.com/christianguevara",
    "VRGlasses_primitive0": "odalysVR.html",
    "VRGlasses_primitive1": "odalysVR.html",
    "VRGlasses_primitive2": "odalysVR.html",
    "VRGlasses_primitive3": "odalysVR.html",
}

function removeIFrame() {
    var frame = document.getElementById("iframe");
    frame.parentNode.removeChild(frame);
    var btn = document.getElementById("closeBtn");
    btn.parentNode.removeChild(btn);
};

//****PG****//
function createBaseScene () {

    const dlightPosition = new BABYLON.Vector3(0.02, -0.05, -0.05);
    const dLightOrientation = new BABYLON.Vector3(0, 20, 0);

    //Scene
    const scene = new BABYLON.Scene(engine);

    //Camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2.2,
        7,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    //Set as active camera
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
    dLight.intensity = 1;

    //Shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(2048, dLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    
    //Setup environment
    const env = scene.createDefaultEnvironment({
    createSkybox: true,
    skyboxSize: 150,
    skyboxColor: new BABYLON.Color3(0.01,0.01,0.01),
    environmentTexture: "/src/env/lilienstein.env",
    createGround: true,
    groundSize: 100,
    groundColor: new BABYLON.Color3(0.1,0.1,0.1),
    enableGroundShadow: true,
    groundYBias: 0.975,
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

        //Add shadow caster to each mesh within model
        model.meshes.forEach((element) =>
        shadowGenerator.addShadowCaster(element, true)
        );
    
        // On pick actions
        const onPointerAction = function(mesh) {
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
                    function chooseAction(){

                        if(iframeVid[mesh.name]){
                            console.log(mesh.name);
                            //Check if there's an iframe already and if we have a video address
                                if((!document.getElementById("iframe"))){
                                const divTo = document.getElementById("iFrameDiv");
                                //Create 'close' button and add to div
                                const btn = document.createElement("button");
                                btn.setAttribute("id", "closeBtn");
                                btn.setAttribute("onclick", "removeIFrame();");
                                btn.innerHTML = "CLOSE";
                                //Create the iframe and add to div
                                const ifrm = document.createElement("iframe");
                                ifrm.setAttribute("id", "iframe");
                                ifrm.setAttribute("src", iframeVid[mesh.name]);
                                ifrm.style.width = "640px";
                                ifrm.style.height = "480px";
                                divTo.appendChild(ifrm);
                                divTo.appendChild(btn);

                            }

                        }else if(redirect[mesh.name]){
                            console.log(mesh.name);
                            // window.location.href = redirect[mesh.name];
                            window.open(redirect[mesh.name], '_blank').focus();
                        }
                    },
                    BABYLON.Condition(mesh.name === "golfBall"),
                )
            );
        };

        model.meshes.forEach((element) =>
            {
             onPointerAction(element);
            }
        );
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

//****/PG****//

const scene = createBaseScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});