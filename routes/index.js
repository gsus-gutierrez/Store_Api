"use strict"

const express = require ("express")
const productCtrl = require("../controllers/product")
const userCtrl = require(`../controllers/user`)
const api = express.Router()
const auth = require(`../middlewares/auth`)

api.get( "/product", auth, productCtrl.getProducts )                  //AQUI LLAMAMOS LAS FUNCIONES REST DESDE CONTROLLERS/PRODUCT.JS//
api.get( "/product/:productId", productCtrl.getProduct )
api.get("/product", productCtrl.saveProduct )
api.put("/product/:productId", auth,  productCtrl.updateProduct )
api.delete("/product/:productId", auth, productCtrl.deleteProduct )
api.post(`/signup`, userCtrl.signUp)
api.post(`/signin`, userCtrl.signIn)
api.get(`/private`, auth, (req, res) => {
    res.status(200).send({ message: `Tienes acceso`})
})
api.get(`/token`, userCtrl.showToken)

module.exports = api