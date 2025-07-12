import { check } from 'express-validator'
import { Order, Product, Restaurant } from '../../models/models.js'

const existsRestaurant = async (value, { req }) => {
  try {
    const r = await Restaurant.findByPk(req.body.restaurantId)
    if (r === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    }
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const quantityProducts = async (value, { req }) => {
  for (const prod of req.body.products) {
    if (prod.quantity <= 0) {
      return Promise.reject(new Error(`Invalid quantity for product ${prod.productId}: ${prod.quantity}. Quantity must be greater than 0.`))
    }
  }
  return true
}

const checkProductsId = async (value, { req }) => {
  for (const prod of req.body.products) {
    if (prod.productId <= 0) {
      return Promise.reject(new Error(`Invalid productId: ${prod.productId}. ProductId must be greater than 0.`))
    }
  }
  return true
}

const checkAvailability = async (value, { req }) => {
  try {
    if (req.body.products === undefined) {
      return Promise.reject(new Error('Order has no products'))
    }
    for (const prod of req.body.products) {
      const p = await Product.findByPk(prod.productId)
      if (p == null) {
        return Promise.reject(new Error(`The productId ${prod.productId} does not exist.`))
      } else {
        if (p.availability === false) {
          return Promise.reject(new Error(`The product ${prod.productId} is not available.`))
        }
      }
    }
    return Promise.resolve()
  } catch (err) {
    console.log(err)
    return Promise.reject(new Error(err))
  }
}

const CheckSameRestaurant = async (value, { req }) => {
  try {
    if (!value) {
      return Promise.reject(new Error('Order has no products'))
    }
    const r = req.body.restaurantId
    for (const prod of value) {
      const p = await Product.findByPk(prod.productId)
      if (r !== p.restaurantId) {
        return Promise.reject(new Error(`The product ${prod.productId} does not belong to the specified restaurant.`))
      }
    }
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkProductsSameRestaurantUpdate = async (value, { req }) => {
  try {
    if (!value) {
      return Promise.reject(new Error('Order has no products'))
    }
    const ord = await Order.findByPk(req.params.orderId, {
      attributes: ['restaurantId']
    })
    for (const prod of value) {
      const p = await Product.findByPk(prod.productId, {
        attributes: ['restaurantId']
      })
      const restaurantId = p.restaurantId
      if (ord.restaurantId !== restaurantId) {
        return Promise.reject(new Error('There are products from different restaurants'))
      }
    }
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const quantityZeroOrNegative = async (value, { req }) => {
  for (const prod of req.body.products) {
    if (prod.quantity <= 0) {
      return Promise.reject(new Error(`Invalid quantity for product ${prod.productId}: ${prod.quantity}. Quantity must be greater than 0.`))
    }
  }
  return true
}

const create = [
  check('address').exists().withMessage('Address is required'),
  check('restaurantId').exists().isInt({ min: 1 }).toInt().withMessage('RestaurantId must be a positive integer'),
  check('restaurantId').custom(existsRestaurant),
  check('products').exists().isArray().withMessage('Order must have at least one product'),
  check('products.*.productId').custom(checkProductsId),
  check('products.*.quantity').custom(quantityProducts),
  check('products').custom(quantityZeroOrNegative),
  check('products').custom(checkAvailability),
  check('products').custom(CheckSameRestaurant)
]

const update = [
  check('address').exists().withMessage('Address is required'),
  check('restaurantId').isEmpty().withMessage('RestaurantId cannot be updated'),
  check('products').exists().isArray().withMessage('Order must have at least one product'),
  check('products.*.productId').custom(checkProductsId),
  check('products.*.quantity').custom(quantityProducts),
  check('products').custom(quantityZeroOrNegative),
  check('products').custom(checkAvailability),
  check('products').custom(checkProductsSameRestaurantUpdate)
]

export { create, update }
