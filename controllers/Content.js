const {getAllImages, uploadImages, register, login} = require("../modules/Content.js")
const { cloudinary } = require('../utils/cloudinary');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const _login = async (req, res) => {
    console.log(req.body.email,"fuck");
    try {
        const result = await login(req.body);
        if (result[0].email == req.body.email){
            const match = await bcrypt.compare(req.body.password, result[0].password)
            if (match == true){
                const email1 = {email: req.body.email }
                const token = jwt.sign(email1, process.env.ACCESS_TOKEN_SECRET)
                res.set('Access-Control-Allow-Origin', 'https://mainkotap.onrender.com');
                res.status(200).json({id:result[0].id, token: token})
            } else {
                res.status(500).json({id: "error"})
            }
        } else {
            res.status(500).json({id: "error"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ id: "error" });
    }
};

const _register = async (req, res) => {
    try {
        const email1 = {email: req.body.email }
        const token = jwt.sign(email1, process.env.ACCESS_TOKEN_SECRET)

        const result = await register(req.body, token);

        res.status(200).json({id:result[0].id, token: token})
    } catch (err) {
      console.log("no", err);
      res.json({ id: "error" });
    }
  };

const _getAllImages = (req,res) => {
    getAllImages(req.headers.id)
    .then(data => {
        res.json(data)
    })
    .catch(err =>
        console.log(err)
    )
}

const _uploadImages = async(req,res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'mapper',
            resource_type: "auto"
        });
        console.log("here")
        const obj = {
            "url": uploadResponse.url,
            "locationname" : req.body.locationName,
            "long": req.body.long,
            "lat": req.body.lat,
            "imgtime": req.body.imgTime,
            "imgtimedisplay":req.body.imgTimeDisplay,
            "journeyname": req.body.journeyName,
            "userid" : req.body.userId
        }
        uploadImages(obj)
        .then(data => {
            res.json({msg:"success"})
        })
        .catch(err =>
            console.log(err)
        )

    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
}

module.exports = {
    _uploadImages,
    _getAllImages,
    _register,
    _login
}