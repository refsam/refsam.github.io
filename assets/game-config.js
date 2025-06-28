class Box {
  constructor(a, b) {
        this.a = a;
        this.b = b;
                     }

  getTopBox() {
        if (this.b === 0) return null;
        return new Box(this.a, this.b - 1);
                }

  getRightBox() {
        if (this.a === 2) return null;
        return new Box(this.a + 1, this.b);
                }

  getBottomBox() {
        if (this.b === 2) return null;
        return new Box(this.a, this.b + 1);
                  }

  getLeftBox() {
        if (this.a === 0) return null;
        return new Box(this.a - 1, this.b);
                }

  getNextdoorBoxes() {
        return [
        this.getTopBox(),
        this.getRightBox(),
        this.getBottomBox(),
        this.getLeftBox()
    ].filter(box => box !== null);
                      }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
        return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
                      }
}

const swapBoxes = (grid, box1, box2) => {
  const temp = grid[box1.b][box1.a];
  grid[box1.b][box1.a] = grid[box2.b][box2.a];
  grid[box2.b][box2.a] = temp;
                                        };

const isSolved = grid => {
    return (    grid[0][0] === 1 &&
                grid[0][1] === 2 &&
                grid[0][2] === 3 &&
                grid[1][0] === 4 &&
                grid[1][1] === 5 &&
                grid[1][2] === 6 &&
                grid[2][0] === 7 &&
                grid[2][1] === 8 &&
                grid[2][2] === 0
        );
};

const getRandomGrid = () => {
  let grid = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

  let blankBox = new Box(2, 2);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
        swapBoxes(grid, blankBox, randomNextdoorBox);
        blankBox = randomNextdoorBox;
                                }

  if (isSolved(grid)) return getRandomGrid();
  return grid;
};

class State {
  constructor(grid, move, waktu, status) {
    this.grid = grid;
    this.move = move;
    this.waktu = waktu;
    this.status = status;
  }

  static ready() {
    return new State(
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      0,
      0,
      "ready"
    );
  }

  static start() {
    return new State(getRandomGrid(), 0, 0, "bermain");
  }
}

class Game {
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
  }

  static ready() {
    return new Game(State.ready());
  }

  tick() {
    this.setState({ waktu: this.state.waktu + 1 });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleClickBox(box) {
    return function() {
      const nextdoorBoxes = box.getNextdoorBoxes();
      const blankBox = nextdoorBoxes.find(
        nextdoorBox => this.state.grid[nextdoorBox.b][nextdoorBox.a] === 0
      );
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox);
        if (isSolved(newGrid)) {
          clearInterval(this.tickId);
          this.setState({
            status: "menang!",
            grid: newGrid,
            move: this.state.move + 1
          });
        } else {
          this.setState({
            grid: newGrid,
            move: this.state.move + 1
          });
        }
      }
    }.bind(this);
  }

  render() {
    const { grid, move, waktu, status } = this.state;

    const newGrid = document.createElement("div");
    newGrid.className = "grid";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const button = document.createElement("button");

        if (status === "bermain") {
          button.addEventListener("click", this.handleClickBox(new Box(j, i)));
        }

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        newGrid.appendChild(button);
      }
    }
    document.querySelector(".grid").replaceWith(newGrid);


    const newButton = document.createElement("button");
    if (status === "ready") newButton.textContent = "Main Yuk";
    if (status === "bermain") newButton.textContent = "Reset?";
    if (status === "menang!") newButton.textContent = "Main Yuk";
    newButton.addEventListener("click", () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      this.setState(State.start());
    });
        document.querySelector(".footer button").replaceWith(newButton);

        document.getElementById("move").textContent = `Move: ${move}`;

        document.getElementById("waktu").textContent = `Waktu: ${waktu}`;

        if (status === "menang!") {
          const messageElement = document.querySelector(".message");
          messageElement.textContent = "";
        
          // Membuat tombol "Mantap Jiwa"
          const mantapJiwaButton = document.createElement("button");
          mantapJiwaButton.textContent = "Mantap Jiwa";
          mantapJiwaButton.addEventListener("click", function() {
            // Mengarahkan pengguna ke link drive.google.com saat tombol "Mantap Jiwa" diklik
            window.location.href = "https://www.figma.com/proto/0bxhb0LFeMBFAacOHjrZ7z/FOR-YOU?node-id=14-249&scaling=min-zoom&page-id=6%3A2&starting-point-node-id=14%3A249&hotspot-hints=0&hide-ui=1";
          });
        
          // Menambahkan tombol "Mantap Jiwa" ke dalam elemen "message"
          messageElement.appendChild(mantapJiwaButton);
        } else {
          document.querySelector(".message").textContent = "";
        }
        
  }
}

const GAME = Game.ready();
