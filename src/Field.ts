type TParams = {
  canvas: HTMLCanvasElement;
  FIELD_SIZE: number;
  CELL_SIZE: number;
};

export class Field {
  private canvasElement: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D | null;
  public FIELD_SIZE: number;
  public CELL_SIZE: number;
  public CELLS_IN_ROW: number;
  public CELLS_IN_COLUMN: number;

  constructor({ canvas, FIELD_SIZE, CELL_SIZE }: TParams) {
    this.canvasElement = canvas;
    this.ctx = this.canvasElement.getContext("2d");
    this.FIELD_SIZE = FIELD_SIZE;
    this.CELL_SIZE = CELL_SIZE;
    this.CELLS_IN_ROW = this.getCellsInRow(FIELD_SIZE, CELL_SIZE);
    this.CELLS_IN_COLUMN = this.CELLS_IN_ROW;
  }

  getCellsInRow(fieldSize: number, cellSize: number): number {
    return fieldSize / cellSize;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.FIELD_SIZE, this.FIELD_SIZE);
  }
}
