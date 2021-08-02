// IMPORTACION
const mongoose =  require("mongoose")
const app = require("./app");
var port = 3000;

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://root:root@backenddb.mmwrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Se encuentra conectado a la base de datos');

    app.listen(process.env.PORT || port, function () {
        console.log("Servidor corriendo en el puerto " + port);
    })
}).catch((err) => console.log('Error de conexión a la base de datos', err))
