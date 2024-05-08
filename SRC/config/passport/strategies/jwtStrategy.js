import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {userModel} from '../../../models/users.js'

const cookieExtractor = req => {
    const token = req.cookies? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

const jwtOptions = {
    // Cuando el cliente mande el Token JWT, lo hará en el Header usando una palabra reservada
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Anulada por ahora ya que no usaré un browser, sino PostMan
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    // Clave para encriptar y leer los Tokens JWT que se generen en ESTE servidor
    secretOrKey: "coderhouse"
}

// Payload tendrá toda la información correspondiente al usuario
const strategyJWT = new JwtStrategy (jwtOptions, async (payload, done) => {
    try {
        console.log(payload)
        const user = await userModel.findById(payload._id)
        if (!user)
            {
                return done(null, false)
            }
        
        return done (null, user)
    }

    catch (error)

    {
        done(error, null)
    }
})

export default strategyJWT