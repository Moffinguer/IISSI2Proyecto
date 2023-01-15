import React from 'react'
import { StyleSheet, Text } from 'react-native'
export default function TextSemiBold (props) {
  return (
          <Text style={[styles.text, props.textStyle]}>
            {props.children}
          </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold'
  }
})
