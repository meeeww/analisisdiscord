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
        for (var i = 0; i < numeroPartidas.length; i++) {
            porcentaje = (i / numeroPartidas.length) * 100
            interaction.channel.send("Vamos por el " + porcentaje + "%").then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
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
                        if (typeof data["info"]["participants"][numeroJugador]["challenges"] != "undefined") {
                            try {
                                conexion.query("INSERT INTO infoPartidas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numeroPartidas[i],
                                data["info"]["participants"][numeroJugador]["summonerId"],
                                data["info"]["participants"][numeroJugador]["assists"],
                                data["info"]["participants"][numeroJugador]["baronKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["buffsStolen"],
                                data["info"]["participants"][numeroJugador]["challenges"]["controlWardsPlaced"],
                                data["info"]["participants"][numeroJugador]["challenges"]["damagePerMinute"],
                                data["info"]["participants"][numeroJugador]["challenges"]["dodgeSkillShotsSmallWindow"],
                                data["info"]["participants"][numeroJugador]["challenges"]["dragonTakedowns"],
                                data["info"]["participants"][numeroJugador]["challenges"]["earliestDragonTakedown"],
                                data["info"]["participants"][numeroJugador]["challenges"]["epicMonsterSteals"],
                                data["info"]["participants"][numeroJugador]["challenges"]["epicMonsterStolenWithoutSmite"],
                                data["info"]["participants"][numeroJugador]["challenges"]["gameLength"],
                                data["info"]["participants"][numeroJugador]["challenges"]["kda"],
                                data["info"]["participants"][numeroJugador]["challenges"]["knockEnemyIntoTeamAndKill"],
                                data["info"]["participants"][numeroJugador]["challenges"]["multikillsAfterAggressiveFlash"],
                                data["info"]["participants"][numeroJugador]["challenges"]["outnumberedKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["quickCleanse"],
                                data["info"]["participants"][numeroJugador]["challenges"]["skillshotsDodged"],
                                data["info"]["participants"][numeroJugador]["challenges"]["soloBaronKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["soloKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["takedownsAfterGainingLevelAdvantage"],
                                data["info"]["participants"][numeroJugador]["challenges"]["teamBaronKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["teamElderDragonKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["teamRiftHeraldKills"],
                                data["info"]["participants"][numeroJugador]["challenges"]["turretPlatesTaken"],
                                data["info"]["participants"][numeroJugador]["challenges"]["turretsTakenWithRiftHerald"],
                                data["info"]["participants"][numeroJugador]["championName"],
                                data["info"]["participants"][numeroJugador]["deaths"],
                                data["info"]["participants"][numeroJugador]["detectorWardsPlaced"],
                                data["info"]["participants"][numeroJugador]["individualPosition"],
                                data["info"]["participants"][numeroJugador]["kills"],
                                data["info"]["participants"][numeroJugador]["objectivesStolen"],
                                data["info"]["participants"][numeroJugador]["objectivesStolenAssists"],
                                data["info"]["participants"][numeroJugador]["puuid"],
                                data["info"]["participants"][numeroJugador]["summonerName"],
                                data["info"]["participants"][numeroJugador]["totalMinionsKilled"],
                                data["info"]["participants"][numeroJugador]["visionScore"],
                                data["info"]["participants"][numeroJugador]["visionWardsBoughtInGame"],
                                data["info"]["participants"][numeroJugador]["wardsKilled"],
                                data["info"]["participants"][numeroJugador]["wardsPlaced"],
                                data["info"]["participants"][numeroJugador]["win"],
                                [fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate()]], function (error, results, fields) {
                                    if (error) {
                                        throw error
                                    }
                                })
                            } catch{
                            }
                        } else {
                            try {


                                conexion.query("INSERT INTO infoPartidas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numeroPartidas[i],
                                data["info"]["participants"][numeroJugador]["summonerId"],
                                data["info"]["participants"][numeroJugador]["assists"],
                                data["info"]["participants"][numeroJugador]["baronKills"],
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
                                data["info"]["participants"][numeroJugador]["championName"],
                                data["info"]["participants"][numeroJugador]["deaths"],
                                data["info"]["participants"][numeroJugador]["detectorWardsPlaced"],
                                data["info"]["participants"][numeroJugador]["individualPosition"],
                                data["info"]["participants"][numeroJugador]["kills"],
                                data["info"]["participants"][numeroJugador]["objectivesStolen"],
                                data["info"]["participants"][numeroJugador]["objectivesStolenAssists"],
                                data["info"]["participants"][numeroJugador]["puuid"],
                                data["info"]["participants"][numeroJugador]["summonerName"],
                                data["info"]["participants"][numeroJugador]["totalMinionsKilled"],
                                data["info"]["participants"][numeroJugador]["visionScore"],
                                data["info"]["participants"][numeroJugador]["visionWardsBoughtInGame"],
                                data["info"]["participants"][numeroJugador]["wardsKilled"],
                                data["info"]["participants"][numeroJugador]["wardsPlaced"],
                                data["info"]["participants"][numeroJugador]["win"],
                                [fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate()]], function (error, results, fields) {
                                    if (error) {
                                        throw error
                                    }
                                })
                            } catch (error) {
                            }
                        }
                    } catch (error) {
                    }
                }
            } catch {
            }
        }
        //////tourneys finalizado
        conexion.query("CREATE TABLE temp LIKE infoPartidas;", function (error, results, fields) {
            if (error) {
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
        /**/
        interaction.channel.send("Listo. Ahora haz un /analizarmatchups o /actualizarpartidas").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        return interaction.reply("El jugador **" + interaction.options.get("invocador").value + "** ha sido insertado correctamente.")
    }
}