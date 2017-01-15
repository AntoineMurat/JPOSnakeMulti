Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

hljs.initHighlightingOnLoad()

/**
 * Lorsque la DOM sera chargée :
 */

$(function() {

	$(".btnContinue").click(function() {
		$('ul.tabs').tabs('select_tab', $(this).data('dest'));
	});

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
	console.info("En attente de connexion au serveur...")
	socket.once('connect', function () {
		console.info("Connexion établie.")
		/**
		 * On instancie une nouvelle partie.
		 */
		var game = new GameJPOACompleter(
			$("canvas")[0].getContext("2d")
		)

		/**
		 * On démarre la partie.
		 */
		game.start()

	})

})

/**
 * On établit la connexion avec le serveur.
 */
var socket = io('http://localhost:8080');