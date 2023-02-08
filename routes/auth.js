const router = require('express').Router();
const Joi = require('@hapi/joi')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(225).required(),
    email: Joi.string().min(6).max(225).required().email(),
    password: Joi.string().min(6).max(1024).required(),

})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(225).required().email(),
    password: Joi.string().min(6).max(1024).required(),

})


const tokenSecret = process.env.TOKEN_SECRET;

router.post('/login', async (req, res) => {

    // login validations
    const { error } = schemaLogin.validate(req.body)

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            error: true,
            message: 'User was not found'
        })
    }

    const passValid = await bcrypt.compare(req.body.password, user.password)
    if (!passValid) {
        return res.status(400).json({
            error: true,
            message: 'wrong credendentials'
        })
    }


    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, tokenSecret)

    res.header('auth-token',token).json({
        error:null,
        data:{token}
    })

})

router.post('/register', async (req, res) => {

    // user validations
    const { error } = schemaRegister.validate(req.body)

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const existEmail = await User.findOne({ email: req.body.email })
    if (existEmail) {
        return res.status(400).json({
            error: true,
            message: 'email already taken'
        })
    }

    const salts = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salts)


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    })

    try {

        const userSV = await user.save();
        res.json({
            error: null,
            data: userSV
        })

    } catch (error) {
        res.status(400).json(error)
    }


})

module.exports = router;