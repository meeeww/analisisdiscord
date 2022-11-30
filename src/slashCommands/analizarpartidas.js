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

        conexion.query("SELECT * FROM `partidas` WHERE idJugador = ?", idJugador, function (error, results, fields) {
            if (error) {
                throw error
            } else {
                results.forEach(fila => {
                    if (fila.idJugador == idJugador) {
                        numeroPartidas.push[fila.idPartida]
                    }
                });
            }
        })
        //////insertar jugadores finalizado, iniciando rankeds
        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Partidas', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + fecha.getMonth() + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        console.log(data)
        for (var i = 0; i < numeroPartidasRanked.length; i++) {
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
                    console.log("uno")
                }
            } catch {
            }
        }
        //////tourneys finalizado
        conexion.end()
        return interaction.reply("El jugador **" + jugador.value + "** ha sido insertado correctamente.")
    }
}