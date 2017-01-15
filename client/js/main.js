Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

var socket = io('http://localhost:8080');

$(function() {

	ConsoleLogHTML.connect($("#console"));

	socket.on('connect', function () {

		new Game(
			$("canvas")[0].getContext("2d")
		).start()

	})

})
