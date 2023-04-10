import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import { generate } from 'generate-password'
import { managerUsers, managerCarts } from '../helpers/managers.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy // Define the strategy

// This its work as a middleware
const initializePassport = () => {
   // Define where apply my statics
   passport.use('register', new LocalStrategy(
      {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
         const {completename, email} = req.body
         try{
            const user = await managerUsers.findUserByEmail(username)
            if(user){
               return done(null, false)
            }
            const passportHash = createHash(password)

            // Create the new cart to assign
            const cartCreated = await managerCarts.addElements()

            const userCreated = await managerUsers.addElements([{
               completename: completename,
               email: email,
               password: passportHash,
               id_cart: cartCreated[0].id
            }])
            // Registro generado!
            return done(null, userCreated)
         }
         catch(error) {
            return done(error)
         }
      }
   ))

   passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
      try{
         const user = await managerUsers.findUserByEmail(username)
         // User not found
         if(!user){
            return done(null, false)
         }
         // Success: user and pass correct
         if(validatePassword(password, user.password)){
            return done(null, user)
         }
         // Invalid password
         return done(null, false)
      }
      catch(error){
         return done(error)
      }
   }))

   passport.use('github', new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email']
   }, async(accessToken, refreshToken, profile, done) => {
      try {
         const user = await managerUsers.findUserByEmail(profile.emails[0].value) // esto es null
         if(user){ // exist user, error
            done(null, user)
         }
         else {
            // Create the new cart to assign
            const cartCreated = await managerCarts.addElements()
            const newPassword = generate({ length: 15, numbers: true }) // needs to pass to the user
            const passportHash = createHash(newPassword)
            const userCreated = await managerUsers.addElements([{
               avatar: profile._json.avatar_url,
               completename: profile._json.name ? profile._json.name : profile._json.login,
               email: profile.emails[0].value,
               id_cart: cartCreated[0].id,
               password: passportHash // Generated
            }])
            done(null, userCreated)
         }
      }
      catch(error){
         return done(error)
      }
   }))

   // User session initialization
   passport.serializeUser((user, done) => {
      if (Array.isArray(user)) {
         const {_id, completename, email, role, id_cart} = user[0]
         done(null, {_id, completename, email, role, id_cart})
      }
      else {
         const {_id, completename, email, role, id_cart} = user
         done(null, {_id, completename, email, role, id_cart})
      }
   })

   // Delete user session
   passport.deserializeUser(async (id, done) => {
      try {
         const user = await managerUsers.getElementById(id)
         done(null, user)
      } catch (error) {
         done(error)
      }
   })
}

export default initializePassport