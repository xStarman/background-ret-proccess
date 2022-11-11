const app = require('./app/server');
const appWs = require('./app/ws-server')
 
const server = app.listen(process.env.WS_PORT || 3000, () => {
    console.log(`App Express is running!`);
})

appWs(server);