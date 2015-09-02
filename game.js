/*global angular*/
(function () {
  "use strict";
  
  var gameLogic = angular.module("gameLogic", []);
  
  gameLogic.factory("game", function () {
    var game = {
      "humanSymbol" : "",
      "coputerSymbol": ""
    },
      gridSize = 3,
      gameRoutes = [],
      allSquares = [],
      grid;
    
    game.humanSymbol = "";
    
    function drawGrid(size) {
      var output = [],
        row = [],
        i,
        j;
      
      for (i = 0; i < size; i += 1) {
        row = [];
        for (j = 0; j < size; j += 1) {
          row.push(" ");
        }
        output.push(row);
      }
      return output;
    }
    
    //returns the current value of a square
    function getSquareVal(square) {
      var x = square[0],
        y = square[1];

      return grid[x][y];
    }

    //take a square and map all possible routes
    function findRoutes(square) {
      var allRoutes,
        across,
        down,
        diag1,
        diag2;

      function mapRoute(coords, plusX, plusY) {
        var checkedSquares = [],
          xcoord = coords[0],
          ycoord = coords[1];

        function routeHelper(x, y) {
          if (!Array.isArray(grid[x]) || typeof grid[x][y] === "undefined" ||
              checkedSquares.indexOf([x, y].join('')) > -1) {
            return [];
          } else {
            checkedSquares.push([x, y].join(''));
            return [[x, y]].concat(routeHelper(x + plusX, y + plusY)).
                concat(routeHelper(x - plusX, y - plusY));
          }
        }
        return routeHelper(xcoord, ycoord);
      }

      across = mapRoute(square, 0, 1);
      down = mapRoute(square, 1, 0);
      diag1 = mapRoute(square, 1, 1);
      diag2 = mapRoute(square, 1, -1);

      allRoutes = [across, down, diag1, diag2].filter(function (route) {
        return route.length === gridSize;
      });
      return allRoutes;
    }

    game.initialize = function () {
      var checkedRoutes = [],
        x,
        y;
      
      grid = drawGrid(gridSize);

      //map all squares and possible routes
      for (x = 0; x < grid.length; x += 1) {
        for (y = 0; y < grid[x].length; y += 1) {
          allSquares.push([x, y]);
        }
      }

      allSquares.forEach(function (square) {
        var routes = findRoutes(square);
        routes.forEach(function (route) {
          if (checkedRoutes.indexOf(route.sort().join('')) < 0) {
            checkedRoutes.push(route.sort().join(''));
            gameRoutes.push(route);
          }
        });
      });
    };
    
    //check and see if either side won
    game.gameOver = function () {
      var x,
        y,
        answer = false,
        winningRoute = [];

      gameRoutes.forEach(function (route) {
        var values = [];
        route.forEach(function (square) {
          values.push(getSquareVal(square));
        });
        if (values.filter(function (value) {return value === game.humanSymbol; }).length === gridSize) {
          answer = "Human wins!";
          route.forEach(function (square) {
            winningRoute.push(square.join(''));
          });
        } else if (values.filter(function (value) {return value === game.computerSymbol; }).length === gridSize) {
          answer = "Computer wins!";
          route.forEach(function (square) {
            winningRoute.push(square.join(''));
          });
        } else if (allSquares.filter(function (square) {return getSquareVal(square) !== " "; })
                   .length === allSquares.length) {
          answer = "It's a draw.";
        }
      });

      return {
        "winner": answer,
        "winningRoute": winningRoute
      };
    };

    game.computerMove = function () {
      var emptySquares = [],
        highScore = 0,
        bestSquare,
        x,
        y;

      //score a square based on how likely claiming it will help the computer win or avoid losing
      function scoreRoutes(routes) {
        var score = 0;

        //score the individual route
        function scoreRoute(route) {
          var humanSquares,
            computerSquares,
            emptySquares;

          //calculate number of human squares, computer squares, and empty squares in the route
          humanSquares = route.filter(function (square) {return getSquareVal(square) === game.humanSymbol; }).length;
          computerSquares = route.filter(function (square) {return getSquareVal(square) === game.computerSymbol; })
            .length;
          emptySquares = route.filter(function (square) {return getSquareVal(square) === " "; }).length;

          if (computerSquares === gridSize - 1) {
            //the computer can win this turn - will always be the highest score
            return gridSize * gridSize * gridSize + 1;
          } else if (humanSquares === gridSize - 1) {
            //the human can win on the next turn - will always be the highest score if there's no way to win
            return gridSize * gridSize * gridSize;
          } else if (humanSquares > 0 && computerSquares > 0) {
            //route is mixed, has no value
            return 0;
          } else if (emptySquares === gridSize) {
            //route has value
            return 1;
          } else if (humanSquares > 0) {
            //blocking route human has started has value
            return humanSquares;
          } else if (computerSquares > 0) {
            //continuing route computer has started has value
            return computerSquares;
          }
        }

        routes.forEach(function (route) {
          score += scoreRoute(route);
        });
        return score;
      }

      //claims the square for the computer
      function claimForComputer(square) {
        var x = square[0],
          y = square[1];

        grid[x][y] = game.computerSymbol;
      }

      //find all the empty squares
      for (x = 0; x < grid.length; x += 1) {
        for (y = 0; y < grid[x].length; y += 1) {
          if (grid[x][y] === " ") {
            emptySquares.push([x, y]);
          }
        }
      }

      //score each empty square
      emptySquares.forEach(function (square) {
        var routes = findRoutes(square),
          score = scoreRoutes(routes);

        if (score >= highScore) {
          highScore = score;
          bestSquare = square;
        }
      });

      //claim the square with the highest score
      claimForComputer(bestSquare);
    };

    game.setGridVal = function (square, symbol) {
      var x = square[0],
        y = square[1];
      
      if (grid[x][y] === " ") {
        grid[x][y] = symbol;
      }
    };
    
    game.getGridVal = function (square) {
      var x = square[0],
        y = square[1];
    
      return grid[x][y];
    };
    
    game.getGrid = function () {
      return grid;
    };
    
    return game;
  });
}());