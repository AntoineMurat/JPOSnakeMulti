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
        ctx.fillStyle = "#FF0000"
        ctx.beginPath()
        ctx.arc(this.coordinates.getX() * 20 + 10, this.coordinates.getY() * 20 + 10, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}