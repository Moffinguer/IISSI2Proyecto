import React, { useEffect, useState, useContext } from 'react'
import { getRestaurants } from '../../api/RestaurantEndpoints'
import { getTop3 } from '../../api/ProductEndpoints'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import TextSemiBold from '../../components/TextSemibold'
import { showMessage } from 'react-native-flash-message'
import TextRegular from '../../components/TextRegular'
import ImageCard from '../../components/ImageCard'
import { brandPrimary, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    // TODO: Fetch all restaurants and set them to state.
    //      Notice that it is not required to be logged in.
    async function fetchRestaurants () {
      try {
        const fetchedRestaurants = await getRestaurants()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    async function fetchTopProducts () {
      try {
        const fetchedTopProducts = await getTop3()
        setTopProducts(fetchedTopProducts)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving the top 3 products. ${error}`,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurants()
    fetchTopProducts() // TODO: set restaurants to state
  }, [route])
  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : undefined}
        title={item.name}
        onPress={() => {
          if (loggedInUser) {
            navigation.navigate('RestaurantDetailScreen', { id: item.id })
          } else {
            navigation.navigate('RestaurantDetailScreenNoLogin', { id: item.id })
          }
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }
        <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
      </ImageCard>
    )
  }
  const renderTop3 = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={item.price}>{item.price.toFixed(2)}€</TextSemiBold>
        <Pressable
        onPress={() => {
          if (loggedInUser) {
            navigation.navigate('RestaurantDetailScreen', { id: item.restaurantId })
          } else {
            navigation.navigate('RestaurantDetailScreenNoLogin', { id: item.restaurantId })
          }
        }}
        >
          <TextRegular textStyle={{ textDecorationLine: 'underline', color: brandPrimary }}>Go to Restaurant</TextRegular>
        </Pressable>
      </ImageCard>
    )
  }
  const emptyRestaurants = () => {
    return (
      <View style={styles.container}>
        <TextRegular>There are no restaurants in the system</TextRegular>
        <TextRegular>Try another time</TextRegular>
      </View>
    )
  }
  const emptyTop3 = () => {
    return (
      <View style={styles.container}>
        <TextRegular>There are no products to show here</TextRegular>
      </View>
    )
  }
  const listOfRestaurants = () => {
    return (
      <View style={styles.container}>
        <TextSemiBold textStyle={{ fontSize: 30, marginBottom: 10, marginTop: 10 }}>Most popular Products</TextSemiBold>
        <FlatList
          ListEmptyComponent={emptyTop3}
          style={styles.container}
          data={topProducts}
          renderItem={renderTop3}
          keyExtractor={item => item.id.toString()}
        />
        <TextSemiBold textStyle={{ fontSize: 30, marginBottom: 10, marginTop: 10 }}>Restaurants</TextSemiBold>
        < FlatList
          ListEmptyComponent={emptyRestaurants}
          style={styles.container}
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={item => item.id.toString()
          }
        />
      </View >
    )
  }
  return listOfRestaurants()
}
const styles = StyleSheet.create({
  container: {
    flex: 1
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
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
