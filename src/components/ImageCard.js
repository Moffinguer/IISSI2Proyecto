// import { Badge, Flex } from '@ant-design/react-native'
import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import TextSemiBold from './TextSemibold'
import { brandBackground, brandPrimaryTap } from '../styles/GlobalStyles'

// Props: defaultImageUri: {uri: xxx}, imageUri: {uri: xxx}, onPress: () => {}, title: String, badgeText: String, touchable: boolean
// Style props: cardStyle, imageContainerStyle, imageStyle, bodyStyle, titleStyle
export default function ImageCard (props) {
  const renderImageCardBody = (props) => {
    return (
      <View style={styles.card} >
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={props.imageUri} />
        </View>
        <View style={styles.cardBody}>
            <TextSemiBold textStyle={styles.cardTitle}>{props.title}</TextSemiBold>
            {props.children}
        </View>
      </View>
    )
  }

  return (
    props.onPress
      ? <Pressable onPress={props.onPress} style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? brandPrimaryTap
            : brandBackground
        },
        styles.wrapperCustom
      ]}>
          {renderImageCardBody(props)}
        </Pressable>
      : <>
          {renderImageCardBody(props)}
        </>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    height: 127,
    padding: 2,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  imageContainer: {
    flex: 2
  },
  image: {
    height: 123,
    width: 123
  },
  cardBody: {
    padding: 5,
    flex: 4
  },
  cardTitle: {
    fontSize: 15
  }
})
