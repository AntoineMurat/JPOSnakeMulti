Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

hljs.initHighlightingOnLoad()

/**
 * Bouton de la page 1
 */
$("#btnContinue1").click(function() {
	$('ul.tabs').tabs('select_tab', 'part2');
});

/**
 * Boutons de la page 2
 */
$("#btnContinue2-3").click(function() {
	$('ul.tabs').tabs('select_tab', 'part3');
});
$("#btnContinue2-1").click(function() {
	$('ul.tabs').tabs('select_tab', 'part1');
});

/**
 * Boutons de la page 3
 */
$("#btnContinue3-4").click(function() {
	$('ul.tabs').tabs('select_tab', 'part4');
});
$("#btnContinue3-2").click(function() {
	$('ul.tabs').tabs('select_tab', 'part2');
});

/**
 * Bouton de la page 4
 */
$("#btnContinue4-3").click(function() {
	$('ul.tabs').tabs('select_tab', 'part3');
});

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