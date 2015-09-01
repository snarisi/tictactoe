(function () {
  "use strict";
  
  var app = angular.module('app', []);
  
  app.controller("GameCtrl", ["$scope", "$timeout",
    function ($scope, $timeout) {
      function playGame() {
        initialize();
        $scope.grid = grid;
        $scope.winner = false;
        if ($scope.humansTurn === false) {
          computerTurn();
        }

        function computerTurn() {
          checkForWinner();
          if (gameOver() === false) {
            $timeout(function () {computerMove(); }, 500).
              then(function () {humanTurn(); });
          }
        }

        $scope.claimForHuman = function (x, y) {
          if ($scope.humansTurn) {
            if (grid[x][y] === " ") {
              grid[x][y] = humanSymbol;
              $scope.humansTurn = false;
              computerTurn();
            }
          }
        };

        function humanTurn() {
          checkForWinner();
          $scope.humansTurn = true;
        }

        function checkForWinner() {
          if (gameOver() !== false) {
            $scope.winner = gameOver();
            $scope.playAgain = true;
          }
        }
      }
      
      $scope.chooseYourSymbol = function () {
        $scope.playAgain = false;
        $scope.chooseSymbol = true;
      };
      
      $scope.chooseX = function () {
        humanSymbol = "X";
        computerSymbol = "O";
        $scope.humansTurn = true;
        $scope.chooseSymbol = false;
        playGame();
      };
      
      $scope.chooseO = function () {
        humanSymbol = "O";
        computerSymbol = "X";
        $scope.humansTurn = false;
        $scope.chooseSymbol = false;
        playGame();
      };
      
      $scope.chooseYourSymbol();
      
    }]);
  
}());