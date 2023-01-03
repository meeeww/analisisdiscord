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
        console.log(url)
        data = await response.json()

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
        let objectivesScore = 0
        let objectivesScore2 = 0
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
        let ccScore = 0
        let ccScore2 = 0
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
        //////conseguir shotcaller
        let top = 0
        let jungla = 0
        let mid = 0
        let adc = 0
        let supp = 0

        for (let i = 0; i < jugadores.length; i++) {
            switch (jugadores[i]) {
                case "0":
                case "5":
                    if(data["info"]["participants"][jugadores[i]]["allInPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["allInPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["baitPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["baitPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["basicPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["basicPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["commandPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["commandPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["dangerPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyMissingPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyVisionPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["getBackPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["holdPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["holdPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["needVisionPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["onMyWayPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["pushPings"] != undefined ){
                        top = top + data["info"]["participants"][jugadores[i]]["pushPings"]
                    }
                    break
                case "1":
                case "6":
                    if(data["info"]["participants"][jugadores[i]]["allInPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["allInPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["baitPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["baitPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["basicPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["basicPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["commandPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["commandPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["dangerPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyMissingPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyVisionPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["getBackPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["holdPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["holdPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["needVisionPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["onMyWayPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["pushPings"] != undefined ){
                        jungla = jungla + data["info"]["participants"][jugadores[i]]["pushPings"]
                    }
                    break
                case "2":
                case "7":
                    if(data["info"]["participants"][jugadores[i]]["allInPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["allInPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["baitPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["baitPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["basicPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["basicPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["commandPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["commandPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["dangerPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyMissingPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyVisionPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["getBackPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["holdPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["holdPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["needVisionPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["onMyWayPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["pushPings"] != undefined ){
                        mid = mid + data["info"]["participants"][jugadores[i]]["pushPings"]
                    }
                    break
                case "3":
                case "8":
                    if(data["info"]["participants"][jugadores[i]]["allInPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["allInPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["baitPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["baitPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["basicPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["basicPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["commandPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["commandPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["dangerPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyMissingPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyVisionPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["getBackPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["holdPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["holdPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["needVisionPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["onMyWayPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["pushPings"] != undefined ){
                        adc = adc + data["info"]["participants"][jugadores[i]]["pushPings"]
                    }
                    break
                case "4":
                case "9":
                    if(data["info"]["participants"][jugadores[i]]["allInPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["allInPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["baitPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["baitPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["basicPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["basicPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["commandPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["commandPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["dangerPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["dangerPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyMissingPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["enemyMissingPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["enemyVisionPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["enemyVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["getBackPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["getBackPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["holdPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["holdPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["needVisionPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["needVisionPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["onMyWayPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["onMyWayPings"]
                    }
                    if(data["info"]["participants"][jugadores[i]]["pushPings"] != undefined ){
                        supp = supp + data["info"]["participants"][jugadores[i]]["pushPings"]
                    }
                    break
            }
        }
        let shotcaller = "NADIE"

        console.log(top + " top")
        console.log(jungla + " jungla")
        console.log(mid + " mid")
        console.log(adc + " adc")
        console.log(supp + " supp")
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

            0,//data["info"]["teams"][equipoNumero]["bans"][0]["championId"],//firstban
            0,//data["info"]["teams"][equipoNumero]["bans"][1]["championId"],//secondban
            0,//data["info"]["teams"][equipoNumero]["bans"][2]["championId"],//thirdban
            0,//data["info"]["teams"][equipoNumero]["bans"][3]["championId"],//fourthban
            0,//data["info"]["teams"][equipoNumero]["bans"][4]["championId"],//fifthban

            lado,//lado
            equipoRival,//equiporival
            objectivesStolen,
            ccDealt,
            shotcaller
        ], function (error, results, fields) {
            if (error) {
                throw error
            }
        })


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