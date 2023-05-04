import passport from "passport"

// General function to return error in to strategy of passport
const passportError = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, (error, user, info) => {
         if (error) {
            return next(error)
         }
         if(!user) {
            // If exists messages property, return messages, else return info.toString()
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized';
            return res.status(401).json({ error: errorMsg });
         }
         req.user = user
         next()
      }) (req, res, next)
   }
}

const authorizationRole = (role) => {
   return async (req, res, next) => {
      if(!req.user) {
         return res.status(401).send({error: 'Unauthorized'})
         // return res.send('401')
      }
      if(req.user.role !== role) {
         return res.status(403).send({error: 'User not authorized'})
         // return res.send('403')
      }
      next()
   }
}

/* const authorizationCartBySelf = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, (error, user, info) => {
         if (error) {
            return next(error)
         }
         if(!user) {
            // If exists messages property, return messages, else return info.toString()
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized';
            return res.status(401).json({ error: errorMsg });
         }
         if(user.id_cart.toString() !== req.params.id) {
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized to see this cart';
            return res.status(401).json({ error: errorMsg });
         }
         req.user = user
         next()
      }) (req, res, next)
   }
} */

export { passportError, authorizationRole }