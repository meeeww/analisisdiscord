module.exports = client => {
    process.removeAllListeners();

    process.on("unhandledRejection", (reason, p) => {
        console.log("AntiCrash - Error Encontrado")
        console.log(reason, p)
    })

    process.on("oncaughtException", (err, origin) => {
        console.log("AntiCrash - Error Encontrado")
        console.log(err, origin)
    })

    process.on("oncaughtExceptionMonitor", (err, origin) => {
        console.log("AntiCrash - Error Encontrado")
        console.log(err, origin)
    })

    process.on("multipleResolves", () => {})
}