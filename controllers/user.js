`use strict`

const mongoose = require(`mongoose`)
const User = require(`../models/user`)
const services = require(`../services`)
const { Server } = require("mongodb")
const bodyParser = require("body-parser")
const user = require("../models/user")
const { json } = require("body-parser")
const { render } = require("../app")
var token

function signUp (req, res){
    const user = new User({
        email : req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
    })

    user.avatar = user.gravatar()

    user.save((err)  =>  {
        if (err) res.status(500).send({ message: `Error al crear el usuario ${err}`})

        return res.status(200).send({ token: services.createToken(user) , message: `Se ha creado el usuario`})
    })
}

function signIn (req, res){

  console.log('Tratando de loguear con req: ', req.body.email)

    User.findOne({ email: req.body.email }, (err, user) => {

      if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
      if (!user) return res.status(404).send({ msg: `no existe el usuario: ${req.body.email}` })
  
      return user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
        if (!isMatch) return res.status(404).send({ msg: `Error de contraseña: ${req.body.email}` })
  
        req.user = user
        token = services.createToken(user)
        console.log(`El token es: ` +token)
        user.token = token
        return res.status(200).send({ message: `Logueado y token creado`, token})
      });
  
    }).select('_id email +password');
  }

function showToken(req,res) {
  console.log(token)
  return res.status(200).send({  message: `Tu token es  ${token}`})
}

module.exports = {
    signUp,
    signIn,
    showToken
}