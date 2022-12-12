module.exports = async (client, interaction) => {
    if(!interaction.guild || !interaction.channel) return

    const COMANDO = client.slashCommands.get(interaction?.commandName)

    if(COMANDO){
        if(COMANDO.OWNER){
            const OWNERS = process.env.OWNER_IDS.split(" ")
            if(!OWNERS.includes(interaction.user.id)) return interaction.reply({content: "Solo los dueños pueden ejecutar el comando"})
        }

        try{
            let servidor = "zas"
            console.log(interaction.guild.id)
            switch(interaction.guild.id){
                case "1045683353132748810":
                    servidor = "Servidor de Pruebas"
                    break
                default:
                    servidor = "No reconocido. " + interaction.guild.id
                    break
            }
            //1045683353132748810
            COMANDO.execute(client, interaction, "/", servidor)
        } catch(e) {
            interaction.reply({content: "Ha habido un error al ejecutar el comando. Revisa la consola"})
            console.log(e)
        }

    }
}