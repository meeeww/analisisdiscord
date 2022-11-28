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
        let numeroPartidas = []
        let fecha = new Date()
        //////insertar jugadores finalizado, iniciando rankeds
        let cuenta = 0
        let comprobador = 0
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Partidas', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        do {
            url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuidJugador + "/ids?type=ranked&start=" + cuenta + "&count=100&api_key=" + apiKey
            response = await fetch(url)
            data = await response.json()

            if (data.length <= 0) {
                comprobador = 1
            } else {
                for (var i = 0; i < data.length; i++) {
                    numeroPartidas.push(data[i])
                }
                console.log(data)
                for (var i = 0; i < numeroPartidas.length; i++) {
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
                        url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + data["metadata"]["participants"][numeroJugador] + "?api_key=" + apiKey
                        response = await fetch(url)
                        data2 = await response.json()

                        if (hayenemigo == 1) {
                            conexion.query("DELETE FROM infoPartidas WHERE idPartida = ?", numeroPartidas[i], function (error, results, fields) {
                                if (error) {
                                    throw error
                                }
                            })
                            console.log("uno")

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
                                    0,
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
                            } catch (error) {
                                console.log(error)
                            }

                        }
                    } catch {
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
                    numeroPartidas.push(data[i])
                }
                console.log(data)
                for (var i = 0; i < numeroPartidas.length; i++) {
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
                            console.log("pensando")
                            try {
                                console.log("hey")
                                conexion.query("INSERT INTO infoPartidas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numeroPartidas[i],
                                data["info"]["participants"][numeroRival]["summonerId"],
                                data["info"]["participants"][numeroRival]["assists"],
                                data["info"]["participants"][numeroRival]["baronKills"],
                                data["info"]["participants"][numeroRival]["challenges"]["buffsStolen"],
                                data["info"]["participants"][numeroRival]["challenges"]["controlWardsPlaced"],
                                data["info"]["participants"][numeroRival]["challenges"]["damagePerMinute"],
                                data["info"]["participants"][numeroRival]["challenges"]["dodgeSkillShotsSmallWindow"],
                                data["info"]["participants"][numeroRival]["challenges"]["dragonTakedowns"],
                                    0,
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
                            } catch {

                            }

                        }
                    } catch {
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