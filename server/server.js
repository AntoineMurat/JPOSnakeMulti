/**
 *	Programme côté serveur pour les JPO de l'IUT du Limousin.
 *
 *	Synchronise les clients du jeu de Snake.
 */

console.log("Démarrage du serveur...")

/**
 * Socket.io permet d'établir une communication directe 
 * entre client (HTML/JS) et serveur.
 */
io = require("socket.io").listen(80)

/**
 * La pomme est en fait représentées par 
 * ses coordonnées avec le couple (x,y).
 */
var apple = {
    x: parseInt(Math.random() * 20),
    y: parseInt(Math.random() * 20)
}

/**
 * Quand un client se connecte, on enregistre des listeners.
 */
io.on('connect', function(socket) {
    console.log("[" + socket.id + "] s'est connecté.")

    /**
     * Lors de la connexion, on envoie la position courante de la pomme.
     */
    socket.emit("newApple", apple)

    /**
     * Quand un client dit avoir mangé la pomme,
     * on en génère une nouvelle et informe les autres joueurs.
     */
    socket.on("ateTheApple", function() {

        console.log("[" + socket.id + "] a mangé la pomme.")

        apple = {
            x: parseInt(Math.random() * 40),
            y: parseInt(Math.random() * 40)
        }

        io.sockets.emit("newApple", apple)
    })

    /**
     * Quand un client envoie ses nouvelles coordonnées,
     * on en informe les autres clients.
     */
    socket.on("updateBodyParts", function(message) {
        socket.broadcast.emit("updateBodyParts", {
            id: socket.id,
            position: message.position,
            bodyParts: message.bodyParts
        })
    })

    /**
     * Quand un client se dit mort,
     * on informe les autres joueurs qu'ils peuvent le supprimer.
     */
    socket.on("died", function(message) {
    	console.log("[" + socket.id + "] tué par "+message.killerId)
        socket.broadcast.emit("removeSnake", {
            id: socket.id,
            killerId: message.killerId
        })
    })

    /**
     * Quand un joueur se déconnecte,
     * on informe les autres joueurs qu'ils peuvent le supprimer.
     */
    socket.on('disconnect', function() {
        console.log("[" + socket.id + "] s'est déconnecté.")
        socket.broadcast.emit("removeSnake", {
            id: socket.id,
            killerId: null
        })
    })

})

console.log("Serveur en écoute.")