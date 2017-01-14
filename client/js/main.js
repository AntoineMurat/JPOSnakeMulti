Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

var socket = io('http://localhost');

var exposed = {};

socket.on('connect', function () {

	$(function() {

	    var game = new Game(
	    	ctx = $("canvas")[0].getContext("2d")
	    )

	    game.start()

	    window.exposed.game = game

	})

})