document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const miniGrid = document.querySelector(".mini-grid");
  const ScoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const xPixel = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "magenta",
  ];

  var i;

  // Add 200 divs to element with class grid
  for (i = 0; i < 200; i++) {
    let pixel = document.createElement("div");
    grid.appendChild(pixel);
  }

  // Add taken class to last row
  for (i = 0; i < 10; i++) {
    let lastRow = document.createElement("div");
    lastRow.classList.add("taken");
    grid.appendChild(lastRow);
  }

  // Add 16 div to element with mini-grid class
  for (i = 0; i < 16; i++) {
    let miniPixel = document.createElement("div");
    miniGrid.appendChild(miniPixel);
  }

  let pixels = Array.from(document.querySelectorAll(".grid div"));

  // The Teterominoes
  const iTetromino = [
    [xPixel, xPixel + 1, xPixel + 2, xPixel + 3],
    [1, xPixel + 1, xPixel * 2 + 1, xPixel * 3 + 1],
    [xPixel * 2, xPixel * 2 + 1, xPixel * 2 + 2, xPixel * 2 + 3],
    [2, xPixel + 2, xPixel * 2 + 2, xPixel * 3 + 2],
  ];

  const jTetromino = [
    [1, xPixel + 1, xPixel * 2, xPixel * 2 + 1],
    [0, xPixel, xPixel + 1, xPixel + 2],
    [1, 2, xPixel + 1, xPixel * 2 + 1],
    [xPixel, xPixel + 1, xPixel + 2, xPixel * 2 + 2],
  ];

  const lTetromino = [
    [1, xPixel + 1, xPixel * 2 + 1, xPixel * 2 + 2],
    [xPixel, xPixel + 1, xPixel + 2, xPixel * 2],
    [0, 1, xPixel + 1, xPixel * 2 + 1],
    [2, xPixel, xPixel + 1, xPixel + 2],
  ];

  const oTetromino = [
    [0, 1, xPixel, xPixel + 1],
    [0, 1, xPixel, xPixel + 1],
    [0, 1, xPixel, xPixel + 1],
    [0, 1, xPixel, xPixel + 1],
  ];

  const sTetromino = [
    [0, xPixel, xPixel + 1, xPixel * 2 + 1],
    [1, 2, xPixel, xPixel + 1],
    [1, xPixel + 1, xPixel + 2, xPixel * 2 + 2],
    [xPixel + 1, xPixel + 2, xPixel * 2, xPixel * 2 + 1],
  ];

  const tTetromino = [
    [1, xPixel, xPixel + 1, xPixel + 2],
    [1, xPixel + 1, xPixel + 2, xPixel * 2 + 1],
    [xPixel, xPixel + 1, xPixel + 2, xPixel * 2 + 1],
    [1, xPixel, xPixel + 1, xPixel * 2 + 1],
  ];

  const zTetromino = [
    [2, xPixel + 1, xPixel + 2, xPixel * 2 + 1],
    [xPixel, xPixel + 1, xPixel * 2 + 1, xPixel * 2 + 2],
    [1, xPixel, xPixel + 1, xPixel * 2],
    [0, 1, xPixel + 1, xPixel + 2],
  ];

  const theTetrominoes = [
    iTetromino,
    jTetromino,
    lTetromino,
    oTetromino,
    sTetromino,
    tTetromino,
    zTetromino,
  ];

  let currentPosition = 3;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the Tetromino
  function draw() {
    current.forEach((index) => {
      pixels[currentPosition + index].classList.add("tetromino");
      pixels[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // unDraw the Tetromino
  function unDraw() {
    current.forEach((index) => {
      pixels[currentPosition + index].classList.remove("tetromino");
      pixels[currentPosition + index].style.backgroundColor = "";
    });
  }

  // Make the Tetromino move down every second
  //   timerId = setInterval(moveDown, 1000);

  // Assign functions to keyCodes
  function controls(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", controls);

  // Move down function
  function moveDown() {
    unDraw();
    currentPosition += xPixel;
    draw();
    freeze();
  }

  // Freeze function
  function freeze() {
    if (
      current.some((index) =>
        pixels[currentPosition + index + xPixel].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        pixels[currentPosition + index].classList.add("taken")
      );
      // Start a new Tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 3;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // Move the Tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % xPixel === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        pixels[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  // Move the Tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    unDraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % xPixel === xPixel - 1
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        pixels[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  // Rotate the Tetromino
  function rotate() {
    unDraw();
    currentRotation++;

    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Show up-next Tetromino in mini-grid display
  const displayPixels = Array.from(document.querySelectorAll(".mini-grid div"));
  const displayWidth = 4;
  const displayIndex = 0;

  // The Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    [1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth + 1, displayWidth + 2],
  ];

  function displayShape() {
    displayPixels.forEach((miniPixel) => {
      miniPixel.classList.remove("tetromino");
      miniPixel.style.backgroundColor = "";
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
      displayPixels[displayIndex + index].classList.add("tetromino");
      displayPixels[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // Add funtionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += xPixel) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => pixels[index].classList.contains("taken"))) {
        score += 10;
        ScoreDisplay.innerHTML = score;
        row.forEach((index) => {
          pixels[index].classList.remove("taken");
          pixels[index].classList.remove("tetromino");
          pixels[index].style.backgroundColor = "";
        });
        const pixelsRemoved = pixels.splice(i, xPixel);
        pixels = pixelsRemoved.concat(pixels);
        pixels.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        pixels[currentPosition + index].classList.contains("taken")
      )
    ) {
      ScoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
