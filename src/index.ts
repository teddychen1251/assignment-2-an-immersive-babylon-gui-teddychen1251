// Used babylon website

import { Engine, Scene, CubeTexture, Color3, Color4, Texture, Vector3, ArcRotateCamera, WebXRExperienceHelper, WebXRSessionManager, StandardMaterial, SpotLight, PointLight } from "@babylonjs/core";
import "@babylonjs/core/materials/standardMaterial";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core";

import { AdvancedDynamicTexture } from "@babylonjs/gui";

import { Dropdown } from "./dropdown";
import { StatusBar } from "./statusbar";
import { ToolPalette } from "./toolpalette";

var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
var engine = new Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the Playground Class with a static CreateScene function ******/
class Draw3D { 
    public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
        // Create the scene space
        var scene = new Scene(engine);
        scene.createDefaultCameraOrLight(true, true, true);
        let envHelper = scene.createDefaultEnvironment({
            skyboxTexture: new CubeTexture("textures/paper", scene),
            skyboxColor: Color3.White(),
            groundTexture: new Texture("textures/wood.jpg", scene),
        });
        let displayLight = new SpotLight("displayLight", new Vector3(0, 2, 0), new Vector3(0, -1, 0), Math.PI / 3, 2, scene);

        // 3D interface
        const vrHelper = scene.createDefaultVRExperience();
        vrHelper.currentVRCamera!.position.y += 1.7;
        vrHelper.enableTeleportation({ floorMeshName: envHelper?.ground?.name });


        return scene;
    }
}

/******* End of the create scene function ******/    
// code to use the Class above
var createScene = function() { 
    return Draw3D.CreateScene(engine, 
        engine.getRenderingCanvas() as HTMLCanvasElement); 
}

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
    engine.resize();
});