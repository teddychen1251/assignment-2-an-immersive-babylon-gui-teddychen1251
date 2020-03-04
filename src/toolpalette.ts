import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel, Button, Grid, ColorPicker } from "@babylonjs/gui/2D";
import { Animation, Node } from "@babylonjs/core";
import { StatusBar } from "./statusbar";

export class ToolPalette {
    container: Container;
    width: string;
    height: string;
    background: string;
    toolPalette: StackPanel;
    brushPalette: Grid;
    colorPicker: ColorPicker;

    constructor(width: string, height: string, background: string) {
        this.width = width;
        this.height = height;
        this.background = background;
        let heightAsNum = parseInt(this.height);

        this.container = new Container();
        this.container.isHitTestVisible = false;  
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;      

        this.toolPalette = new StackPanel();
        this.toolPalette.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.toolPalette.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.toolPalette.isHitTestVisible = false;
        this.toolPalette.width = this.width;
        this.toolPalette.height = this.height;
        this.toolPalette.background = this.background;
        this.toolPalette.top = `-${heightAsNum / 2}px`;

        let line = Button.CreateImageOnlyButton("Line", "textures/diagonalLine.png");console.log(line.background);
        line.height = `${heightAsNum / 5}px`;
        line.onPointerUpObservable.add(() => {
            this.clearButtons(pen, eraser);
            line.background = "darkgrey";
            StatusBar.getInstance().logMessage("Line tool clicked");
        });
        let pen = Button.CreateImageOnlyButton("Pen", "textures/pen.png");
        pen.height = `${heightAsNum / 5}px`;
        pen.onPointerUpObservable.add(() => {
            this.clearButtons(line, eraser);
            pen.background = "darkgrey";
            StatusBar.getInstance().logMessage("Pen tool clicked");
        });
        let eraser = Button.CreateImageOnlyButton("Eraser", "textures/eraser.png");
        eraser.height = `${heightAsNum / 5}px`;
        eraser.onPointerUpObservable.add(() => {
            this.clearButtons(line, pen);
            eraser.background = "darkgrey";
            StatusBar.getInstance().logMessage("Eraser tool clicked");
        });
        let brush = Button.CreateImageOnlyButton("Brush", "textures/brush.png");
        brush.height = `${heightAsNum / 5}px`;
        brush.onPointerUpObservable.add(() => {
            this.clearButtons(pen, line, eraser);
            this.colorPicker.isVisible = false;
            this.brushPalette.isVisible = !this.brushPalette.isVisible;
            StatusBar.getInstance().logMessage("Brush palette clicked");
        });
        let colorWheel = Button.CreateImageOnlyButton("Color Wheel", "textures/colorWheel.png");
        colorWheel.height = `${heightAsNum / 5}px`;
        colorWheel.onPointerUpObservable.add(() => {
            this.clearButtons(pen, line, eraser);
            this.brushPalette.isVisible = false;
            this.colorPicker.isVisible = !this.colorPicker.isVisible;
            StatusBar.getInstance().logMessage("Color wheel clicked");
        });
        this.toolPalette.addControl(line);
        this.toolPalette.addControl(pen);
        this.toolPalette.addControl(eraser);
        this.toolPalette.addControl(brush);
        this.toolPalette.addControl(colorWheel);

        this.container.addControl(this.toolPalette);

        this.toolPalette.onPointerEnterObservable.add(() => {
            this.toolPalette.zIndex = 777;
        });
        this.toolPalette.onPointerOutObservable.add(() => {
            this.toolPalette.zIndex = 0;
        });

        this.brushPalette = new Grid();
        this.brushPalette.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.brushPalette.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.brushPalette.isHitTestVisible = false;
        this.brushPalette.addColumnDefinition(30, true);
        this.brushPalette.addColumnDefinition(30, true);
        this.brushPalette.addRowDefinition(50, true);
        this.brushPalette.addRowDefinition(50, true);
        this.brushPalette.addRowDefinition(50, true);
        this.brushPalette.addRowDefinition(50, true);
        this.brushPalette.top = "50%";
        // this.brushPalette.left = "-60px";
        this.brushPalette.isVisible = false;
        let brushTextures = [
            "spray.png",
            "streak.jpg",
            "shrek.png",
            "peppa.png",
            "spongebob.jpg",
            "handsome-squidward.jpg",
            "rainbow.png",
            "water.jpg"
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                let textureButton = 
                    Button.CreateImageOnlyButton(brushTextures[i * 2 + j], `textures/${brushTextures[i * 2 + j]}`);
                this.brushPalette.addControl(textureButton, i, j);
            }
        }
        this.container.addControl(this.brushPalette);
        
        this.colorPicker = new ColorPicker();
        this.colorPicker.size = this.height;
        this.colorPicker.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.colorPicker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.colorPicker.top = `${heightAsNum / 2}px`;
        // this.colorPicker.left = `-${this.colorPicker.widthInPixels}px`;
        this.colorPicker.isVisible = false;
        this.container.addControl(this.colorPicker);
    }

    clearButtons(...buttons: Button[]) {
        for (let button of buttons) {
            button.background = "";
        }
    }
}