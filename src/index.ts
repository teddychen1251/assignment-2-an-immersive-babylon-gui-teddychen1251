// Used babylon website

import { Engine, Scene, CubeTexture, Color3, Color4, Texture, Vector3, ArcRotateCamera, WebXRExperienceHelper, WebXRSessionManager, StandardMaterial, SpotLight, PointLight, OculusTouchController, TransformNode, TargetCamera, WebVRFreeCamera, AttachToBoxBehavior, BoundingBoxGizmo, Quaternion, Space } from "@babylonjs/core";
import "@babylonjs/core/materials/standardMaterial";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core";

import { AdvancedDynamicTexture, GUI3DManager, PlanePanel, StackPanel, StackPanel3D, Control } from "@babylonjs/gui";

import { Dropdown } from "./dropdown";
import { StatusBar } from "./statusbar";
import { ToolPalette } from "./toolpalette";
import { Canvas } from "./canvas";

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
        
        let planeGUIOn = true;

        // 3D interfaces
        const vrHelper = scene.createDefaultVRExperience();
        vrHelper.currentVRCamera!.position.y += 1.7;
        vrHelper.enableTeleportation({ floorMeshName: envHelper?.ground?.name });

        // plane GUI
        let panel = MeshBuilder.CreatePlane("UI", { width: 8, height: 4 }, scene);
        panel.isVisible = false;
        panel.position = new Vector3(0, 2, 8);
        let planeUI = AdvancedDynamicTexture.CreateForMesh(panel, 1024, 512);

        // controller-based GUI
        let width = .25;
        let height = .25;
        let menuPanel = MeshBuilder.CreatePlane("Menu", { width: width, height: height }, scene);
        let menuPanelTexture = AdvancedDynamicTexture.CreateForMesh(menuPanel);
        menuPanelTexture.background = "lightgrey";
        menuPanel.isVisible = false;
        let toolPanel = MeshBuilder.CreatePlane("Tools", { width: width, height: height }, scene);
        let toolPanelTexture = AdvancedDynamicTexture.CreateForMesh(toolPanel);
        toolPanelTexture.background = "lightgrey";
        toolPanel.isVisible = false;
        let statusBarPanel = MeshBuilder.CreatePlane("StatusBar", { width: width, height: height }, scene);
        let statusBarPanelTexture = AdvancedDynamicTexture.CreateForMesh(statusBarPanel, 512, 512);
        statusBarPanelTexture.background = "lightgrey";
        statusBarPanel.isVisible = false;
        let panels = [ menuPanel, toolPanel, statusBarPanel ];
        let index = 0;

        vrHelper.onControllerMeshLoadedObservable.add(controller => {
            if (controller.hand === 'left') {
                let controllerPos = new TransformNode("");
                controllerPos.position = controller.devicePosition
                panels.forEach(element => {
                    element.parent = controllerPos;
                    element.position = new Vector3(0, .11, 0);
                    element.lookAt(vrHelper.webVRCamera.devicePosition, Math.PI, Math.PI / 4, 0, Space.WORLD);
                });
                (controller as OculusTouchController).onYButtonStateChangedObservable.add(event => {
                    if (event.pressed) {
                        planeGUIOn = !planeGUIOn;
                        if (planeGUIOn) {
                            panels[index].isVisible = false;
                            threeCanvas.toolPalette = toolPalette;
                        } else {
                            panel.isVisible = false;
                            panels[index].isVisible = true;
                            threeCanvas.toolPalette = toolPaletteC;
                        }
                    }
                });
            } else if (controller.hand === 'right') {
                (controller as OculusTouchController).onBButtonStateChangedObservable.add(event => {
                    if (event.pressed) {
                        if (!planeGUIOn) {
                            index++;
                            index = index % 3;
                            panels[index % 3].isVisible = true;
                            panels[(index + 1) % 3].isVisible = false;
                            panels[(index + 2) % 3].isVisible = false;
                        } else {
                            if (!panel.isVisible) {
                                panel.position = this.calculatePanelPosition(vrHelper.currentVRCamera! as WebVRFreeCamera);
                                panel.rotation = this.calculatePanelRotation(vrHelper.currentVRCamera! as WebVRFreeCamera);
                            }
                            panel.isVisible = !panel.isVisible;
                        }
                    }
                });
            }
        });
    
        // Menu for plane GUI
        let statusBar = new StatusBar("grey", "lightgrey");
        planeUI.addControl(statusBar.container);

        let file = Dropdown.CreateDropdown("File", "120px", "40px", statusBar);
        file.addOption("New", () => {});
        file.addOption("Load", () => {});
        file.addOption("Save", () => {});
        file.addOption("Quit", () => {});
        file.left = "5px"
        planeUI.addControl(file.container);

        let edit = Dropdown.CreateDropdown("Edit", "120px", "40px", statusBar);
        edit.left = "130px";
        planeUI.addControl(edit.container);

        let view = Dropdown.CreateDropdown("View", "120px", "40px", statusBar);
        view.addOption("Next", () => {});
        view.addOption("Previous", () => {});
        view.left = "255px";
        planeUI.addControl(view.container);
        
        let toolPalette = new ToolPalette("60px", "200px", "lightgrey", statusBar);
        planeUI.addControl(toolPalette.container);

         // Menu for controller GUI
         let statusBarC = new StatusBar("grey", "lightgrey", Control.VERTICAL_ALIGNMENT_TOP);
         statusBarPanelTexture.addControl(statusBarC.container);

         let fileC = Dropdown.CreateDropdown("File", "325px", "40px", statusBarC);
         fileC.addOption("New", () => {});
         fileC.addOption("Load", () => {});
         fileC.addOption("Save", () => {});
         fileC.addOption("Quit", () => {});
         fileC.left = "12px"
         menuPanelTexture.addControl(fileC.container);
 
         let editC = Dropdown.CreateDropdown("Edit", "325px", "40px", statusBarC);
         editC.left = "349px";
         menuPanelTexture.addControl(editC.container);
 
         let viewC = Dropdown.CreateDropdown("View", "325px", "40px", statusBarC);
         viewC.addOption("Next", () => {});
         viewC.addOption("Previous", () => {});
         viewC.left = "686px";
         menuPanelTexture.addControl(viewC.container);
         
         let toolPaletteC = new ToolPalette("120px", "400px", "lightgrey", statusBarC, Control.HORIZONTAL_ALIGNMENT_LEFT, Control.VERTICAL_ALIGNMENT_TOP);
         toolPanelTexture.addControl(toolPaletteC.container);

        // Canvas
        const threeCanvas = new Canvas(scene, vrHelper, toolPalette);//delete statusBar

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