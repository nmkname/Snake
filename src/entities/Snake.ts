import { Field } from "Field";
import Container from "typedi";

type TParams = {
  start?: {
    x: number;
    y: number;
  };
};

enum DIRECTION {
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
}

export class Snake {
  field: Field;
  X: number;
  Y: number;
  direction: DIRECTION;

  constructor({ start }: TParams = { start: { x: 0, y: 0 } }) {
    this.field = Container.get("Field");
    this.X = start.x;
    this.Y = start.y;
    this.direction = DIRECTION.RIGHT;
    this.createSnake(start);
    this.initControls();
  }

  private createSnake({ x, y }: { x: number; y: number }): void {
    const { ctx, CELL_SIZE } = this.field;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  }

  private initControls() {
    document.addEventListener("keydown", this.changeDirection);
  }

  private disposeControls() {
    document.removeEventListener("keydown", this.changeDirection);
  }

  private changeDirection = (event: KeyboardEvent) => {
    switch (true) {
      case event.keyCode === 37 && this.direction !== DIRECTION.RIGHT:
        this.direction = DIRECTION.LEFT;
        break;

      case event.keyCode === 38 && this.direction !== DIRECTION.BOTTOM:
        this.direction = DIRECTION.TOP;
        break;

      case event.keyCode === 39 && this.direction !== DIRECTION.LEFT:
        this.direction = DIRECTION.RIGHT;
        break;

      case event.keyCode === 40 && this.direction !== DIRECTION.TOP:
        this.direction = DIRECTION.BOTTOM;
        break;

      default:
        break;
    }
  };

  private makeStep() {
    const { CELL_SIZE, FIELD_SIZE } = this.field;

    switch (this.direction) {
      case DIRECTION.LEFT:
        this.X = (this.X - CELL_SIZE + FIELD_SIZE) % FIELD_SIZE;
        break;

      case DIRECTION.TOP:
        this.Y = (this.Y - CELL_SIZE + FIELD_SIZE) % FIELD_SIZE;
        break;

      case DIRECTION.RIGHT:
        this.X = (this.X + CELL_SIZE) % FIELD_SIZE;
        break;
      case DIRECTION.BOTTOM:
        this.Y = (this.Y + CELL_SIZE) % FIELD_SIZE;
        break;

      default:
        break;
    }
  }

  public draw() {
    const { ctx, CELL_SIZE } = this.field;
    this.makeStep();
    ctx.fillRect(this.X, this.Y, CELL_SIZE, CELL_SIZE);
  }
}
