const canvas = document.getElementById("rCanvasLP"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//***PG */

const createScene = function () {
	const scene = new BABYLON.Scene(engine);

	const camera = new BABYLON.ArcRotateCamera("Camera", 0/*3 * Math.PI / 2*/, Math.PI / 1.8, 10, BABYLON.Vector3.Zero(), scene);

	camera.attachControl(canvas, true);

       //Lights
	const light = new BABYLON.PointLight("hemi", new BABYLON.Vector3(150, 100, -50), scene);

     const dLight = new BABYLON.DirectionalLight(
      "dLight",
      new BABYLON.Vector3(0.02, -0.05, -0.05),
      scene
    );

    light.intensity = 1;

    // Async loading list
    //var promises = [];

    const golfBall = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 16}, scene);

    //Create and setup pbr material
    const pbr_golfBall = new BABYLON.PBRMaterial("pbr_golfBall", scene);

    pbr_golfBall.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr_golfBall.useRoughnessFromMetallicTextureGreen = true; 
    pbr_golfBall.useMetallnessFromMetallicTextureBlue = true;
    pbr_golfBall.useRoughnessFromMetallicTextureAlpha = false;

    pbr_golfBall.albedoTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_albedo.png", scene);
    pbr_golfBall.bumpTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_nrm_invr.png", scene);
    pbr_golfBall.metallicTexture = new BABYLON.Texture("src/3Dmodels/textures/TX_golfBall_orm.png", scene);;

    // pbr_golfBall.albedoTexture.wAng = Math.PI/2;
    // pbr_golfBall.bumpTexture.wAng = Math.PI/2;
    // pbr_golfBall.metallicTexture.wAng = Math.PI/2;
    // pbr_golfBall.ambientTexture.wAng = Math.PI/2;

    // pbr_golfBall.metallic = 1;
    // pbr_golfBall.roughness = 1;

    golfBall.material = pbr_golfBall;

	return scene;
}

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