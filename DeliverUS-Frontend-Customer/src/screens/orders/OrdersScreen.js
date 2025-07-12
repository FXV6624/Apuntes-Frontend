import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, Pressable, FlatList } from 'react-native'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import TextRegular from '../../components/TextRegular'
import { getAll, remove } from '../../api/OrderEndpoints'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DeleteModal from '../../../../DeliverUS-Frontend-Customer/src/components/DeleteModal'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import { API_BASE_URL } from '@env'
import TextSemiBold from '../../components/TextSemibold'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'

export default function OrdersScreen ({ navigation }) {
  const [orders, setOrders] = useState([])
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    if (loggedInUser) {
      const listener = navigation.addListener('focus', () => {
        fetchOrders()
      })
      return listener
    } else {
      setOrders(null)
    }
  }, [navigation, loggedInUser])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAll()
      setOrders(fetchedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving orders. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderOrder = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.restaurant.logo ? { uri: API_BASE_URL + '/' + item.restaurant.logo } : restaurantLogo}
        title={'Oder #' + item.id + '  ' + item.createdAt}
        onPress={() => {
          navigation.navigate('OrderDetailScreen', { id: item.id })
        }}
      >
        <TextRegular>{item.address}</TextRegular>
        <TextSemiBold>Price: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.price.toFixed(2)}€</TextSemiBold></TextSemiBold>
        <TextSemiBold>{'status: ' + item.status}</TextSemiBold>
        <View style={styles.actionButtonsContainer}>
          {item.status === 'pending' && (
          <Pressable
            onPress={() => navigation.navigate('EditOrderScreen', { id: item.id })
            }
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandBlueTap
                  : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Edit
            </TextRegular>
          </View>
        </Pressable>
          )}
 {item.status === 'pending' && (
        <Pressable
            onPress={() => { setOrderToBeDeleted(item) }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Delete
            </TextRegular>
          </View>
        </Pressable>
 )}
        </View>
      </ImageCard>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
    <>
         <TextRegular textStyle={{ fontSize: 30, textAlign: 'center', marginTop: 100 }}>
           No orders were retreived. Are you logged in?
         </TextRegular>
         <Pressable
                     onPress={() => navigation.navigate('Profile', { screen: 'LoginScreen' })
                     }
                     style={({ pressed }) => [
                       {
                         backgroundColor: pressed
                           ? GlobalStyles.brandBlueTap
                           : GlobalStyles.brandBlue
                       },
                       styles.actionButton
                     ]}>
                   <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                     <MaterialCommunityIcons name='login' color={'white'} size={20}/>
                     <TextRegular textStyle={styles.text}>
                       Login
                     </TextRegular>
                   </View>
                 </Pressable>
      </>
    )
  }
  const removeOrder = async (order) => {
    try {
      await remove(order.id)
      await fetchOrders()
      setOrderToBeDeleted(null)
      showMessage({
        message: 'Order succesfully removed',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setOrderToBeDeleted(null)
      showMessage({
        message: 'Order could not be removed.',
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
     <>
      <FlatList
           style={styles.container}
           data={orders}
           renderItem={renderOrder}
           keyExtractor={item => item.id.toString()}
           ListEmptyComponent={renderEmptyOrdersList}
         />
         <DeleteModal
               isVisible={orderToBeDeleted !== null}
               onCancel={() => setOrderToBeDeleted(null)}
               onConfirm={() => removeOrder(orderToBeDeleted)}>
             </DeleteModal>
     </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    width: '90%',
    position: 'relative',
    top: 0,
    left: -10
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})
