import { CanvasView } from './view/CanvasView';
import { Ball } from './sprites/ball';
import { Paddle } from './sprites/paddle';
import { Brick } from './sprites/brick';
import { Collision } from './Collision';
import { createBricks } from './helpers';
// Images
import PADDLE_IMAGE from './images/paddle.png';
import BALL_IMAGE from './images/ball.png';
// Level and colors
import {
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    BALL_SPEED,
    BALL_SIZE,
    BALL_STARTY,
    BALL_STARTX
} from './setup';

let gameOver = false;
let score = 0;

// called after game over detected
function setGameOver(view: CanvasView) {
    view.drawInfo('Game Over!');
    gameOver = false;
}

function setGameWin(view: CanvasView) {
    view.drawInfo('Game Won!');
    gameOver = false;
}

function gameLoop(
    view: CanvasView,
    bricks: Brick[],
    paddle: Paddle,
    ball: Ball,
    collision: Collision
) {
    view.clear();
    view.drawBricks(bricks);
    view.drawSprite(paddle);
    view.drawSprite(ball);
    // Move ball
    ball.moveBall();

    // Move paddle and check so it won't exit the playing field
    if ((paddle.isMovingLeft && paddle.pos.x > 0) || 
        (paddle.isMovingRight && paddle.pos.x < (view.canvas.width - paddle.width))){
            paddle.movePaddle();
    }

    collision.checkBallCollision(ball, paddle, view);
    const collidingBrick = collision.isCollidingBricks(ball, bricks);

    if (collidingBrick) {
        score++;
        view.drawScore(score);
    }

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision));
    
    // Game over when ball leaves playing field
    if (ball.pos.y > view.canvas.height) gameOver = true;
    // If game won (all bricks destroyed), set gameOver and display win
    if (bricks.length === 0) {
        requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision));
        return setGameWin(view);
    }
    // Return if game over and don't run requestAnimationFrame
    if (gameOver) return setGameOver(view);
}

function startGame(view: CanvasView) {
    // Reset displays
    score = 0;
    view.drawInfo('');
    view.drawScore(0);
    // Create collision instance
    const collision = new Collision();
    // Create all bricks
    console.log("run");
    const bricks = createBricks();
    // Create a ball
    const ball = new Ball(
        BALL_SPEED,
        BALL_SIZE,
        { x: BALL_STARTX, y: BALL_STARTY},
        BALL_IMAGE
    );
    // Create a paddle
    const paddle = new Paddle(
        PADDLE_SPEED, 
        PADDLE_WIDTH, 
        PADDLE_HEIGHT, 
        {
            x: PADDLE_STARTX,
            y: view.canvas.height - PADDLE_HEIGHT - 5
        }, 
        PADDLE_IMAGE
    );

    gameLoop(view, bricks, paddle, ball, collision);
}

// Create a new view
const view = new CanvasView('#playField');
view.initStartButton(startGame);
