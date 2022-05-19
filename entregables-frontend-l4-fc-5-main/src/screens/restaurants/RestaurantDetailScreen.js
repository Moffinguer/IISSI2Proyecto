/* eslint-disable react/prop-types */
import { StyleSheet, View, ScrollView, FlatList, ImageBackground, Image, Pressable, Modal } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { Formik } from 'formik'
import * as yup from 'yup'
import { create } from '../../api/OrderEndpoints'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import React, { useEffect, useState, useContext } from 'react'

export default function RestaurantDetailScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [myProducts, setMyProducts] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  const initialOrdersValues = { address: loggedInUser.address, restaurantId: route.params.id, products: myProducts }
  const [backendErrors, setBackendErrors] = useState()

  const validationSchema = yup.object().shape({
    address: yup
      .string()
      .max(120, 'Address too long')
      .required('Address is required')
  })

  const createOrder = async (values) => {
    setBackendErrors([])
    try {
      const createdOrder = await create(values)
      showMessage({
        message: `Orders ${createdOrder.name} succesfully created`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
      navigation.navigate('RestaurantsScreen', { dirty: true })
    } catch (error) {
      setBackendErrors(error.errors)
    }
  }

  const getTotalPrice = () => {
    let price = 0.0
    for (const myProduct of myProducts) {
      for (const restaurantProduct of restaurant.products) {
        if (myProduct.productId === restaurantProduct.id) {
          price = price + restaurantProduct.price * myProduct.quantity
        }
      }
    }
    return price.toFixed(2)
  }

  useEffect(() => {
    async function fetchRestaurantDetail () {
      try {
        const fetchedRestaurant = await getDetail(route.params.id)
        setRestaurant(fetchedRestaurant)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurantDetail()
  }, [route])

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
        </ImageBackground>
      </View>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        <View style={styles.containerHorizontal}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button2
          ]}
            onPress={() => {
              const tempProducts = [...myProducts]
              const tempProduct = tempProducts.filter(x => x.productId === item.id)[0]
              if (tempProduct !== undefined && tempProduct.quantity > 1) {
                tempProduct.quantity--
              } else if (tempProduct.quantity == 1) {
                tempProducts.splice(tempProducts.indexOf(tempProduct), 1)
              }
              setMyProducts(tempProducts)
            }}
          >
          <TextRegular textStyle = {styles.text2}>-</TextRegular>
        </Pressable>
          <TextRegular textStyle = {{ marginTop: 15, marginLeft: 10 }}>{
          myProducts.filter(x => x.productId === item.id).length === 0 ? 0 : myProducts.filter(x => x.productId === item.id)[0].quantity
          }</TextRegular>
          <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button2
          ]}
            onPress={() => {
              const tempProducts = [...myProducts]
              const tempProduct = tempProducts.filter(x => x.productId === item.id)[0]
              if (tempProduct === undefined) {
                const myProduct = {
                  productId: item.id,
                  name: item.name,
                  quantity: 1
                }
                tempProducts.push(myProduct)
              } else {
                tempProduct.quantity++
              }
              setMyProducts(tempProducts)
            }}
          >
          <TextRegular textStyle = {styles.text2}>+</TextRegular>
          </Pressable>
        </View>
      </ImageCard>
    )
  }
  const renderWantedProducts = (item) => {
    return (<TextRegular>{item.item.name}: {item.item.quantity}Uds</TextRegular>)
  }
  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  return (
    <ScrollView style = {styles.container}>
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <Pressable onPress = {() => {
          if (myProducts.length === 0) {
            showMessage({
              message: 'You have to select products to make an order',
              type: 'error',
              style: flashStyle,
              titleStyle: flashTextStyle
            })
          } else {
            setIsVisible(!isVisible)
          }
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
          <TextRegular textStyle = {styles.text}>Make order</TextRegular>
        </Pressable>
        <Modal
          animationType = {'slide'}
          transparent = {true}
          visible = {isVisible}
        onRequestClose={() => { }}>
          <View style = {styles.modal}>
            <TextRegular textStyle = {{ fontSize: 20 }}>Is this your order?</TextRegular>
            <FlatList
            style={styles.list}
            data={myProducts}
            renderItem={renderWantedProducts}
            keyExtractor={item => item.productId.toString()}
            />
            <TextSemiBold textStyle = {{ fontSize: 16 }}>Total: {getTotalPrice()}€</TextSemiBold>
            <Formik
                style = {styles.container}
                validationSchema={validationSchema}
                initialValues={initialOrdersValues}
                onSubmit={createOrder}>
                {({ handleSubmit, setFieldValue, values }) => (
                <ScrollView>
                  <InputItem
                    name='address'
                    label='Address'
                  />
                  {backendErrors &&
                  backendErrors.map((error, index) => <TextError key={index}>{error.msg}</TextError>)
                  }
                <Pressable
                  onPress={() => {
                    setIsVisible(!isVisible)
                    handleSubmit()
                    navigation.navigate('RestaurantsScreen', { dirty: true })
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
                  <TextRegular textStyle={styles.text}>Confirm</TextRegular>
                </Pressable>
                <Pressable onPress = {() => {
                  setIsVisible(!isVisible)
                  setMyProducts([])
                  navigation.navigate('RestaurantDetailScreen', { dirty: true, id: route.params.id })
                }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? '#85929E'
                        : '#AEB6BF'
                    },
                    styles.button
                  ]}
                >
                <TextRegular
                  textStyle={{
                    color: 'white',
                    fontSize: 16
                  }}>Discard</TextRegular>
              </Pressable>
              </ScrollView>
                )}
            </Formik>
            <Pressable onPress = {() => {
              setIsVisible(!isVisible)
            }}>
              <TextRegular textStyle = {{ textDecorationLine: 'underline' }}>Close</TextRegular>
            </Pressable>
          </View>
        </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1
  },
  containerHorizontal: {
    padding: 5,
    flex: 1,
    flexDirection: 'row'
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
  list: {
    width: '50%',
    height: '15%'
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  button2: {
    borderRadius: 30,
    textAlign: 'center',
    height: 20,
    width: 30,
    marginTop: 12,
    marginLeft: 12,
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
  text2: {
    fontSize: 20,
    color: brandSecondary,
    textAlign: 'center'
  },
  modal: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '60%',
    width: '80%',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginTop: 90,
    marginLeft: '10%'
  }
})
