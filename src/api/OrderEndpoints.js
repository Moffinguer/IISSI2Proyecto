import { get, post } from './helpers/ApiRequestsHelper'

function getOrders () {
  return get('/orders')
}

function getDetails (id) {
  return get(`orders/${id}`)
}

function create (data) {
  return post('orders', data)
}

export { getOrders, getDetails, create }
