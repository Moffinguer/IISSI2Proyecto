'use strict'

const defaultMaxFileSize = 10000000

module.exports = {
  checkFileIsImage: (file) => {
    if (typeof file === 'undefined' || // the file doesn't exists
        ['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return 'image' // return "non-falsy" value to indicate valid data"
    } else {
      return false // return "falsy" value to indicate invalid data
    }
  },
  checkFileMaxSize: (file, maxFileSize = defaultMaxFileSize) => {
    if (typeof file === 'undefined' || // the file doesn't exists
            file.size < maxFileSize) { // max size 10Mb
      return 'image' // return "non-falsy" value to indicate valid data"
    } else {
      return false // return "falsy" value to indicate invalid data
    }
  }
}
