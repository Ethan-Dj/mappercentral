const express = require("express")
const router = express.Router()
const db = require('../Database/db.js')

const {_uploadImages, _getAllImages, _register, _login} = require("../controllers/Content.js")

router.get("/images",autheticateToken, _getAllImages);

router.post("/upload", _uploadImages)

router.post("/register", _register)

router.post("/login", _login )

module.exports = router

function autheticateToken(req, res, next) {
    console.log("bugger")
    const token = req.headers.token.substring(0, 37);
    db("users") 
    .select("*")
    .where("token", "like", token + "%")
    .then(data => {
        console.log("shitsticks")
        if (data.length == 0) return res.json(["empty"])
        next()
    })
}