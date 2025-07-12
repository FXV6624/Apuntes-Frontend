import { get } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}

function getPopularProducts () {
  return get('/products/popular')
}

function getProductDetail (id) {
  return get(`products/${id}`)
}

export { getProductCategories, getPopularProducts, getProductDetail }
