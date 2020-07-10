`use strict`

const mongoose = require(`mongoose`)
const Schema = mongoose.Schema
const bcrypt = require(`bcrypt-nodejs`)
const crypto = require(`crypto`)

const userSchema = new Schema ({
    email: { type: String, unique: true, lowercase: true},
    displayName : String,
    avatar: String,
    password: { type: String, select: false },
    signupDate: { type: Date, default: Date.now() },
    lastLogin: Date,
    token: String
})

userSchema.pre(`save`, function (next) {
    if(!this.isModified(`password`)) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next()

        bcrypt.hash(this.password, salt, null, (err, hash) => {
            if (err) return next()

            this.password = hash
            next()
        })
    })
})

userSchema.methods.gravatar = function (size) {
    if (!size){
        size= 200;
    }
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

    const md5 = crypto.createHash(`md5`).update(this.email).digest(`hex`)
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch)
    });
  }

module.exports = mongoose.model( `User`, userSchema)