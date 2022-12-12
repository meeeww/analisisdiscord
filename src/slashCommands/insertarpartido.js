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
        .setDescription("Partidas del Equipo")
        .addStringOption(option =>
            option.setName("equipo")
                .setDescription("Insertar el nombre del equipo exacto")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("IDPartida")
                .setDescription("Insertar el ID de partida")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("lado")
                .setDescription("Blue/Red")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("rival")
                .setDescription("Insertar el nombre del equipo rival")
                .setRequired(true)
        ),


    async execute(client, interaction, prefix, servidor) {
        conexion.connect(function (error) {
            if (error) {
                throw error
            } else {
            }
        })



        let equipo = interaction.options.get("invocador").value
        let equipoRival = interaction.options.get("rival").value
        let idPartida = interaction.options.get("IDPartida").value
        let lado = interaction.options.get("lado").value

        let jugadores = []
        let equipoNumero
        let equipoNumeroRival
        let seguir = false

        switch (lado) {
            case "Blue":
                jugadores = ["0", "1", "2", "3", "4"]
                equipoNumero = 0
                equipoNumeroRival = 1
                break;
            case "Red":
                jugadores = ["5", "6", "7", "8", "9"]
                equipoNumero = 1
                equipoNumeroRival = 0
                break;
            default:
                seguir = false
                break;
        }

        url = "https://europe.api.riotgames.com/lol/match/v5/matches/" + idPartida + "?api_key=" + apiKey
        response = await fetch(url)
        data = await response.json()

        let almaConseguida = 0
        let dosHeraldos = 0
        if (data["info"]["teams"][equipoNumero]["dragon"]["kills"] >= 4) {
            almaConseguida = 1
        }
        if (data["info"]["teams"][equipoNumero]["riftHerald"]["kills"] >= 2) {
            dosHeraldos = 1
        }

        let visionScore
        let visionScore2
        let wardControl = 0
        for (var i = 0; i < 10; i++) {
            if (i <= 4) {
                visionScore = visionScore + data["info"]["participants"][i]["visionScore"]
            } else if (i >= 5) {
                visionScore2 = visionScore2 + data["info"]["participants"][i]["visionScore"]
            }
        }
        if (equipoNumero == 0) {
            if (visionScore >= visionScore2) {
                wardControl = 1
            }
        } else if (equipoNumero == 1) {
            if (visionScore2 >= visionScore) {
                wardControl = 1
            }
        }
        //////insertar jugadores finalizado, iniciando rankeds

        try {
            conexion.query("INSERT INTO infoEquipos VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                idPartida,
                equipo,
                data["info"]["teams"][equipoNumero]["win"],
                data["info"]["gameDuration"],
                almaConseguida,//6
                dosHeraldos,
                data["info"]["teams"][equipoNumero]["objetives"]["champion"]["first"],
                data["info"]["teams"][equipoNumero]["objetives"]["tower"]["first"],
                wardControl,
                data["info"]["teams"][equipoNumero]["objetives"]["champion"]["kills"],
                data["info"]["teams"][equipoNumeroRival]["objetives"]["champion"]["kills"],//deaths
                data["info"]["teams"][equipoNumero]["objetives"]["tower"]["kills"],//torres
                data["info"]["teams"][equipoNumero]["objetives"]["dragon"]["kills"],//dragones
                data["info"]["teams"][equipoNumero]["objetives"]["baron"]["kills"],//nashors
                data["info"]["teams"][equipoNumero]["objetives"]["riftHerald"]["kills"],//heraldos

                data["info"]["participants"][jugadores[0]]["championName"],//picktop
                data["info"]["participants"][jugadores[1]]["championName"],//pickjungla
                data["info"]["participants"][jugadores[2]]["championName"],//pickmid
                data["info"]["participants"][jugadores[3]]["championName"],//pickadc
                data["info"]["participants"][jugadores[4]]["championName"],//picksu`p

                data["info"]["teams"][equipoNumero]["bans"][0]["championId"],//firstban
                data["info"]["teams"][equipoNumero]["bans"][1]["championId"],//secondban
                data["info"]["teams"][equipoNumero]["bans"][2]["championId"],//thirdban
                data["info"]["teams"][equipoNumero]["bans"][3]["championId"],//fourthban
                data["info"]["teams"][equipoNumero]["bans"][4]["championId"],//fifthban

                lado,//lado
                equipoRival,//equiporival
            ], function (error, results, fields) {
                if (error) {
                    throw error
                }
            })
        } catch {
        }

        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Jugador', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        interaction.channel.send("Listo. Ahora haz un /analizarmatchups o /actualizarpartidas").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        return interaction.reply("El jugador **" + interaction.options.get("invocador").value + "** ha sido insertado correctamente.")
    }
}