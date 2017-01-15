Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

/**
 * Lorsque la DOM sera chargée :
 */

$(function() {

	/**
	 * Materialize
	 *
	 * On active le menu.
	 */

	$(".button-collapse").sideNav();

	/**
	 * On pipe la sortie de la console dans l'HTML.
	 */
	ConsoleLogHTML.connect($("#console"));

	/**
	 * Lorsqu'on aura récupéré notre ID, on lancera la partie.
	 *
	 * C'est pourquoi on attend d'être connecté.
	 */
	socket.on('connect', function () {

		/**
		 * On instane une nouvelle partie.
		 */
		var game = new Game(
			$("canvas")[0].getContext("2d")
		)

		/**
		 * On la démarre.
		 */
		game.start()

		/**
		 * Alias.
		 *
		 * On définit un ensemble d'alias pour aider le dev' débutant.
		 */

	})

})

/**
 * On établit la connexion avec le serveur.
 */
var socket = io('http://localhost');