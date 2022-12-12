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
        .setDescription("Actualizar tablas"),


    async execute(client, interaction, prefix, servidor) {

        conexion.connect(function (error) {
            if (error) {
                throw error
            } else {
                console.log("conectados perfectamente")
            }
        })

        conexion.query("CREATE TABLE temp LIKE infoPartidas;", function (error, results, fields) {
            if (error) {
                let fecha = new Date()
                conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Actualizar Partidas', '" + "Sin Jugador" + "', 'RECHAZADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
                    if (error) {
                        throw error
                    }
                })
                conexion.end()
                throw error
            } else {
                conexion.query("INSERT INTO temp SELECT DISTINCT * FROM infoPartidas;", function (error, results, fields) {
                    if (error) {
                        throw error
                    } else {
                        conexion.query("DROP TABLE infoPartidas;", function (error, results, fields) {
                            if (error) {
                                throw error
                            } else {
                                conexion.query("RENAME TABLE temp TO infoPartidas;", function (error, results, fields) {
                                    if (error) {
                                        throw error
                                    } else {
                                        conexion.end()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

        let fecha = new Date()
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Actualizar Partidas', '" + "Sin Jugador" + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        interaction.channel.send("Listo.").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        return interaction.reply("Tablas actualizadas.")
    }
}