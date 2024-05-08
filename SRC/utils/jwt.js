import jwt from 'jsonwebtoken'

// Función que recibe a un objeto usuario, y devuelve un Token encriptado con la
// contraseña indicada, y que expira en el tiempo indicado

const generateToken = (user) => {

    const privateKey = 'coderhouse'
    const expiracyTime = '12h'

    // Recibe: Quién recibe el token (usuario), la clave privada y el tiempo de expiración
    const token = jwt.sign({user}, privateKey, {expiresIn: expiracyTime})
    return token // Devuelve un TOKEN encriptado, que dura 12 horas. 
}

export default generateToken

// Ejempo de token generado

// console.log(generateToken({
//     _id: '662a7a28808507063f7d2a92',
//     first_name: 'Fernando',
//     last_name: "Guriaga",
//     age: 55,
//     email: "fernandoguriaga@gmail.com",
//     password: "fernando123guriaga456",
//     category: "Standard_User",
//     __v: 0
// }))

