const { SlashCommandBuilder } = require("discord.js")
const mysql = require("mysql")
let conexion = mysql.createConnection({
    host: (process.env.HOST),
    database: (process.env.DATABASE),
    user: (process.env.USER),
    password: (process.env.PASSWORD)
})

var apiKey = (process.env.APIKEY)
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
            }
        })

        let jugador = interaction.options.get("invocador").value.replace(/ /g, '%20')

        let url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + jugador + "?api_key=" + apiKey
        let response = await fetch(url)
        let data = await response.json()

        let puuidJugador = data.puuid
        let idJugador = data.id

        conexion.query("INSERT INTO `jugadores` (`idJugador`, `puuidJugador`, `nombreJugador`, `nombreEquipo`) VALUES ('" + data.id + "', '" + data.puuid + "', '" + data.name + "', 'ninguno')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })

        
        //////insertar jugadores finalizado, iniciando rankeds
        let cuenta = 0
        let comprobador = 0
        do {
            interaction.channel.send("Seguimos...").then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
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
                    } catch (error) {
                    }

                }

            }
            cuenta = cuenta + 100
        } while (comprobador == 0)
        //////rankeds finalizado, iniciando tourneys
        cuenta = 0
        comprobador = 0
        do {
            interaction.channel.send("Seguimos...").then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
            url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuidJugador + "/ids?endTime=1643673600000&type=tourney&start=" + cuenta + "&count=100&api_key=" + apiKey
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
                    }
                }
            }
            cuenta = cuenta + 100
        } while (comprobador == 0)
        //////tourneys finalizado
        interaction.channel.send("Ya hemos terminado").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        let fecha = new Date()
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Jugador', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        conexion.end()
        return interaction.reply("El jugador **" + jugador.value + "** ha sido insertado correctamente.")
    }
}