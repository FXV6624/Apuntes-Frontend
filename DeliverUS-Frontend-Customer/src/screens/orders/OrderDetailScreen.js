/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getOrderDetail } from '../../api/OrderEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { API_BASE_URL } from '@env'

export default function OrderDetailScreen ({ navigation, route }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    fetchOrderDetail()
  }, [route])

  const fetchOrderDetail = async () => {
    try {
      const fetchedOrder = await getOrderDetail(route.params.id)
      setOrder(fetchedOrder)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving order details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(order.restaurant?.heroImage) ? { uri: API_BASE_URL + '/' + order.restaurant?.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{order.restaurant?.name}</TextSemiBold>
            <Image style={styles.image} source={order.restaurant?.logo ? { uri: API_BASE_URL + '/' + order.restaurant?.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{order.restaurant?.restaurantCategory ? order.restaurant?.restaurantCategory.name : ''}</TextRegular>
            <TextSemiBold><TextRegular textStyle={ { color: 'white' }}>ShippingCosts: </TextRegular>{order.shippingCosts?.toFixed(2)}€</TextSemiBold>
            <TextSemiBold><TextRegular textStyle={ { color: 'white' }}>Total Price: </TextRegular>{order.price?.toFixed(2)}€</TextSemiBold>
            <TextSemiBold textStyle={styles.description}><TextRegular>Adress: </TextRegular> {order.address}</TextSemiBold>
            <TextSemiBold textStyle={styles.description}><TextRegular>Status: </TextRegular> {order.status}</TextSemiBold>
          </View>
        </ImageBackground>
      </View>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}><TextRegular>UnityPrice: </TextRegular> {item.OrderProducts.unityPrice.toFixed(2)}€</TextSemiBold>
        <TextSemiBold><TextRegular>Quantity: </TextRegular> {item.OrderProducts.quantity}</TextSemiBold>
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

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyProductsList}
        style={styles.container}
        data={order.products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  }
})
