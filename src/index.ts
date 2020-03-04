// Used babylon website

import { Engine, Scene, CubeTexture, Color3, Color4, Texture, Vector3, ArcRotateCamera, WebXRExperienceHelper, WebXRSessionManager, StandardMaterial, SpotLight, PointLight, OculusTouchController, TransformNode, TargetCamera, WebVRFreeCamera } from "@babylonjs/core";
import "@babylonjs/core/materials/standardMaterial";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core";

import { AdvancedDynamicTexture, GUI3DManager, PlanePanel, StackPanel, StackPanel3D } from "@babylonjs/gui";

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

        const guiManager = new GUI3DManager(scene);

        let panel = MeshBuilder.CreatePlane("UI", { width: 8, height: 4 }, scene);
        panel.isVisible = false;
        panel.position = new Vector3(0, 2, 8);
        let planeUI = AdvancedDynamicTexture.CreateForMesh(panel, 1024, 512);

        vrHelper.onControllerMeshLoaded.add(controller => {
            (controller as OculusTouchController).onBButtonStateChangedObservable.add(event => {
                if (event.pressed) {
                    if (!panel.isVisible) {
                        panel.position = this.calculatePanelPosition(vrHelper.currentVRCamera! as WebVRFreeCamera);
                        panel.rotation = this.calculatePanelRotation(vrHelper.currentVRCamera! as WebVRFreeCamera);
                    }
                    panel.isVisible = !panel.isVisible;
                }
            });
        })

        // Menu
        let file = Dropdown.CreateDropdown("File", "120px", "40px");
        file.addOption("New", () => {});
        file.addOption("Load", () => {});
        file.addOption("Save", () => {});
        file.addOption("Quit", () => {});
        file.left = "5px"
        planeUI.addControl(file.container);

        let edit = Dropdown.CreateDropdown("Edit", "120px", "40px");
        edit.left = "130px";
        planeUI.addControl(edit.container);

        let view = Dropdown.CreateDropdown("View", "120px", "40px");
        view.addOption("Next", () => {});
        view.addOption("Previous", () => {});
        view.left = "255px";
        planeUI.addControl(view.container);

        StatusBar.createInstance("grey", "lightgrey");
        let statusBar = StatusBar.getInstance();
        planeUI.addControl(statusBar.container);
        
        let toolPalette = new ToolPalette("60px", "200px", "lightgrey");
        planeUI.addControl(toolPalette.container);

        return scene;
    }

    private static calculatePanelPosition(camera: WebVRFreeCamera) {
        let cameraYawRotation = camera.deviceRotationQuaternion.y;
        if (-.25 < cameraYawRotation && cameraYawRotation <= .25) {
            return new Vector3(0, 2, 8);
        } else if (.25 < cameraYawRotation && cameraYawRotation <= .75) {
            return new Vector3(8, 2, 0);
        } else if (.75 < cameraYawRotation || cameraYawRotation <= -.75) {
            return new Vector3(0, 2, -8);
        } else {
            return new Vector3(-8, 2, 0);
        }
    }
    private static calculatePanelRotation(camera: WebVRFreeCamera) {
        let cameraYawRotation = camera.deviceRotationQuaternion.y;
        if (-.25 < cameraYawRotation && cameraYawRotation <= .25) {
            return new Vector3(0, 0, 0);
        } else if (.25 < cameraYawRotation && cameraYawRotation <= .75) {
            return new Vector3(0, Math.PI / 2, 0);
        } else if (.75 < cameraYawRotation || cameraYawRotation <= -.75) {
            return new Vector3(0, Math.PI, 0);
        } else {
            return new Vector3(0, -Math.PI / 2, 0);
        }
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