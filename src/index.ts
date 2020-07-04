import { Container } from "typedi";

import { FIELD_SIZE, CELL_SIZE, SNAKE_VELOCITY } from "const";
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
    this.snake = new Snake();
    this.draw();
  }

  draw() {
    const intervalId = setInterval(() => {
      this.field.draw();
      this.snake.draw();
    }, SNAKE_VELOCITY);
  }
}

new Main();
