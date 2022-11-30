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
        .setDescription("Nombre del equipo")
        .addStringOption(option =>
            option.setName("nombre")
                .setDescription("Insertar el nombre del equipo exacto")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("elo")
                .setDescription("Insertar elo medio del equipo")
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

        conexion.query("INSERT INTO `equipos` (`nombreEquipo`, `eloMedio`) VALUES ('" + interaction.options.get("nombre").value.replace(/ /g, '%20') + "', '" + interaction.options.get("elo").value.replace(/ /g, '%20') + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })

        conexion.end()
        return interaction.reply("El jugador **" + jugador.value + "** ha sido insertado correctamente.")
    }
}