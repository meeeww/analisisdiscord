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
            option.setName("idpartida")
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

        let fecha = new Date()

        let equipo = interaction.options.get("equipo").value
        let equipoRival = interaction.options.get("rival").value
        let idPartida = interaction.options.get("idpartida").value
        let lado = interaction.options.get("lado").value

        let jugadores = []
        let equipoNumero = 0
        let equipoNumeroRival = 1
        let seguir = false

        console.log(lado)
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
        console.log(equipoNumero)

        url = "https://europe.api.riotgames.com/lol/match/v5/matches/" + idPartida + "?api_key=" + apiKey
        response = await fetch(url)
        console.log(url)
        data = await response.json()
        console.log(data["info"]["teams"][equipoNumero])

        let almaConseguida = 0
        let dosHeraldos = 0
        if (data["info"]["teams"][equipoNumero]["objectives"]["dragon"]["kills"] >= 4) {
            almaConseguida = 1
        }
        if (data["info"]["teams"][equipoNumero]["objectives"]["riftHerald"]["kills"] >= 2) {
            dosHeraldos = 1
        }
        //vision
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
            if (visionScore2 <= visionScore) {
                wardControl = 1
            }
        }
        //objectivesstolen
        let objectivesScore
        let objectivesScore2
        let objectivesStolen = 0
        for (var i = 0; i < 10; i++) {
            if (i <= 4) {
                objectivesScore = objectivesScore + data["info"]["participants"][i]["visionScore"]
            } else if (i >= 5) {
                objectivesScore2 = objectivesScore2 + data["info"]["participants"][i]["visionScore"]
            }
        }
        if (equipoNumero == 0) {
            if (objectivesScore >= objectivesScore2) {
                objectivesStolen = 1
            }
        } else if (equipoNumero == 1) {
            if (objectivesScore2 <= objectivesScore) {
                objectivesStolen = 1
            }
        }
        //cc dealt
        let ccScore
        let ccScore2
        let ccDealt = 0
        for (var i = 0; i < 10; i++) {
            if (i <= 4) {
                ccScore = ccScore + data["info"]["participants"][i]["visionScore"]
            } else if (i >= 5) {
                ccScore2 = ccScore2 + data["info"]["participants"][i]["visionScore"]
            }
        }
        if (equipoNumero == 0) {
            if (ccScore >= ccScore2) {
                ccDealt = 1
            }
        } else if (equipoNumero == 1) {
            if (ccScore <= ccScore2) {
                ccDealt = 1
            }
        }
        console.log(ccScore + " > " + ccScore2)
        //////conseguir shotcaller
        let top = 0
        let jungla = 0
        let mid = 0
        let adc = 0
        let supp = 0

        for (let i = 0; i < jugadores.length; i++) {
            console.log(jugadores[i])
            switch (jugadores[i]) {
                case "0":
                case "5":
                    top = top + data["info"]["participants"][jugadores[i]]["allInPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["baitPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["basicPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["commandPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["holdPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    top = top + data["info"]["participants"][jugadores[i]]["pushPings"]
                    console.log(data["info"]["participants"][jugadores[i]]["pushPings"])
                    console.log(top)
                    break
                case "1":
                case "6":
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["allInPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["baitPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["basicPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["commandPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["holdPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["pushPings"]
                    jungla = jungla + data["info"]["participants"][jugadores[i]]["visionClearedPings"]
                    break
                case "2":
                case "7":
                    mid = mid + data["info"]["participants"][jugadores[i]]["allInPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["baitPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["basicPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["commandPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["holdPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["pushPings"]
                    mid = mid + data["info"]["participants"][jugadores[i]]["visionClearedPings"]
                    break
                case "3":
                case "8":
                    adc = adc + data["info"]["participants"][jugadores[i]]["allInPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["baitPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["basicPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["commandPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["holdPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["pushPings"]
                    adc = adc + data["info"]["participants"][jugadores[i]]["visionClearedPings"]
                    break
                case "4":
                case "9":
                    supp = supp + data["info"]["participants"][jugadores[i]]["allInPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["baitPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["basicPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["commandPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["holdPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["pushPings"]
                    supp = supp + data["info"]["participants"][jugadores[i]]["visionClearedPings"]
                    break
            }
        }
        let shotcaller = "NADIE"

        console.log(top + ">" + supp)
        if (top >= jungla && top >= mid && top >= adc && top >= supp) {
            shotcaller = "TOP"
        } else if (jungla >= top && jungla >= mid && jungla >= adc && jungla >= supp) {
            shotcaller = "JUNGLA"
        } else if (mid >= top && mid >= jungla && mid >= adc && mid >= supp) {
            shotcaller = "MID"
        } else if (adc >= top && adc >= jungla && adc >= mid && adc >= supp) {
            shotcaller = "ADC"
        } else if (supp >= top && supp >= jungla && supp >= adc && supp >= adc) {
            shotcaller = "SUPP"
        }


        conexion.query("INSERT INTO infoEquipos VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
            idPartida,
            equipo,
            data["info"]["teams"][equipoNumero]["win"],
            data["info"]["gameDuration"],
            almaConseguida,//6
            dosHeraldos,
            data["info"]["teams"][equipoNumero]["objectives"]["champion"]["first"],
            data["info"]["teams"][equipoNumero]["objectives"]["tower"]["first"],
            wardControl,
            data["info"]["teams"][equipoNumero]["objectives"]["champion"]["kills"],
            data["info"]["teams"][equipoNumeroRival]["objectives"]["champion"]["kills"],//deaths
            data["info"]["teams"][equipoNumero]["objectives"]["tower"]["kills"],//torres
            data["info"]["teams"][equipoNumero]["objectives"]["dragon"]["kills"],//dragones
            data["info"]["teams"][equipoNumero]["objectives"]["baron"]["kills"],//nashors
            data["info"]["teams"][equipoNumero]["objectives"]["riftHerald"]["kills"],//heraldos

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
            objectivesStolen,
            ccDealt,
            shotcaller
        ], function (error, results, fields) {
            console.log("sent!")
            if (error) {
                throw error
            }
        })

        console.log("sent")

        conexion.query("INSERT INTO `eventos` (`servidor`, `peticion`, `jugador`, `estado`, `fecha`) VALUES ('" + servidor + "', 'Analizar Equipo', '" + data.name + "', 'COMPLETADO', '" + fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate() + "')", function (error, results, fields) {
            if (error) {
                throw error
            }
        })
        interaction.channel.send("Listo. Ahora haz un /analizarmatchups o /actualizarpartidas").then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
        return interaction.reply("Listo.")
    }
}