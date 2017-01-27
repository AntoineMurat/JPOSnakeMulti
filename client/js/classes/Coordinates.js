/**
 * Classe représentant des coordonnées dans un espace 2D.
 */
class Coordinates {

	/**
	 * Constructeur permettant d'obtenir des coordonnées 2d
	 * à partir des composantes x et y.
	 * 
	 * @param  {Integer} composante x.
	 * @param  {Integer} composante y.
	 */
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	/**
	 * Compare deux coordonnées en vérifiant si elles sont égales.
	 * 
	 * @param  {Coordinates} les coordonnées à comparer.
	 * @return {Boolean} booléen qualifiant l'égalité.
	 */
	equals(coordinates) {
		return (this.getX() == coordinates.getX() && this.getY() == coordinates.getY())
	}

	/**
	 * Getters & Setters
	 */

	getX() {
		return this.x
	}

	getY() {
		return this.y
	}

	setX(x) {
		this.x = x
	}

	setY(y) {
		this.y = y
	}
}