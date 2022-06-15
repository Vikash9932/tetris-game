document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div')); //Array.from - to move all square from  NodeList to Array
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  let nextRandom = 0;
  let timerId;
  let score = 0;

  const colors = ['orange', 'red', 'purple', 'green', 'brown'];

  //Nav buttons
  const leftBtn = document.querySelector('#left-button');
  const rightBtn = document.querySelector('#right-button');
  const downBtn = document.querySelector('#down-button');
  const rotateBtn = document.querySelector('#rotate-button');

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [width * 2, width * 2 + 1, width + 1, 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zTetromino = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //select a tetromino randomly and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //Draw the Tetromino
  function draw() {
    // console.log('Draw');
    current.forEach((i) => {
      squares[currentPosition + i].classList.add('tetromino');
      squares[currentPosition + i].style.backgroundColor = colors[random];
    });
  }

  //Undraw the Tetromino
  function unDraw() {
    // console.log('UnDraw');
    current.forEach((i) => {
      squares[currentPosition + i].classList.remove('tetromino');
      squares[currentPosition + i].style.backgroundColor = '';
    });
  }

  //assign functions to keyCodes
  function control(e) {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38:
        rotate();
        break;
      case 39:
        moveRight();
        break;
      case 40:
        moveDown();
        break;
      default:
        break;
    }
  }
  document.addEventListener('keyup', control);

  //Functionalities on button press
  leftBtn.addEventListener('click', moveLeft);
  rightBtn.addEventListener('click', moveRight);
  downBtn.addEventListener('click', moveDown);
  rotateBtn.addEventListener('click', rotate);

  //Move Down tetromino
  function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((i) =>
        squares[currentPosition + i + width].classList.contains('taken')
      )
    ) {
      current.forEach((i) =>
        squares[currentPosition + i].classList.add('taken')
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is blockage
  function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
      (i) => (currentPosition + i) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;
    console.log('CurrentPosition');
    if (
      current.some((i) =>
        squares[currentPosition + i].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }
    draw();
    console.log('move left');
  }

  //move the tetromino right, unless it is at the right edge or there is blockage
  function moveRight() {
    unDraw();
    const isAtRightEdge = current.some(
      (i) => (currentPosition + i) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((i) =>
        squares[currentPosition + i].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if current rotation gets to 4
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  //show up next tetromino in main -grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  //the Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /// lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach((i) => {
      displaySquares[displayIndex + i].classList.add('tetromino');
      displaySquares[displayIndex + i].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
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

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
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

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      // scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
      document.removeEventListener('keyup', control);
      leftBtn.removeEventListener('click', moveLeft);
      rightBtn.removeEventListener('click', moveRight);
      downBtn.removeEventListener('click', moveDown);
      rotateBtn.removeEventListener('click', rotate);
    }
  }
});
