/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { getAll } from '../../api/RestaurantEndpoints'
import { getPopularProducts } from '../../api/ProductEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import { API_BASE_URL } from '@env'
import defaultProductImage from '../../../assets/product.jpeg'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await getAll()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    const fetchPopularProducts = async () => {
      try {
        const fetchedProducts = await getPopularProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving top Products. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurants()
    fetchPopularProducts()
  }, [route])

  const renderRestaurant = ({ item }) => {
    return (
        <ImageCard
          imageUri={item.logo ? { uri: API_BASE_URL + '/' + item.logo } : restaurantLogo}
          title={item.name}
          onPress={() => {
            navigation.navigate('RestaurantDetailScreen', { id: item.id })
          }}
        >
          <TextRegular numberOfLines={2}>{item.description}</TextRegular>
          {item.averageServiceMinutes !== null &&
            <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
          }
          <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
        </ImageCard>
    )
  }

  const renderProducts = ({ item }) => {
    return (
        <ImageCard
        imageUri={item.image ? { uri: API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
          onPress={() => {
            navigation.navigate('RestaurantDetailScreen', { id: item.restaurantId })
          }}
        >
          <TextRegular numberOfLines={2}>{item.description}</TextRegular>
          <TextSemiBold>Price: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.price.toFixed(2)}€</TextSemiBold></TextSemiBold>
        </ImageCard>
    )
  }

  const renderEmptyRestaurantsList = () => {
    return (
        <TextRegular textStyle={styles.emptyList}>
          No restaurants were retreived.
        </TextRegular>
    )
  }
  const renderEmptyProductsList = () => {
    return (
        <TextRegular textStyle={styles.emptyList}>
          No Products were retreived.
        </TextRegular>
    )
  }

  const renderHeader = () => {
    return (
        <>
        <TextSemiBold textStyle={{ fontSize: 30, marginTop: 20, marginLeft: 10 }}> Top Products </TextSemiBold>
       <FlatList
          style={styles.container}
          data={products}
          renderItem={renderProducts}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyProductsList}
        />
        <TextSemiBold textStyle={{ fontSize: 30, marginTop: 20, marginLeft: 10 }}> Restaurants </TextSemiBold>
      </>
    )
  }

  return (
    <>
     <FlatList
          style={styles.container}
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyRestaurantsList}
        />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
