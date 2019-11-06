const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const User = require('../../models/User');
// const gravtar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');


router.get('/', auth ,  async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Server Error'});
    }
});



router.post('/',[
    check('email','Please include a valid email address').isEmail(),
    check('password','Password is required').exists()
], async (req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }


    const {email, password} = req.body;
    try{

        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }


        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        },(err, token)=>{
            if (err) throw err;
            res.send({token});
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }

    
    
});

module.exports = router;