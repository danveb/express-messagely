const express = require('express') 
const router = new express.Router() 
const ExpressError = require('../expressError')
const jwt = require('jsonwebtoken') 
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config') 
const User = require('../models/user')

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        // extract username,password from req.body
        const { username, password } = req.body 
        // if User is authenticated with username, password 
        if(await User.authenticate(username, password)) {
            // sign token 
            let token = jwt.sign({username}, SECRET_KEY)
            // updates timestamp with method from class User 
            User.updateLoginTimestamp(username)
            // return the token 
            return res.json({token}) 
        } else {
            throw new ExpressError('Invalid username/password', 400) 
        }
    } catch(err) {
        return next(err) 
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    try {
        // extract username, password, first_name, last_name, phone from req.body
        const { username, password, first_name, last_name, phone } = req.body 
        // User.authenticate
        const user = await User.register({ username, password, first_name, last_name, phone })
        // sign token 
        let token = jwt.sign({username}, SECRET_KEY)
        // return the token 
        return res.json({token})
    } catch(err) {
        return next(err) 
    }
})

module.exports = router 