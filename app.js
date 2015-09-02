/*global angular, console*/
(function () {
  "use strict";
  
  var app = angular.module('app', ["gameLogic", "ngAnimate"]);
  
  app.controller("GameCtrl", ["$scope", "$timeout", "game",
    function ($scope, $timeout, game) {
      var winningRoute = [];

      function checkForWinner() {
        if (game.gameOver().winner !== false) {
          $scope.winner = game.gameOver().winner;
          winningRoute = game.gameOver().winningRoute;
          $scope.playAgain = true;
        }
      }
      
      $scope.wins = function (x, y) {
        return winningRoute.indexOf([x, y].join('')) > -1;
      };
      
      function humanTurn() {
        checkForWinner();
        if (!$scope.winner) {
          $scope.humansTurn = true;
        }
      }
      
      function computerTurn() {
        checkForWinner();
        if (!$scope.winner) {
          $timeout(function () {game.computerMove(); }, 300).
            then(function () {humanTurn(); });
        }
      }
      
      $scope.claimForHuman = function (x, y) {
        if ($scope.humansTurn) {
          if (game.getGridVal([x, y]) === " ") {
            game.setGridVal([x, y], game.humanSymbol);
            $scope.humansTurn = false;
            computerTurn();
          }
        }
      };

      function playGame() {
        game.initialize();
        $scope.grid = game.getGrid();
        $scope.winner = false;
        winningRoute = [];
        if ($scope.humansTurn === false) {
          computerTurn();
        }
      }
      
      $scope.chooseYourSymbol = function () {
        $scope.playAgain = false;
        $scope.chooseSymbol = true;
      };
      
      $scope.chooseX = function () {
        game.humanSymbol = "X";
        game.computerSymbol = "O";
        $scope.humansTurn = true;
        $scope.chooseSymbol = false;
        playGame();
      };
      
      $scope.chooseO = function () {
        game.humanSymbol = "O";
        game.computerSymbol = "X";
        $scope.humansTurn = false;
        $scope.chooseSymbol = false;
        playGame();
      };
      
      $scope.chooseYourSymbol();
    }]);
  
}());