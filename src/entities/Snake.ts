import { Field } from "Field";
import Container from "typedi";
import { FIELD_SIZE } from "const";

type TParams = {
  start?: {
    x: number;
    y: number;
  };
  snakeLength: number;
};

enum DIRECTION {
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
}

const DIRECTION_VECTORS: { [key in DIRECTION]: { vX: number; vY: number } } = {
  [DIRECTION.LEFT]: {
    vX: -1,
    vY: 0,
  },
  [DIRECTION.RIGHT]: {
    vX: 1,
    vY: 0,
  },
  [DIRECTION.TOP]: {
    vX: 0,
    vY: -1,
  },
  [DIRECTION.BOTTOM]: {
    vX: 0,
    vY: 1,
  },
};

export class Snake {
  field: Field;
  X: number;
  Y: number;
  direction = DIRECTION.RIGHT;
  snakeLength: number;
  folds: Array<{
    vX: number;
    vY: number;
    bodyIndex: number;
    xPos: number;
    yPos: number;
  }> = [];

  constructor({ start = { x: 0, y: 0 }, snakeLength }: TParams) {
    this.field = Container.get("Field");
    this.X = start.x;
    this.Y = start.y;
    this.snakeLength = snakeLength;
    this.drawSnake();
    this.initControls();
  }

  private initControls(): void {
    document.addEventListener("keydown", this.changeDirection);
  }

  // private disposeControls() {
  //   document.removeEventListener("keydown", this.changeDirection);
  // }

  private changeDirection = (event: KeyboardEvent): void => {
    switch (true) {
      case event.keyCode === 37 && this.direction !== DIRECTION.RIGHT:
        this.setDirection(DIRECTION.LEFT);
        break;

      case event.keyCode === 38 && this.direction !== DIRECTION.BOTTOM:
        this.setDirection(DIRECTION.TOP);
        break;

      case event.keyCode === 39 && this.direction !== DIRECTION.LEFT:
        this.setDirection(DIRECTION.RIGHT);
        break;

      case event.keyCode === 40 && this.direction !== DIRECTION.TOP:
        this.setDirection(DIRECTION.BOTTOM);
        break;

      default:
        break;
    }
  };

  private setDirection(direction: DIRECTION): void {
    if (direction !== this.direction) {
      this.pushFold();
    }

    this.direction = direction;
  }

  private makeStep(): void {
    const { CELL_SIZE, FIELD_SIZE } = this.field;
    const { vX, vY } = DIRECTION_VECTORS[this.direction];

    this.X = (this.X + vX * CELL_SIZE + FIELD_SIZE) % FIELD_SIZE;
    this.Y = (this.Y + vY * CELL_SIZE + FIELD_SIZE) % FIELD_SIZE;
  }

  private pushFold(): void {
    const bodyIndex = 0;
    const { vX, vY } = DIRECTION_VECTORS[this.direction];

    this.folds.push({ vX, vY, bodyIndex, xPos: this.X, yPos: this.Y });
  }

  private changeFolds(): void {
    this.folds.filter((fold) => {
      fold.bodyIndex++;

      if (fold.bodyIndex === this.snakeLength) {
        return false;
      }

      return true;
    });
  }

  private drawSnake(): void {
    const { ctx, CELL_SIZE } = this.field;

    for (let i = 0; i < this.snakeLength; i++) {
      const {
        vX,
        vY,
        xPos,
        yPos,
        relevantIndex,
      } = this.getBodyPartVectorVelocity(i);

      ctx.fillRect(
        (xPos - CELL_SIZE * relevantIndex * vX + FIELD_SIZE) % FIELD_SIZE,
        (yPos - CELL_SIZE * relevantIndex * vY + FIELD_SIZE) % FIELD_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  private getBodyPartVectorVelocity(
    _bodyIndex: number
  ): {
    vX: number;
    vY: number;
    xPos: number;
    yPos: number;
    relevantIndex: number;
  } {
    for (let i = 0; i < this.folds.length; i++) {
      const { bodyIndex, vX, vY, xPos, yPos } = this.folds[i];

      if (_bodyIndex >= bodyIndex) {
        return { vX, vY, xPos, yPos, relevantIndex: _bodyIndex - bodyIndex };
      }
    }

    const { vX, vY } = DIRECTION_VECTORS[this.direction];
    return { vX, vY, xPos: this.X, yPos: this.Y, relevantIndex: _bodyIndex };
  }

  public draw(): void {
    const { ctx, CELL_SIZE } = this.field;
    this.makeStep();
    this.drawSnake();
    this.changeFolds();
    ctx.fillRect(this.X, this.Y, CELL_SIZE, CELL_SIZE);
  }
}
