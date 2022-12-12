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

        let fecha = new Date()

        let numeroPartidas = []

        await conexion.promise().query("SELECT * FROM `partidas` WHERE idJugador = ?", idJugador).then(([results, fields]) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]["idJugador"] == idJugador) {
                    numeroPartidas.push(results[i]["idPartida"])
                }
            }
        }).catch()
        //////insertar jugadores finalizado, iniciando rankeds
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Partidas', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        porcentaje = 0
        console.log(data)
        for (var i = 0; i < numeroPartidas.length; i++) {
            porcentaje = (i / numeroPartidas.length) * 100
            interaction.channel.send("Vamos por el " + porcentaje + "%").then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
            console.log("vuelta " + i + " " + numeroPartidas[i])
            try {
                url = "https://europe.api.riotgames.com/lol/match/v5/matches/" + numeroPartidas[i] + "?api_key=" + apiKey
                response = await fetch(url)
                data = await response.json()

                var numeroJugador, numeroRival

                for (var x = 0; x <= 9; x++) {
                    if (data["metadata"]["participants"][x] == puuidJugador) {
                        numeroJugador = x
                    }
                }

                switch (numeroJugador) {
                    case 0:
                        numeroRival = numeroJugador + 5
                        break
                    case 1:
                        numeroRival = numeroJugador + 5
                        break
                    case 2:
                        numeroRival = numeroJugador + 5
                        break
                    case 3:
                        numeroRival = numeroJugador + 5
                        break
                    case 4:
                        numeroRival = numeroJugador + 5
                        break
                    case 5:
                        numeroRival = numeroJugador - 5
                        break
                    case 6:
                        numeroRival = numeroJugador - 5
                        break
                    case 7:
                        numeroRival = numeroJugador - 5
                        break
                    case 8:
                        numeroRival = numeroJugador - 5
                        break
                    case 9:
                        numeroRival = numeroJugador - 5
                        break
                }

                var hayenemigo = 1
                if (typeof data["metadata"]["participants"][numeroRival] == 'undefined') {
                    hayenemigo = 0
                }
                url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + data["metadata"]["participants"][numeroRival] + "?api_key=" + apiKey
                response = await fetch(url)
                data2 = await response.json()

                if (hayenemigo == 1) {
                    try {
                        if (typeof data["info"]["participants"][numeroRival]["challenges"] != "undefined") {
                            try {
                                conexion.query("INSERT INTO infoPartidas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numeroPartidas[i],
                                data["info"]["participants"][numeroRival]["summonerId"],
                                data["info"]["participants"][numeroRival]["assists"],
                                data["info"]["participants"][numeroRival]["baronKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["buffsStolen"],
                                data["info"]["participants"][numeroRival]["challenges"]["controlWardsPlaced"],
                                data["info"]["participants"][numeroRival]["challenges"]["damagePerMinute"],
                                data["info"]["participants"][numeroRival]["challenges"]["dodgeSkillShotsSmallWindow"],
                                data["info"]["participants"][numeroRival]["challenges"]["dragonTakedowns"],
                                data["info"]["participants"][numeroRival]["challenges"]["earliestDragonTakedown"],
                                data["info"]["participants"][numeroRival]["challenges"]["epicMonsterSteals"],
                                data["info"]["participants"][numeroRival]["challenges"]["epicMonsterStolenWithoutSmite"],
                                data["info"]["participants"][numeroRival]["challenges"]["gameLength"],
                                data["info"]["participants"][numeroRival]["challenges"]["kda"],
                                data["info"]["participants"][numeroRival]["challenges"]["knockEnemyIntoTeamAndKill"],
                                data["info"]["participants"][numeroRival]["challenges"]["multikillsAfterAggressiveFlash"],
                                data["info"]["participants"][numeroRival]["challenges"]["outnumberedKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["quickCleanse"],
                                data["info"]["participants"][numeroRival]["challenges"]["skillshotsDodged"],
                                data["info"]["participants"][numeroRival]["challenges"]["soloBaronKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["soloKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["takedownsAfterGainingLevelAdvantage"],
                                data["info"]["participants"][numeroRival]["challenges"]["teamBaronKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["teamElderDragonKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["teamRiftHeraldKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["turretPlatesTaken"],
                                data["info"]["participants"][numeroRival]["challenges"]["turretsTakenWithRiftHerald"],
                                data["info"]["participants"][numeroRival]["championName"],
                                data["info"]["participants"][numeroRival]["deaths"],
                                data["info"]["participants"][numeroRival]["detectorWardsPlaced"],
                                data["info"]["participants"][numeroRival]["individualPosition"],
                                data["info"]["participants"][numeroRival]["kills"],
                                data["info"]["participants"][numeroRival]["objectivesStolen"],
                                data["info"]["participants"][numeroRival]["objectivesStolenAssists"],
                                data["info"]["participants"][numeroRival]["puuid"],
                                data["info"]["participants"][numeroRival]["summonerName"],
                                data["info"]["participants"][numeroRival]["totalMinionsKilled"],
                                data["info"]["participants"][numeroRival]["visionScore"],
                                data["info"]["participants"][numeroRival]["visionWardsBoughtInGame"],
                                data["info"]["participants"][numeroRival]["wardsKilled"],
                                data["info"]["participants"][numeroRival]["wardsPlaced"],
                                data["info"]["participants"][numeroRival]["win"],
                                [fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate()]], function (error, results, fields) {
                                    if (error) {
                                        throw error
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        } else {
                            try {
                                conexion.query("INSERT INTO infoPartidas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numeroPartidas[i],
                                data["info"]["participants"][numeroRival]["summonerId"],
                                data["info"]["participants"][numeroRival]["assists"],
                                data["info"]["participants"][numeroRival]["baronKills"],
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                data["info"]["participants"][numeroRival]["championName"],
                                data["info"]["participants"][numeroRival]["deaths"],
                                data["info"]["participants"][numeroRival]["detectorWardsPlaced"],
                                data["info"]["participants"][numeroRival]["individualPosition"],
                                data["info"]["participants"][numeroRival]["kills"],
                                data["info"]["participants"][numeroRival]["objectivesStolen"],
                                data["info"]["participants"][numeroRival]["objectivesStolenAssists"],
                                data["info"]["participants"][numeroRival]["puuid"],
                                data["info"]["participants"][numeroRival]["summonerName"],
                                data["info"]["participants"][numeroRival]["totalMinionsKilled"],
                                data["info"]["participants"][numeroRival]["visionScore"],
                                data["info"]["participants"][numeroRival]["visionWardsBoughtInGame"],
                                data["info"]["participants"][numeroRival]["wardsKilled"],
                                data["info"]["participants"][numeroRival]["wardsPlaced"],
                                data["info"]["participants"][numeroRival]["win"],
                                [fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate()]], function (error, results, fields) {
                                    if (error) {
                                        throw error
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    console.log("uno")
                }
            } catch {
            }
        }
        //////tourneys finalizado
        interaction.channel.send("Listo. Ahora haz un /actualizarpartidas").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        conexion.end()
        return interaction.reply("El jugador **" + jugador.value + "** ha sido insertado correctamente.")
    }
}