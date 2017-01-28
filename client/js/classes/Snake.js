/**
 * Classe représentant un serpent.
 */
class Snake extends Drawable {
	/**
	 *	Constructeur permettant d'obtenir un serpent à 
	 *	partir de ses coordonnées initiales et de sa direction.
	 * 
	 * @param  {Coordinates} coordonnées initiales.
	 * @param  {Directions} direction initiale.
	 * @param  {String} id du socket du client de ce serpent.
	 */
	constructor(coordinates, direction, id) {
		super(coordinates)

		this.direction = direction
		this.bodyParts = [
			new BodyPart(new Coordinates(this.coordinates.getX(), this.coordinates.getY()))
		]
		this.ate = false
		this.id = id
	}

	/**
	 *	Dessine le serpent sur un contexte.
	 * 
	 * @param  {Context2D} le contexte sur lequel dessiner.
	 */
	draw(ctx) {
		for (var bodyPart of this.bodyParts) {
			bodyPart.draw(ctx)
		}
	}

	/**
	 *	Fait avancer le serpent d'une case.
	 */
	moveForward() {
		switch (this.direction) {
			case Directions.UP:
				this.coordinates.setY((this.coordinates.getY() - 1).mod(40))
				break;
			case Directions.DOWN:
				this.coordinates.setY((this.coordinates.getY() + 1).mod(40))
				break;
			case Directions.LEFT:
				this.coordinates.setX((this.coordinates.getX() - 1).mod(40))
				break;
			case Directions.RIGHT:
				this.coordinates.setX((this.coordinates.getX() + 1).mod(40))
				break;
			default:
				console.error("Unknown direction.")
		}

		this.bodyParts.push(
			new BodyPart(new Coordinates(this.coordinates.getX(), this.coordinates.getY()))
		)

		// Si le serpent a mangé, on ne supprime pas sa dernière case.

		if (this.getAte()) {
			this.setAte(false);
		} else {
			this.bodyParts.shift()
		}
	}

	/**
	 *	Fait manger (grandir d'un bloc) le serpent.
	 */
	grow() {
		this.setAte(true)
	}

	/**
	 * Vérifie si la tête du serpent mange le corps d'un (autre) serpent.
	 * 
	 * @param  {Snake} le serpent avec lequel il faut vérifier la collision.
	 * @return {Boolean} booléen qualifiant la collision.
	 */
	collidesSnake(snake) {
		for (var bodyPart of snake.getBodyParts()) {
			if (bodyPart != this.bodyParts[this.bodyParts.length - 1]) {
				if (bodyPart.getCoordinates().equals(this.coordinates)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Vérifie si la tête du serpent mange une pomme.
	 * 
	 * @param  {Apple} la pomme avec laquelle il faut vérifier la collision.
	 * @return {Boolean} booléen qualifiant la collision.
	 */
	collidesApple(apple) {
		return apple.getCoordinates().equals(this.coordinates);
	}

	/**
	 * Getters & Setters
	 */
	
	getDirection() {
		return this.direction
	}

	setDirection(direction) {
		this.direction = direction
	}

	getBodyParts() {
		return this.bodyParts
	}

	setBodyParts(bodyParts) {
		this.bodyParts = bodyParts
	}

	getAte() {
		return this.ate
	}

	setAte(ate) {
		this.ate = ate
	}
}