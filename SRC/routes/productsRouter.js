import { Router } from "express"
import { productModel } from "../models/products.js"
import { userModel } from "../models/users.js"
import { createProduct, deleteProduct, updateProduct, readProduct } from "../controllers/productController.js"

const productsRouter = Router ()

// LECTURA DE TODOS LOS PRODUCTOS
productsRouter.get('/', async (req, res) => {
    const {limit} = req.query // Si no se mandó, tendrá el valor 'undefined'

    let user // Si no tiene una sesión activa, valdrá 'undefined'

    try {
        if (req.session.user.email)
            {
                user = await userModel.findOne({email: req.session.user.email})
            }
    }

    catch (error)
    {
        // Usuario sin identificar
    }

    let user_name // Si no tiene una sesión activa, todas valdrán 'undefined'
    let admin_user
    let standard_user

    if (user)

    {
        user_name = user.first_name
        user.category == "Admin"? (
            admin_user = true,
            standard_user = false
        ):
        (
            admin_user = false,
            standard_user = true
        )
    }

    console.log("Enviando productos al cliente...")

    const my_products = await productModel.find().lean()

    if (my_products.length === 0 ) // Caso de que la DB esté vacía
        res.status(200).render('templates/error', {error_description: "Sin productos por ahora"})
    
    else 

    {
        // En el caso de que la DB no esté vacía, devuelvo la cantidad solicitada
        // O todos los productos en caso que no esté definido el query param limit
        let cantidad_productos_exhibidos
        !limit? cantidad_productos_exhibidos = my_products.length: cantidad_productos_exhibidos = limit

        // Caso de que envíen un límite, pero no sea un número
        isNaN(cantidad_productos_exhibidos) || cantidad_productos_exhibidos < 0? res.status(400).render('templates/error', {error_description: "El límite debe ser numérico y mayor a cero"}): (
            (cantidad_productos_exhibidos > my_products.length) && (cantidad_productos_exhibidos = my_products.length),
            res.status(200).render('templates/home', {title: 'Mis Productos', subtitle: `Cantidad de productos exhibidos: ${cantidad_productos_exhibidos}`, products: my_products.splice(0, cantidad_productos_exhibidos), user: user_name, admin_user: admin_user, standard_user: standard_user}))
    }

    console.log("Productos enviados!")
} )

// LECTURA DE TODOS LOS PRODUCTOS EN MODO PAGINATION
productsRouter.get('/pagination', async (req, res) => {
    
    // Query params que podría recibir. Si no se mandan, tendrán el valor 'undefined'
    let {limit} = req.query 
    !limit && (limit = 10) // Por default será 10

    let {page} = req.query
    !page && (page = 1) // Por default será 1
    
    let {sort} = req.query 
    !sort? (sort = null) : (sort = ({price: sort})) // Por default no los ordenará

    let filters = {}

    let {query_status} = req.query 
    query_status && (filters.status = (query_status == 'true')) // Por default hace una búsqueda general
    
    let {query_category} = req.query
    query_category && (filters.category = query_category) // Por default trae todas las categorías

    const prueba = await productModel.paginate(filters, {limit: limit, page: page, sort: sort})

    res.status(200).send(prueba)

    console.log("Productos enviados!")
} )

// LECTURA DE UN PRODUCTO ESPECÍFICO
productsRouter.get('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto

    // Intento obtenerlo de la DB
    try {
        let my_product = await readProduct(product_code)
        res.status(200).render('templates/home_id', {title: 'Producto Seleccionado:', product: my_product})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto no existe"})
    }
})

// UPDATE DE UN PRODUCTO ESPECÍFICO
productsRouter.put('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto a actualizar
    let updated_product = req.body // Obtengo los valores del producto actualizado

    // Busco por ID, lo actualizo y devuelvo el producto actualizado
    try {
        const my_product = await updateProduct (product_code, updated_product)
        res.status(200).render('templates/home_id', {title: 'Producto Actualizado:', product: my_product})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto a actualizar no existe"})
    }
})

// DELETE DE UN PRODUCTO ESPECÍFICO
productsRouter.delete('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto a eliminar

    try {
        await deleteProduct(product_code)
        res.status(200).send("Producto específico eliminado")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto a eliminar no existe"})
    }
})

// CREATE DE UN PRODUCTO
productsRouter.post('/', async (req, res) => {

    const new_product = req.body // Obtengo el nuevo producto a cargar

    try {
        const my_product = await createProduct (new_product)
        res.status(200).render('templates/home_id', {title: 'Producto Creado:', product: my_product})
    }

    catch (error)

    {
        res.status(500).send("Error al crear producto: ", error)
    }
})

export default productsRouter