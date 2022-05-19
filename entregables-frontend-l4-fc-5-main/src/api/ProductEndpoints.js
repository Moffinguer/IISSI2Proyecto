import { get } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}
function getTop3 () {
  return get('/products/popular')
}

export { getProductCategories, getTop3 }
