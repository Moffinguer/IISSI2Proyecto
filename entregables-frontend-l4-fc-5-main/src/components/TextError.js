import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { brandPrimary } from '../styles/GlobalStyles'
export default function TextError (props) {
  return (
          <Text style={[styles.text, props.textStyle]}>
            {props.children}
          </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: brandPrimary,
    textAlign: 'center'
  }
})
