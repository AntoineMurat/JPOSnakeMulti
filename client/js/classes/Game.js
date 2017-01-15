/**
 * Classe représentant une partie.
 */
class Game {
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
		// On initialise le serpent.
		this.initSnake()
		// fix pour les 180.
		this.directionArrow = null

		// this.putNewRandomApple()

	}

	/**
	 * Démarre la partie en initialisant divers objets et enregistrant divers listeners.
	 */
	start() {
		console.info("Partie démarrée.")
		var that = this;

		/**
		 * Quand on presse une touche,
		 * s'il s'agit d'une flèche directionnelle, le serpent du joueur la suivra.
		 *
		 * Attention, un serpent ne peut pas faire demi-tour !
		 */
		$(document).on("keydown", function(event) {
			if ([Directions.UP,
				Directions.DOWN,
				Directions.LEFT,
				Directions.RIGHT].indexOf(event.keyCode) != -1) {
				if (Math.abs(that.mySnake.getDirection() - event.keyCode) != 2) {
					that.directionArrow = event.keyCode
				} else {
					console.warn("Les serpents ne peuvent pas faire de 180° !")
				}
			} else {
				console.warn("Unregistered key.")
			}
		})

		/**
		 * Quand un autre serpent que celui du joueur local MAJ ses coordonnées
		 * et blocs, on ajoute le joueur à la liste des joueurs si on ne le 
		 * connaissait pas encore, et on modifie son serpent.
		 */
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

		/**
		 * On écoute quand le serveur nous demande de supprimer un serpent,
		 * et on obéit.
		 */
		socket.on('removeSnake', function(message) {
			console.info("Serpent supprimé.")
			if (message.killerId === that.mySnake.id && message.id !== that.mySnake.id){
				that.score += 5
			}
			delete that.snakes[message.id]
		})

		/**
		 * On écoute quand le serveur nous informe de la mise en place d'une
		 * nouvelle pomme, et on obéit.
		 */
		socket.on('newApple', function(message) {
			that.putNewApple(new Coordinates(message.x, message.y))
		})

		/**
		 * On démarre la boucle de calcul et de rendu.
		 */
		this.loop()
	}

	/**
	 * Lance la boucle de calcul et de rendu jusqu'à la mort.
	 *
	 * Méthode appelée après initialisation. 
	 */
	loop() {

		/**
		 * MAJ de la physique.
		 */

		// On fait tourner le serpent.

		if (this.directionArrow!=null){
			this.mySnake.setDirection(this.directionArrow)
		}

		// On fait avancer notre serpent d'une étape.

		this.mySnake.moveForward()

		/**
		 * Pour chaque serpent de la liste des serpents,
		 * on vérifie les collisions du notre avec ceux-ci.
		 *
		 * On ne vérifie que si c'est nous qui mordons.
		 * Sinon, nous serons averti par le serveur.
		 */
		for (var snake in this.snakes) {

			if (this.mySnake.collidesSnake(this.snakes[snake])) {
				this.die(this.snakes[snake].id)
			}
		}

		/**
		 * Si la pomme est bien définie,
		 * on vérifie si on la mange on nous.
		 *
		 * Si c'est le cas, on informe le serveur et grandit.
		 */
		if (this.apple != null) {
			if (this.mySnake.collidesApple(this.apple)) {
				this.mySnake.grow()
				this.apple = null;
				this.score++
					socket.emit("ateTheApple")
					// this.newRandomApple()
			}
		}

		/**
		 * MAJ des graphismes.
		 */

		// On nettoie l'écran.
		this.clearScreen()

		// Pour chaque serpent connu, on l'affiche.
		for (var snake in this.snakes) {
			this.snakes[snake].draw(this.ctx)
		}

		// Si la pomme est définie, on l'affiche.
		if (this.apple != null) {
			this.apple.draw(this.ctx)
		}

		// On affiche le score.
		this.ctx.font = "20px Arial";
		this.ctx.fillStyle = "#000000"
		this.ctx.fillText("Score : "+this.score, 50, 50);

		/**
		 * Gestion du multijoueur.
		 */
		
		// Si on n'est pas mort, on informe tout le monde de notre position.
		if (!this.dead) {
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

		// On ne reste dans la boucle que si on est en vie.
		var that = this
		if (!this.dead) {
			setTimeout(function() {
				that.loop()

			// Le jeu est raffraichi 10 fois par seconde.
			}, 1000 / 10)
		}
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
}