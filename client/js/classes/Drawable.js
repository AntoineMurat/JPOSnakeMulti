/**
 * Classe représentant un objet dessinable.
 */
class Drawable {

	/**
	 * Constructeur permettant d'obtenir un dessinable
	 * à partir de ses coordonnées.
	 * 
	 * @param  {Coordinates} les coordonnées initiales.
	 */
	constructor(coordinates) {
		this.coordinates = coordinates
	}

	/**
	 * Dessine l'objet sur un contexte.
	 * 
	 * @param  {Context2D} le contexte sur lequel dessiner.
	 */
	draw(ctx) {
		ctx.fillStyle = "#F9BF3B"
		ctx.fillRect(
			this.coordinates.getX() * ctx.canvas.width/40, 
			this.coordinates.getY() * ctx.canvas.height/40, 
			ctx.canvas.width/40, 
			ctx.canvas.height/40
		)
	}

	/**
	 * Getters & Setters
	 */

	setCoordinates(coordinates) {
		this.coordinates = coordinates
	}

	getCoordinates() {
		return this.coordinates
	}
}