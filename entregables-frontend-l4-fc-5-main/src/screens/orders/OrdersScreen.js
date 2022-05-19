import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, Pressable, FlatList } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { getOrders } from '../../api/OrderEndpoints'
import { getRestaurants } from '../../api/RestaurantEndpoints'
import { showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../../context/AuthorizationContext'
export default function OrdersScreen ({ navigation, route }) {
  const [myOrders, setMyOrders] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  const [restaurants, setRestaurants] = useState([])

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
    async function fetchOrders () {
      try {
        const fetchedOrders = await getOrders()
        setMyOrders(fetchedOrders)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving orders. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    if (loggedInUser) {
      fetchOrders()
      fetchRestaurants()
    } else {
      setMyOrders(null)
    }
  }, [route])

  const getRestaurantName = (id) => {
    for (const restaurant of restaurants) {
      if (restaurant.id === id) {
        return restaurant.name
      }
    }
    return null
  }

  const renderOrder = ({ item }) => {
    return (
      < View style={styles.container} >
        <TextSemiBold numberOfLines={5} style={{ fontSize: 25 }}>{getRestaurantName(item.restaurantId)}</TextSemiBold>
        <TextRegular>{'Sent at: ' + (!item.sentAt ? 'The order was not sent yet' : item.sentAt.split('T')[0])}</TextRegular>
        <TextRegular>{'Delivered at: ' + (!item.deliveredAt ? 'The order was not delivered yet' : item.deliveredAt.split('T')[0])}</TextRegular>
        <TextRegular>{'Total price: ' + ((item.price + item.shippingCosts).toFixed(2)) + '€'}</TextRegular>
        <TextRegular>{'State: ' + (item.status)}</TextRegular>
        <Pressable
          onPress={() => {
            navigation.navigate('OrderDetailScreen', { id: item.id })
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button
          ]}
        >
          <TextRegular textStyle={styles.text}>Check Products</TextRegular>
        </Pressable>
      </View >
    )
  }
  const emptyOrders = () => {
    return (
      <View style={styles.container}><TextRegular>There are no orders to show</TextRegular></View>
    )
  }
  return (
    <FlatList
      ListEmptyComponent={emptyOrders}
      style={styles.container}
      data={myOrders}
      renderItem={renderOrder}
      keyExtractor={item => item.id.toString()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    fontWeight: '20%'
  }
})
