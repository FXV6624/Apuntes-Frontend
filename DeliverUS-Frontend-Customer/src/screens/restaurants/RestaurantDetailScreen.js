/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import { create } from '../../api/OrderEndpoints'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import defaultProductImage from '../../../assets/product.jpeg'
import { API_BASE_URL } from '@env'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import DeleteModal from '../../components/DeleteModal'
import ConfirmationModal from '../../components/ConfirmationModal'

export default function RestaurantDetailScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const { loggedInUser } = useContext(AuthorizationContext)
  const [productsForOrder, setProducts] = useState({})
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const [orderToBeConfirmed, setOrderToBeConfirmed] = useState(null)

  useEffect(() => {
    fetchRestaurantDetail()
  }, [route])

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.id)
      setRestaurant(fetchedRestaurant)
      const p = new Map()
      console.log(fetchedRestaurant.products)
      fetchedRestaurant.products.forEach(element => {
        p.set(element.id, {
          quantity: 0,
          unityPrice: element.price
        })
      })
      setProducts(p)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
      <>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
          {restaurant.products?.length > 0 &&
          <View style={styles.actionButtonsContainer2}>
              <Pressable
                onPress={() => {
                  if (loggedInUser) {
                    let productQuantity = 0
                    productsForOrder.forEach((value) => { productQuantity += value.quantity })
                    if (productQuantity > 0) {
                      setOrderToBeConfirmed(true)
                    } else {
                      showMessage({
                        message: 'You must select at least one product',
                        type: 'error',
                        style: GlobalStyles.flashStyle,
                        titleStyle: GlobalStyles.flashTextStyle
                      })
                    }
                  } else {
                    showMessage({
                      message: 'You must be logged in',
                      type: 'error',
                      style: GlobalStyles.flashStyle,
                      titleStyle: GlobalStyles.flashTextStyle
                    })
                    navigation.navigate('Profile', {
                      screen: 'LoginScreen'
                    })
                  }
                }
              }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandGreenTap
                      : GlobalStyles.brandGreen
                  },
                  styles.actionButton2
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='truck-delivery' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Create Order
                </TextRegular>
              </View>
            </Pressable>

            <Pressable
                onPress={() => { setOrderToBeDeleted(true) } }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.actionButton2
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Delete Order
                </TextRegular>
              </View>
            </Pressable>
            </View> }
        </ImageBackground>
      </>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        {!item.availability &&
          <TextRegular textStyle={styles.availability }>Not available</TextRegular>
  }
  {item.availability &&
          <View style={styles.actionButtonsContainer}>
            <Pressable
            onPress={() => {
              const p = new Map(productsForOrder)
              const cantidadActual = p.get(item.id).quantity
              p.set(item.id, {
                quantity: cantidadActual + 1,
                unityPrice: item.price
              })
              setProducts(p)
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandBlueTap
                  : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='plus-box-outline' color={'white'} size={20}/>
          </View>
        </Pressable>
          <TextSemiBold> { productsForOrder.get(item.id).quantity} </TextSemiBold>
        <Pressable
            onPress={() => {
              const p = new Map(productsForOrder)
              const cantidadActual = p.get(item.id).quantity
              if (cantidadActual > 0) {
                p.set(item.id, {
                  quantity: cantidadActual - 1,
                  unityPrice: item.price
                })
              }
              setProducts(p)
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='minus-box-outline' color={'white'} size={20}/>
          </View>
        </Pressable>
        </View>
       }
      </ImageCard>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  const createOrder = async () => {
    try {
      const parsedProducts = []
      productsForOrder.forEach((value, key) => {
        if (value.quantity > 0) {
          parsedProducts.push({
            productId: key,
            quantity: value.quantity
          })
        }
      })
      const order = {
        address: loggedInUser?.address,
        restaurantId: restaurant.id,
        userId: loggedInUser?.id,
        products: parsedProducts
      }
      console.log('Order to send:', JSON.stringify(order, null, 2))
      await create(order)
      showMessage({
        message: 'Order succesfully create',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      showMessage({
        message: `order could not be created. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const calculatePrice = () => {
    let total = 0
    productsForOrder.forEach(element => {
      total += element.unityPrice * element.quantity
    })
    total += restaurant.shippingCosts
    return (total)
  }

  return (
    <>
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <DeleteModal
                isVisible={orderToBeDeleted !== null}
                onCancel={ () => setOrderToBeDeleted(null)}
                onConfirm={ () => {
                  fetchRestaurantDetail()
                  setOrderToBeDeleted(null)
                }}>
              </DeleteModal>
              <ConfirmationModal
                isVisible={orderToBeConfirmed !== null}
                onCancel={() => setOrderToBeConfirmed(null)}
                onConfirm={async () => {
                  await createOrder()
                  await fetchRestaurantDetail()
                  setOrderToBeConfirmed(null)
                  console.log(orderToBeConfirmed)
                  navigation.navigate('My Orders', {
                    screen: 'OrdersScreen'
                  })
                }}>
                  <TextSemiBold textStyle={styles.price}><TextRegular textStyle={ { color: 'black' }}>ShippingCosts: </TextRegular>{restaurant.shippingCosts?.toFixed(2)}€</TextSemiBold>
                  <TextSemiBold textStyle={styles.price}><TextRegular textStyle={ { color: 'black' }}>Total Price: </TextRegular>{productsForOrder.size > 0 ? calculatePrice() : 0}€</TextSemiBold>
                  <TextSemiBold textStyle={{ color: 'black' }}><TextRegular>Adress: </TextRegular> {loggedInUser?.address}</TextSemiBold>
              </ConfirmationModal>
        </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 30,
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
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  availability: {
    textAlign: 'right',
    marginRight: 5,
    color: GlobalStyles.brandSecondary
  },
  actionButton: {
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: 80
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'relative',
    width: '90%',
    left: '1200px'
  },
  actionButton2: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 15,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '48%'
  },
  actionButtonsContainer2: {
    flexDirection: 'row',
    bottom: 5,
    position: 'relative',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'white'
  }
})
