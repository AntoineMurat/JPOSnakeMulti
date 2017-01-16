/**
 * Classe représentant une partie.
 */
class GameJPOACompleter {

	/**
	 * Démarre la partie en initialisant divers objets et enregistrant divers listeners.
	 */
	start() {
		// TODO
		// 
		// Ecouter les touches du clavier.

		this.ecouterLesTouchesClavier()

		// TODO
		// 
		// Ecouter le serveur pour les MAJ des serpents.
		
		//this.ecouterMAJServeurConcurrents()

		// TODO
		// 
		// Ecouter le serveur pour enlever les serpents.

		//this.ecouterMAJServeurSupprimerSerpent()

		// TODO
		// 
		// Ecouter le serveur pour placer les pommes.

		//this.ecouterMAJServeurNouvellePomme()

		// TODO
		// 
		// Initialiser notre serpent.
	
		this.initialiserNotreSerpent()
		this.creerPomme()
		
		console.info("Partie démarrée.")

		// Cette instruction permet d'effectuer correctement l'affichage
		// Apres avoir chargé la partie on lance la boucle infinie.
		this.demarrerBoucleDeRendu()
	}

	/**
	 * Lance la boucle de calcul et de rendu jusqu'à la mort.
	 *
	 * Méthode appelée après initialisation. 
	 */
	loop() {

		/**
		 * MAJ de la physique et de la logique du jeu.
		 */

		// TODO
		// 
		// Faire tourner notre serpent.
		
		this.faireTournerNotreSerpent()

		// TODO
		// 
		// Faire avancer notre serpent.
		
		this.faireAvancerNotreSerpent()

		// TODO
		// 
		// Vérifier si notre serpent en mord un.
		// Si c'est le cas, on affiche l'écran de fin.
		
		//if (this.notreSerpentEnMordUn()){
		//	this.afficherEcranScore()
		//}

		// TODO
		// 
		// Vérifier si notre serpent mord la pomme.
		// Si c'est le cas, il la mange.

		if (this.notreSerpentMordPomme()){
			this.mangerPomme()
		} 

		/**
		 * MAJ des graphismes.
		 */
		
		// TODO
		// 
		// Nettoyer l'écran.

		this.nettoyerEcran()

		// TODO
		// 
		// Afficher serpents.

		this.afficherSerpents()

		// TODO
		// 
		// Afficher la pomme.
		this.afficherPomme()

		// TODO
		// 
		// Afficher le score.

		this.afficherScore()

		/**
		 * Gestion du multijoueur.
		 */
		
		// TODO
		// 
		// Vérifier si on est mort.
		// Si ce n'est pas le cas, on informe le serveur de notre
		// positions, de notre nombre de blocs, etc...

		//if (!this.notreSerpentEstMort()){
		//	this.envoyerInformationsServeur() 
		//}

		// TODO
		// 
		// Vérifier si on est mort.
		// Si ce n'est pas le cas, rappeler la boucle de rendu.

		if (!this.notreSerpentEstMort()){
			this.rappelerBoucleDeRendu() 
		}

	}

	/**
	 * Constructeur permettant d'obtenir une partie à partir de son contexte. 
	 * 
	 * @param {Contexte2d} le contexte à manipuler.
	 */
	constructor(ctx) {
		console.info("Partie initialisée.")
		this.ctx = ctx;
		// On initialise la liste des serpents connus.
		this.snakes = [];
		// La pomme est initialement nule, elle sera envoyée par le serveur.
		this.apple = null;
		// fix pour les 180.
		this.directionArrow = null
		
		/**
		 * Alias.
		 *
		 * On définit un ensemble d'alias pour aider le dev' débutant.
		 */
		
		this.initialiserNotreSerpent = this.initSnake
		this.demarrerBoucleDeRendu = this.loop
		this.nettoyerEcran = this.clearScreen
		this.creerPomme = this.putNewRandomApple
	}

