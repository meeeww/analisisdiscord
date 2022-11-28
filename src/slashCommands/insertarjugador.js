const { SlashCommandBuilder } = require("discord.js")
const mysql = require("mysql")
let conexion = mysql.createConnection({
    host: "82.223.64.145",
    database: "amateurdb",
    user: "appsscript",
    password: "8@k99b#*yD"
})

var apiKey = "RGAPI-b245e917-eb17-40b0-81e4-69bc506bfda2";
let returnValue

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Nombre del invocador")
        .addStringOption(option =>
            option.setName("invocador")
                .setDescription("Insertar el nombre del invocador exacto")
                .setRequired(true)

        ),


    async execute(client, interaction, prefix, servidor) {

        conexion.connect(function (error) {
            if (error) {
                throw error
            } else {
                console.log("conectados perfectamente")
            }
        })

        let jugador = interaction.options.get("invocador").value.replace(/ /g, '%20')
        console.log(jugador)

        let url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + jugador + "?api_key=" + apiKey
        let response = await fetch(url)
        let data = await response.json()

        let puuidJugador = data.puuid
        let idJugador = data.id

        conexion.query("INSERT INTO `jugadores` (`idJugador`, `puuidJugador`, `nombreJugador`, `equipoJugador`) VALUES ('" + data.id + "', '" + data.puuid + "', '" + data.name + "', 'ninguno')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })

        let fecha = new Date()
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Jugador', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        //////insertar jugadores finalizado, iniciando rankeds
        let cuenta = 0
        let comprobador = 0
        do {
            url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuidJugador + "/ids?type=ranked&start=" + cuenta + "&count=100&api_key=" + apiKey
            response = await fetch(url)
            data = await response.json()

            if (data.length <= 0) {
                comprobador = 1
            } else {
                for (var i = 0; i < data.length; i++) {
                    try {
                        conexion.query("INSERT INTO `partidas` (`idPartida`, `idJugador`, `tipoPartida`) VALUES ('" + data[i] + "', '" + idJugador + "', 'Ranked')", function (error, results, fields) {
                            if (error) {
                                throw error
                            }
                        })
                    } catch {
                        console.log("partida ya existe")
                    }

                }

            }
            cuenta = cuenta + 100
        } while (comprobador = 1)
        //////rankeds finalizado, iniciando tourneys
        cuenta = 0
        comprobador = 0
        do {
            url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuidJugador + "/ids?type=tourney&start=" + cuenta + "&count=100&api_key=" + apiKey
            response = await fetch(url)
            data = await response.json()

            if (data.length <= 0) {
                comprobador = 1
            } else {
                for (var i = 0; i < data.length; i++) {
                    try {
                        conexion.query("INSERT INTO `partidas` (`idPartida`, `idJugador`, `tipoPartida`) VALUES ('" + data[i] + "', '" + idJugador + "', 'Scrim')", function (error, results, fields) {
                            if (error) {
                                throw error
                            }
                        })
                    } catch {
                        console.log("partida ya existe")
                    }
                }
            }
            cuenta = cuenta + 100
        } while (comprobador = 1)
        //////tourneys finalizado
        conexion.end()
        return interaction.reply("El jugador **" + jugador.value + "** ha sido insertado correctamente.")
    }
}