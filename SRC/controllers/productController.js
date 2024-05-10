import { productModel } from "../models/products"

const createProduct = async(new_product) => {
    let my_product = await productModel.create(new_product)
    my_product = await productModel.findById(my_product._id.toString()).lean()
    return my_product
}

const deleteProduct = async(product_code) => {
    await productModel.findByIdAndDelete(product_code)
}

const updateProduct = async (product_code, updated_product) => {
    let my_product = await productModel.findByIdAndUpdate(product_code, updated_product, {new: 'true'}).lean()
    return my_product
}

const readProduct = async(product_code) => {
    const my_product = await productModel.findById(product_code).lean()
    return my_product
}

export {createProduct, deleteProduct, updateProduct, readProduct}