	/**
	 * Nettoie l'écran.
	 */
	clearScreen() {
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	/**
	 * Ajoute une pomme à partir de ses coordonnées.
	 * 
	 * @param  {Coordinates} les coordonnées de la pomme.
	 */
	putNewApple(coordinates) {
		console.info("Pomme ajoutée.")
		this.apple = new Apple(coordinates)
	}

	/**
	 * Ajoute une pomme de façon aléatoire.
	 */
	putNewRandomApple() {
		console.info("Pomme aléatoire ajoutée.")
		this.apple = new Apple(
			new Coordinates(
				parseInt(Math.random() * 40),
				parseInt(Math.random() * 40)
			)
		)
	}

	/**
	 * Initialise le serpent du joueur.
	 */
	initSnake() {
		console.info("Serpent initialisé.")
		// Le serpent est placé et se dirige aléatoirement.
		this.mySnake = new Snake(
			new Coordinates(
				parseInt(Math.random() * 40),
				parseInt(Math.random() * 40)
			),
			37 + parseInt(Math.random() * 4),
			socket.io.engine.id
		)
		this.dead = false
		this.score = 0
		// On ajoute ce serpent à la liste des serpents.
		this.snakes["I"] = this.mySnake
	}

	/**
	 * Tue le serpent du joueur.
	 *
	 * On en informe le serveur et on lance l'affichage de l'écran de mort.
	 *
	 *  @param  {String} id du socket du client de ce serpent.
	 */
	die(id) {
		console.info("Serpent mort.")
		this.dead = true
		socket.emit("died", {
			killerId: id
		})
		this.deathScreen(-1)
	}

	/**
	 * Affiche l'écran de mort.
	 *
	 * La fonction est récursive et s'appelle elle-même après un bref délai.
	 *
	 * Elle finit par relancer le jeu.
	 */
	deathScreen(counter) {
		var that = this

		// On affiche 400 blocs séparés de 2.5ms.
		if (counter < 400) {
			this.ctx.fillStyle = "#000000"
			this.ctx.fillRect(
				(this.ctx.canvas.width / 20) * (counter % 20),
				(this.ctx.canvas.height / 20) * parseInt(counter / 20),
				this.ctx.canvas.width / 20,
				this.ctx.canvas.height / 20
			)
			setTimeout(function() {
				that.deathScreen(counter + 1)
			}, 2.5)

		// Ensuite, on affiche le message de mort avec le score.
		} else {
			this.ctx.font = "30px Arial";
			this.ctx.fillStyle = "#FFFFFF"

			var toPrint = "Perdu ! Score : " + that.score

			// On affiche le message caractère par caractère.
			for (var index in toPrint) {
				setTimeout(function(index) {
					that.ctx.fillText(toPrint.substring(0, index), 270, 300);
				}, index * 75, index + 1)
			}

			// On réinitialise le joueur.
			setTimeout(function() {
				that.initSnake()
				that.loop()
			}, 5000)
		}
	}

	/**
	 * Ecouteurs : A n'appeler qu'une seule fois.
	 */

	/**
	 * Quand on presse une touche,
	 * s'il s'agit d'une flèche directionnelle, le serpent du joueur la suivra.
	 *
	 * Attention, un serpent ne peut pas faire demi-tour !
	 */
	ecouterLesTouchesClavier(){
		var that = this

		$(document).on("keydown", function(event) {
			if ([Directions.UP,
				Directions.DOWN,
				Directions.LEFT,
				Directions.RIGHT].indexOf(event.keyCode) != -1) {
				event.preventDefault()
				if (Math.abs(that.mySnake.getDirection() - event.keyCode) != 2) {
					that.directionArrow = event.keyCode
				} else {
					console.warn("Les serpents ne peuvent pas faire de 180° !")
				}
			} else {
				console.warn("Unregistered key.")
			}
		})
	}

	/**
	 * Quand un autre serpent que celui du joueur local MAJ ses coordonnées
	 * et blocs, on ajoute le joueur à la liste des joueurs si on ne le 
	 * connaissait pas encore, et on modifie son serpent.
	 */
	ecouterMAJServeurConcurrents(){
		var that = this

		socket.on('updateBodyParts', function(message) {
			var bodyParts = []
			for (var bodyPart of message.bodyParts) {
				bodyParts.push(
					new BodyPart(
						new Coordinates(
							bodyPart.x,
							bodyPart.y
						)
					)
				)
			}

			if (that.snakes.hasOwnProperty(message.id)) {
				that.snakes[message.id].setCoordinates(
					new Coordinates(message.position.x, message.position.y)
				)
			} else {
				that.snakes[message.id] = new Snake(
					new Coordinates(message.position.x, message.position.y),
					null,
					message.id
				)
			}

			that.snakes[message.id].setBodyParts(bodyParts)
		})
	}

	/**
	 * On écoute quand le serveur nous demande de supprimer un serpent,
	 * et on obéit.
	 */
	ecouterMAJServeurSupprimerSerpent(){
		var that = this

		socket.on('removeSnake', function(message) {
			console.info("Serpent supprimé.")
			if (message.killerId === that.mySnake.id && message.id !== that.mySnake.id){
				that.score += 5
			}
			delete that.snakes[message.id]
		})
	}

	/**
	 * On écoute quand le serveur nous informe de la mise en place d'une
	 * nouvelle pomme, et on obéit.
	 */
	ecouterMAJServeurNouvellePomme(){
		var that = this

		socket.on('newApple', function(message) {
			that.putNewApple(new Coordinates(message.x, message.y))
		})
	}

	// Pour chaque serpent connu, on l'affiche.
	afficherSerpents(){
		for (var snake in this.snakes) {
			this.snakes[snake].draw(this.ctx)
		}
	}

	// Si la pomme est définie, on l'affiche.
	afficherPomme(){
		if (this.apple != null) {
			this.apple.draw(this.ctx)
		}
	}

	// On affiche le score.
	afficherScore(){
		this.ctx.font = "20px Arial"
		this.ctx.fillStyle = "#000000"
		this.ctx.fillText("Score : "+this.score, 50, 50)
	}

	notreSerpentEstMort(){
		return this.dead
	}

	// Si on n'est pas mort, on informe tout le monde de notre position.
	envoyerInformationsServeur(){
		var bodyParts = []

		for (var bodyPart of this.mySnake.getBodyParts()) {
			bodyParts.push({
				x: bodyPart.getCoordinates().getX(),
				y: bodyPart.getCoordinates().getY()
			})
		}

		// On envoie le message au serveur.
		socket.emit("updateBodyParts", {
			position: {
				x: this.mySnake.getCoordinates().getX(),
				y: this.mySnake.getCoordinates().getY()
			},
			bodyParts: bodyParts
		})
	}

	rappelerBoucleDeRendu(){
		var that = this
		setTimeout(function() {
			that.loop()

		// Le jeu est raffraichi 10 fois par seconde.
		}, 1000 / 10)
	}

	/**
	 * On vérifie si on mord la pomme.
	 */
	notreSerpentMordPomme(){
		if (this.apple != null) {
			if (this.mySnake.collidesApple(this.apple)) {
				return true;
			}
		}
		return false;
	}

	mangerPomme(){
		this.mySnake.grow()
		this.apple = null;
		this.score++
		socket.emit("ateTheApple")
		// this.newRandomApple()
	}

	/**
	 * Pour chaque serpent de la liste des serpents,
	 * on vérifie les collisions du notre avec ceux-ci.
	 */
	notreSerpentEnMordUn(){
		for (var snake in this.snakes) {
			if (this.mySnake.collidesSnake(this.snakes[snake])) {
				return true
			}
		}
	}

	/**
	 * Pour chaque serpent de la liste des serpents,
	 * on vérifie les collisions du notre avec ceux-ci.
	 *
	 * On ne vérifie que si c'est nous qui mordons.
	 * Sinon, nous serons averti par le serveur.
	 */
	afficherEcranScore(){
		for (var snake in this.snakes) {
			if (this.mySnake.collidesSnake(this.snakes[snake])) {
				this.die(this.snakes[snake].id)
			}
		}
	}

	// On fait avancer notre serpent d'une étape.
	faireAvancerNotreSerpent(){
		this.mySnake.moveForward()
	}

	// On fait tourner le serpent.
	faireTournerNotreSerpent(){
		if (this.directionArrow!=null){
			this.mySnake.setDirection(this.directionArrow)
		}
	}
}