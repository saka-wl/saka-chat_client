
import * as fabric from "fabric";

const rectOriginH = 200;
const rectOriginW = 200;

export class FabricController {
    private canvas: fabric.Canvas | null = null;
    private scaleRangle = {
        minX: 0.3,
        minY: 0.3,
        maxX: 2,
        maxY: 2,
    }
    public imagePosition: Array<Array<number>> = [];
    private rectItem: fabric.Rect | null = null;

    constructor(dom: HTMLCanvasElement) {
        if(!dom) {
            throw new Error("dom is required!");
        }
        this.canvas = new fabric.Canvas(dom, {
            backgroundColor: 'transparent',
        })
        this.scaleRangle.maxX = this.canvas.width / rectOriginW;
        this.scaleRangle.maxY = this.canvas.height / rectOriginH;
    }

    private addScreenShot() {
        if(!this.canvas) {
            return;
        }
        const rect = new fabric.Rect({
            width: rectOriginW,
            height: rectOriginH,
            stroke: 'rgb(197, 255, 255, 0.6)',
            strokeWidth: 2,
            fill: 'rgb(197, 255, 255, 0.4)',
            hasBorders: true,
            strokeUniform: true,
            perPixelTargetFind: true,
        });
        rect.setControlsVisibility({
            mtr: false,
        });
        rect.on('scaling', (e) => {
            const target = e.transform.target as fabric.Group;
            const scaleX = target.scaleX;
            const scaleY = target.scaleY;
            if(scaleX < this.scaleRangle.minX) target.set('scaleX', this.scaleRangle.minX);
            if(scaleY < this.scaleRangle.minY) target.set('scaleY', this.scaleRangle.minY);
            if(scaleX > this.scaleRangle.maxX) target.set('scaleX', this.scaleRangle.maxX);
            if(scaleY > this.scaleRangle.maxY) target.set('scaleY', this.scaleRangle.maxY);
            // this.imagePosition = [[target.left, target.top], [target.left + target.width, target.top + target.height]];
        })
        rect.on('mouseup', (e) => {
            const target = e.transform.target as fabric.Group;
            const left = target.left;
            const top = target.top;
            const width = target.width;
            const height = target.height;
            if(left < 0) target.set('left', 0);
            if(top < 0) target.set('top', 0);
            if(this.canvas?.width && left + width > this.canvas?.width) target.set('left', this.canvas?.width - width);
            if(this.canvas?.height && top + height > this.canvas?.height) target.set('top', this.canvas?.height - height);
            // this.imagePosition = [[target.left, target.top], [target.left + width, target.top + height]];
        })
        const init = () => {
            let t = 0;
            let l = 0;
            if(this.canvas?.height) t = (this.canvas?.height - rectOriginH) / 2;
            if(this.canvas?.width) l = (this.canvas?.width - rectOriginW) / 2;
            rect.set('top', t);
            rect.set('left', l);
            // this.imagePosition = [[l, t], [l + rectOriginW, t + rectOriginH]];
        }
        init();
        this.rectItem = rect;
        this.canvas.add(rect);
    }
    getScreenShotImage() {
        if(!this.canvas || !this.rectItem) return null;
        return [[this.rectItem.left, this.rectItem.top], [this.rectItem.width * this.rectItem.scaleX, this.rectItem.height * this.rectItem.scaleY]];
    }
    add() {
        this.addScreenShot();
    }
    clear() {
        this.canvas?.clear();
    }
    destroy() {
        this.canvas?.dispose();
    }
}