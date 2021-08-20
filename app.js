//Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
//Config 
    //session
        app.use(session({ 
            secret: "XBRND",
            resave: true, 
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware       
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg  = req.flash('error_msg')
            next()
        })    
    //Body-parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('            ')
            console.log("********************************* ")
            console.log("Conectado com o bando de dados!!! ")
            console.log("********************************* ")
        }).catch((err)=>{
            console.log('            ')
            console.log("********************************* ")
            console.log("             Erro ")
            console.log("********************************* ")
            console.log('                 ')
            console.log(err)
        }) 
    //Public
        app.use(express.static(path.join(__dirname, "public"))) 
    
//Rotas
    app.use('/admin', admin)


//Outros
const   PORT = 8081
app.listen(PORT, ()=>{
    console.log('Server runnig in http://localhost:'+PORT)
})