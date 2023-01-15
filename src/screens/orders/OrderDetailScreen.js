/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { getDetails } from '../../api/OrderEndpoints'

export default function OrderDetailScreen ({ navigation, route }) {
  const [myOrder, setMyOrder] = useState([])
  const id = route.params.id
  useEffect(() => {
    // TODO: Fetch all restaurants and set them to state.
    //      Notice that it is not required to be logged in.
    async function fetchOrders () {
      try {
        const fetchedOrders = await getDetails(id)
        setMyOrder(fetchedOrders)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving order. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchOrders()
  }, [route])

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
      </ImageCard>
    )
  }

  return (
    <View>
      <Text style={styles.text}>{'Los productos del pedido ' + id + ' son: '}</Text>
      <FlatList
        style={styles.container}
        data={myOrder.products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: brandSecondary
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    paddingTop: '5%',
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    marginLeft: 5
  }
})
