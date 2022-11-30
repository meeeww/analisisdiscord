const { Client, GatewayIntentBits, Partials, ActivityType, Presence, PresenceUpdateStatus, Collection } = require("discord.js");
const BotUtils = require("./utils");

module.exports = class extends Client{
    constructor(options = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildEmojisAndStickers,
        ],
        partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],

        allowedMentions: {
            parse: ["roles", "users"],
            repliedUser: false,
        },

        presence: {
            activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}],
            status: PresenceUpdateStatus.Online
        },


    }) {
        super({
            ...options
        });

        this.slashCommands = new Collection();
        this.slashArray = [];

        this.utils = new BotUtils(this)

        this.start()
    }

    async start(){
        await this.loadEvents()
        await this.loadHandlers()
        await this.loadSlashCommands()
        

        this.login(process.env.BOT_TOKEN)
    }

    async loadSlashCommands(){
        console.log(`(/) Cargando comandos`)
        await this.slashCommands.clear()
        this.slashArray = []

        const rutaArchivos = await this.utils.loadFiles("/src/slashCommands")

        if(rutaArchivos.length){
            rutaArchivos.forEach((rutaArchivo) => {
                try{
                    const comando = require(rutaArchivo)
                    const nombreComando = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0]
                    comando.CMD.name = nombreComando

                    if(nombreComando) this.slashCommands.set(nombreComando, comando)

                    this.slashArray.push(comando.CMD.toJSON())
                } catch(e) {
                    console.error("Error a cargar el archivo " + rutaArchivo)
                    console.log(e)
                }
            })
        }

        console.log("Se han cargado " + this.slashCommands.size + " comandos")

        if(this?.application?.commands){
            this.application.commands.set(this.slashArray)
            console.log("Cargados" + this.slashCommands.size + " comandos")
        }
    }

    async loadHandlers(){
        console.log(`(+) Cargando comandos`)

        const rutaArchivos = await this.utils.loadFiles("/src/handlers")

        if(rutaArchivos.length){
            rutaArchivos.forEach((rutaArchivo) => {
                try{
                    require(rutaArchivo)(this)
                } catch(e) {
                    console.error("Error a cargar el archivo " + rutaArchivo)
                    console.log(e)
                }
            })
        }

        console.log("Se han cargado " + rutaArchivos.length + " handlers")
    }
    
    async loadEvents(){
        console.log(`(-) Cargando eventos`)
        const rutaArchivos = await this.utils.loadFiles("/src/eventos")
        this.removeAllListeners()

        if(rutaArchivos.length){
            rutaArchivos.forEach((rutaArchivo) => {
                try{
                    const evento = require(rutaArchivo)
                    const nombreEvento = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0]
                    this.on(nombreEvento, evento.bind(null, this))
                } catch(e) {
                    console.error("Error a cargar el archivo " + rutaArchivo)
                    console.log(e)
                }
            })
        }

        console.log("Se han cargado " + rutaArchivos.length + " eventos")
    }
}