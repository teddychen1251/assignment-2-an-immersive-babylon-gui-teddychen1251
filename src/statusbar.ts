import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel } from "@babylonjs/gui/2D";

export class StatusBar {

    static instance: StatusBar;
    static createInstance(headerColor: string, textAreaColor: string) {
        StatusBar.instance = new StatusBar(headerColor, textAreaColor);
    }
    static getInstance(): StatusBar {
        return StatusBar.instance;
    }

    container: Container;
    header: Rectangle;
    scrollRegion: ScrollViewer;
    logs: StackPanel;
    minimized: boolean = true;

    private constructor(headerColor: string, textAreaColor: string) {
        this.container = new StackPanel();
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.container.isHitTestVisible = false;

        this.header = new Rectangle();
        this.header.background = headerColor;
        this.header.height = "20px";
        this.header.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.header.isPointerBlocker = true;

        let headerText = new TextBlock(undefined, "Status Bar");
        headerText.paddingLeft = "5px";
        headerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.header.addControl(headerText);

        this.scrollRegion = new ScrollViewer();
        this.scrollRegion.background = textAreaColor;
        this.scrollRegion.height = "25px";
        this.scrollRegion.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.logs = new StackPanel();
        this.logMessage("Welcome to Draw3D");
        this.scrollRegion.addControl(this.logs);

        this.header.onPointerUpObservable.add(() => {
            this.container.zIndex = 777;
            this.scrollRegion.height = this.minimized ? `${window.innerHeight - 20}px` : "25px";
            this.minimized = !this.minimized;
            this.scrollRegion.verticalBar.value = 1;
        });

        this.container.addControl(this.header);
        this.container.addControl(this.scrollRegion);
        this.scrollRegion.verticalBar.value = 1;
    }
    // TODO: fix wrapping for big strings
    logMessage(message: string) {
        let log = new TextBlock(undefined, message);
        log.textWrapping = TextWrapping.WordWrap;
        log.resizeToFit = true;
        log.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        log.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        log.paddingLeft = "5px";
        this.logs.addControl(log);
        this.scrollRegion.verticalBar.value = 1;
        while (this.logs.children.length > 70) {
            this.logs.children.shift();
        }
    }
}