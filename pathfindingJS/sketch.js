let cols = 25;
let rows = 25;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start, end;

let w, h;
let path = [];
let current;
let noSolution = false;

const removeFromArray = (array, element) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === element) {
      array.splice(i, 1);
    }
  }
};

const heuristic = (node, end) => dist(node.x, node.y, end.x, end.y);

class Spot {
  constructor(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.wall = false;
    if (random(1) < 0.3) {
      this.wall = true;
    }
    this.show = function(col) {
      fill(col);
      if (this.wall) {
        fill(0);
      }
      ellipse(this.x * w + w / 2, this.y * h + h / 2, w / 2, h / 2);
    };
    this.addNeighbours = function(grid) {
      if (this.x < cols - 1) {
        this.neighbours.push(grid[this.x + 1][this.y]);
      }

      if (this.x > 0) {
        this.neighbours.push(grid[this.x - 1][this.y]);
      }

      if (this.y < rows - 1) {
        this.neighbours.push(grid[this.x][this.y + 1]);
      }
      if (this.y > 0) {
        this.neighbours.push(grid[this.x][this.y - 1]);
      }
      if (this.y > 0 && this.x > 0) {
        this.neighbours.push(grid[this.x - 1][this.y - 1]);
      }
      if (this.y < cols - 1 && this.x > 0) {
        this.neighbours.push(grid[this.x - 1][this.y + 1]);
      }
      if (this.y > 0 && this.x > rows - 1) {
        this.neighbours.push(grid[this.x + 1][this.y - 1]);
      }
      if (this.y < cols - 1 && this.x < cols - 1) {
        this.neighbours.push(grid[this.x + 1][this.y + 1]);
      }
    };
  }
}

function setup() {
  createCanvas(400, 400);
  console.log("A*");

  w = width / cols;
  h = height / rows;
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];
  start.wall = false;

  end = grid[cols - 1][rows - 1];
  end.wall = false;
  openSet.push(start);
  console.log(grid);
}

function draw() {
  if (openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    current = openSet[winner];
    if (current === end) {
      noLoop();
      console.log("DONE");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);
    let neighbours = current.neighbours;
    for (let i = 0; i < neighbours.length; i++) {
      if (!closedSet.includes(neighbours[i]) && !neighbours[i].wall) {
        let tempg = current.g + 1;

        let newPath = false;
        if (openSet.includes(neighbours[i])) {
          if (tempg < neighbours[i].g) {
            neighbours[i].g = tempg;
            newPath = true;
          }
        } else {
          neighbours[i].g = tempg;
          newPath = true;
          openSet.push(neighbours[i]);
        }
        if (newPath) {
          neighbours[i].h = heuristic(neighbours[i], end);
          neighbours[i].f = neighbours[i].g + neighbours[i].h;
          neighbours[i].previous = current;
        }
      }
    }
  } else {
    //no solution
    noSolution = true;
    noLoop();
    console.log("No solution");
  }
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  // for (let i = 0; i < closedSet.length; i++) {
  //   closedSet[i].show(color(255, 0, 0));
  // }

  // for (let i = 0; i < openSet.length; i++) {
  //   openSet[i].show(color(0, 255, 0));
  // }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  noFill();
  beginShape();
  stroke(0);
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].x * w + w / 2, path[i].y * h + h / 2);
  }
  endShape();
}
