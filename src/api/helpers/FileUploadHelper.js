import { Platform } from 'react-native'
import * as mime from 'react-native-mime-types'

// Returns {name:fileName, fileObject:file}
const normalizeFile = (file) => {
  if (Platform.OS === 'web') {
    const fileName = file.uri.split('/').pop()
    const imageType = file.uri.split(',')[0].split(':')[1].split(';')[0]
    const byteString = atob(file.uri.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const arr = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) { arr[i] = byteString.charCodeAt(i) }
    const blob = new Blob([arr], {
      type: imageType
    })
    return {
      name: file.paramName,
      fileObject: new File([blob], `${fileName}.${mime.extension(imageType)}`, {
        type: imageType
      })
    }
  } else {
    return {
      name: file.paramName,
      fileObject: {
        name: file.uri.slice(-20),
        type: mime.lookup(file.uri),
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri
      }
    }
  }
}

const getDataWithoutBodyFiles = (dataWithFiles) => {
  const data = { ...dataWithFiles }
  Object.keys(data).filter(key => data[key] && data[key].uri).forEach(key => delete data[key])
  return data
}

const getFilesFromData = (data) => {
  return Object.keys(data).filter(key => data[key] && data[key].uri && data[key].height).map(key => { // data[key].height para ver si viene del image picker
    data[key].paramName = key
    return data[key]
  })
}

function constructFormData (files, dataWithoutFiles) {
  const formData = new FormData()
  files.forEach(file => {
    const normalizedFile = normalizeFile(file)
    formData.append(normalizedFile.name, normalizedFile.fileObject)
  })
  Object.keys(dataWithoutFiles).forEach((key) => {
    formData.append(key, dataWithoutFiles[key])
  })
  return formData
}

function getMultiPartHeader () {
  return {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8; boundary="separation between parts";'
    }
  }
}

function prepareData (preparedData) {
  let config
  const files = getFilesFromData(preparedData)
  if (files && files.length) {
    preparedData = constructFormData(files, getDataWithoutBodyFiles(preparedData))
    config = getMultiPartHeader()
  }
  return { config, preparedData }
}

export { normalizeFile, getDataWithoutBodyFiles, getFilesFromData, constructFormData, getMultiPartHeader, prepareData }
