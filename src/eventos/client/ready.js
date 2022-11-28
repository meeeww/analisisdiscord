module.exports = client => {
    console.log("Sesion iniciada" + client.user.tag)

    if(client?.application?.commands){
        client.application.commands.set(client.slashArray)
        console.log("Cargados " + client.slashCommands.size + " comandos")
    }
}