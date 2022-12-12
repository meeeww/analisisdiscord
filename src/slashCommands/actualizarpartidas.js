const { SlashCommandBuilder } = require("discord.js")
const mysql = require("mysql2")
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

        let fecha = new Date()

        let numeroPartidas = []//añadir partidas que ya estan hechas
        await conexion.promise().query("SELECT * FROM `partidas` WHERE idJugador = ?", [idJugador]).then(([results, fields]) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]["idJugador"] == idJugador) {
                    console.log("hey")
                    numeroPartidas.push(results[i]["idPartida"])
                }
            }
        }).catch()
        //coger nuevas partidas
        let cuenta = 0
        let comprobador = 0
        let nuevasPartidas = []
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
                nuevasPartidas.push(data[i])
                /*for (var i = 0; i < data.length; i++) {
                    try {
                        conexion.query("INSERT INTO `partidas` (`idPartida`, `idJugador`, `tipoPartida`) VALUES ('" + data[i] + "', '" + idJugador + "', 'Ranked')", function (error, results, fields) {
                            if (error) {
                                throw error
                            }
                        })
                    } catch (error) {
                    }

                }*/

            }
            cuenta = cuenta + 100
        } while (comprobador == 0)
        console.log(nuevasPartidas)
        console.log(numeroPartidas)

        /**/
        interaction.channel.send("Listo.").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        return interaction.reply("El jugador **" + interaction.options.get("invocador").value + "** ha sido insertado correctamente.")
    }
}