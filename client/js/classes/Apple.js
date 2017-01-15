/**
 * Classe représentant une pomme.
 */
class Apple extends Drawable {

	/**
	 * Constructeur permettant d'obtenir une pomme 
	 * à partir de ses coordonnées.
	 * 
	 * @param  {Coordinates} les coordonnées de la pomme.
	 */
	constructor(coordinates) {
		super(coordinates)
	}

	/**
	 * Dessine la pomme sur un contexte.
	 * 
	 * @param  {Context2D} le contexte sur lequel dessiner.
	 */
	draw(ctx) {
		ctx.fillStyle = "#CF000F"
		ctx.beginPath()
		ctx.arc(
			this.coordinates.getX() * ctx.canvas.width/40 + ctx.canvas.width/80,
			this.coordinates.getY() * ctx.canvas.height/40 + ctx.canvas.width/80,
			ctx.canvas.width/80,
			0,
			Math.PI * 2
		)
		ctx.fill()
		ctx.closePath()
	}
}