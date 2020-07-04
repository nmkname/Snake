import { Container } from "typedi";

import { FIELD_SIZE, CELL_SIZE, SNAKE_INITIAL_PARAMS } from "const";
import { Field } from "Field";
import { Snake } from "entities/Snake";

class Main {
  field: Field;
  snake: Snake;

  constructor() {
    const canvas = document.getElementById("snake") as HTMLCanvasElement;
    canvas.width = FIELD_SIZE;
    canvas.height = canvas.width;

    // it has to be defined before snake, because uses field container
    this.field = new Field({ canvas, FIELD_SIZE, CELL_SIZE });
    Container.set("Field", this.field);
    this.snake = new Snake({
      start: { x: SNAKE_INITIAL_PARAMS.x, y: SNAKE_INITIAL_PARAMS.y },
      snakeLength: SNAKE_INITIAL_PARAMS.length,
    });
    this.draw();
  }

  draw() {
    const intervalId = setInterval(() => {
      this.field.draw();
      this.snake.draw();
    }, SNAKE_INITIAL_PARAMS.velocity);
  }
}

new Main();
