import passport from "passport"
import localStrat from "passport-local"
import jwtStrat from "passport-jwt"
import { ExtractJwt } from "passport-jwt"
import bcrypt from "bcryptjs"

const db = require("../../models")
import { userType } from "../utils/types"

const LocalStrategy = localStrat.Strategy
const JwtStrategy = jwtStrat.Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      return db.User.findOne({
        where: { email: username },
      }).then((user: userType) => {
        if (!user) {
          return done(null, false, { message: "Incorrect email!" })
        }
        return bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) {
            return done(null, false, {message: 'Incorrect password!'})
            }
            return done(null, user)
        })
      })
        .catch((err: Error) => {
        return done(err)
      })
    }
  )
)

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_JWT_SECRET
},
  function (jwt_payload, done) {
    return db.User.findOne({
      where: { id: jwt_payload.userId }
    })
      .then((user: userType) => {
        if (user) {
        return done(null, user)
        } else {
          return done(null, false)
      }
      })
      .catch((err: Error) => {
      return done(err, false)
    })
  }))

export default passport
