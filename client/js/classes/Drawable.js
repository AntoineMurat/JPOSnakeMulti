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
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(this.coordinates.getX() * 20, this.coordinates.getY() * 20, 20, 20)
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