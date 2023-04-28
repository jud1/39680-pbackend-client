import cartsModel from '../models/cartsModel.js'

// Create one
const createCart = async () => {
   try {
      const newCart = new cartsModel()
      await newCart.save()
      return newCart
   }
   catch (error) {
      return error
   }
}

const findCart = async id => {
   try {
      const cart = await cartsModel.findById(id)
      return cart
   }
   catch (error) {
      return error
   }
}

const findCarts = async () => {
   try {
      const carts = await cartsModel.find()
      return carts
   }
   catch (error) {
      return error
   }
}

const addProduct = async (id, product) => {
   try {
      const cart = await cartsModel.findById(id)
      const exixstingProduct = cart.products.some(item=>item.product.toString()===product)

      // Doesn't exist
      if(!exixstingProduct) cart.products.push({product, quantity: 1})
      
      // Exists, add quantity
      else cart.products.map(item => item.product.toString()===product ? item.quantity++ : false)
      
      await cartsModel.findByIdAndUpdate(id, cart)
      const updatedCart = await cartsModel.findById(id)
      
      return updatedCart
   }
   catch (error) {
      return error
   }
}

const removeProductOnCart = async (id, product) => {
   try {
      const cart = await cartsModel.findById(id)

      // Exit prevent to execute services if product doesn't exist
      if (cart.products.every(item=>item.product.toString()!==product)) return 'Product not found'

      // Move on
      const updateProducts = cart.products.filter(item=>item.product.toString()!==product)

      await cartsModel.findByIdAndUpdate(id, {products: updateProducts})
      const updatedCart = await cartsModel.findById(id)

      return updatedCart
   }
   catch (error) {
      return error
   }
}

const emptyCart = async id => {
   try {
      await cartsModel.findByIdAndUpdate(id, { products: [] })
      const updatedCart = await cartsModel.findById(id)
      return updatedCart
   }
   catch (error) {
      return error
   }
}


export { createCart, findCart, findCarts, addProduct, removeProductOnCart, emptyCart }