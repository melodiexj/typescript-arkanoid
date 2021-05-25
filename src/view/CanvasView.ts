import { Brick } from '../sprites/brick';
import { Paddle } from '../sprites/paddle';
import { Ball } from '../sprites/ball';
import { BRICK_IMAGES } from '~/setup';

export class CanvasView {
    canvas: HTMLCanvasElement; // public class variable "canvas" of type "HTMLCanvasElement"
    private context: CanvasRenderingContext2D | null; // private var of type "CanvasRenderingContext2D" OR "null"
    private scoreDisplay: HTMLObjectElement | null;
    private start: HTMLObjectElement | null;
    private info: HTMLObjectElement | null;

    constructor(canvasName: string){
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
        this.scoreDisplay = document.querySelector('#score');
        this.start = document.querySelector('#start');
        this.info = document.querySelector('#info');
    }

    // clear function: of type void, aka. returns nothing
    // clear the canvas (all canvas, starting from upperleft corner (pt 0,0))
    clear(): void {
        // '?' = if can't find this.context, return undefined?
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initStartButton(startFunction: (view: CanvasView) => void){
        // initStartButton will taken in a function, startFunction, which will return nothing and be used to implement start button
        this.start?.addEventListener('click', () => startFunction(this));
    }

    drawScore(score: number): void {
        // if this.scoreDisplay exists...
        if (this.scoreDisplay) this.scoreDisplay.innerHTML = score.toString();
    }

    drawInfo(text: string): void {
        if (this.info) this.info.innerHTML = text;
    }

    drawSprite(brick: Brick | Paddle | Ball): void {
        if (!brick) return;

        this.context?.drawImage(
            brick.image, 
            brick.pos.x, 
            brick.pos.y, 
            brick.width, 
            brick.height
        );
    }

    // pass in array of bricks called bricks
    drawBricks(bricks: Brick[]): void {
        bricks.forEach(brick => this.drawSprite(brick));
    }
}