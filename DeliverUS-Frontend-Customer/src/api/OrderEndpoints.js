import { get, destroy, post, put } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('/orders')
}

function remove (id) {
  return destroy(`orders/${id}`)
}
function getOrderDetail (id) {
  return get(`orders/${id}`)
}
function create (data) {
  return post('orders', data)
}

function update (id, data) {
  return put(`orders/${id}`, data)
}
export { getAll, remove, getOrderDetail, create, update }
