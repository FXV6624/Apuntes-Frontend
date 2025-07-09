Primero debemos saber controlar los estilos, para ello tenemos el documento [[CSS Básico para Estilos]]

## Estructura básica de una pantalla en React Native


```
// 1. Importaciones
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'

// 2. Definición del componente funcional
export default function RestaurantsScreen({ navigation, route }) {
  
	  // 3. Estados y hooks
	  const [restaurants, setRestaurants] = useState([])
	  const [loading, setLoading] = useState(true)
	
	  // 4. useEffect para cargar datos al montar
	  useEffect(() => {
	    async function fetchData() {
	      const data = await getRestaurants()
	      setRestaurants(data)
	      setLoading(false)
	    }
	    fetchData()
	  }, [])  // Array vacío: se ejecuta solo al montar
	
	  // 5. Funciones auxiliares para renderizar (ejemplo)
	  const renderRestaurant = ({ item }) => (
	    <View>
	      <TextRegular>{item.name}</TextRegular>
	    </View>
	  )
	
	  // 6. Return que renderiza la UI
	  return (
	    <View style={styles.container}>
	      {loading ? (
	        <Text>Cargando...</Text>
	      ) : (
	        <FlatList
	          data={restaurants}
	          keyExtractor={item => item.id.toString()}
	          renderItem={renderRestaurant}
	        />
	      )}
	    </View>
	  )
}

// 7. Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})

```

En pantalla solo se muestra lo que aparece en el return.

## React Navigation

Cuando defines un **componente de pantalla** en React así:
```
export default function MyScreen({ navigation, route }) {   // ... }
```

Estás recibiendo **dos objetos importantes** que React Navigation te pasa automáticamente:

### navigation

Es un **objeto** que te permite **navegar entre pantallas**, por ejemplo:

| Método     | ¿Qué hace?                     | Ejemplo                                 |
| ---------- | ------------------------------ | --------------------------------------- |
| `navigate` | Va a otra pantalla.            | `navigation.navigate('Profile')`        |
| `goBack`   | Vuelve a la pantalla anterior. | `navigation.goBack()`                   |
| `push`     | Agrega otra pantalla al stack. | `navigation.push('Product', { id: 3 })` |
| `replace`  | Reemplaza la pantalla actual.  | `navigation.replace('Login')`           |
Existe otro metodo de navigation muy importante, `addListener`. Esto se utiliza cuando queremos que se ejecute una función cuando le ocurra algo a la pantlla. Por ejemplo:
```
const listener = navigation.addListener('focus', () => {
      fetchRestaurantCategories()
    })
    return listener
```
focus indica que cuando se muestre esta pantalla se ejecute una funcion, en este caso fetch. Esto es util cuando por ejemplo estamos en la pantalla de Mis restaurantes, le damos a crear restaurante, y cuando volvamos a la pantalla queremos que se nos muestre el nuevo restaurante sin necesidad de recargar la pagina. Para esto, se debe utilizar esta funcion en el useEffect de los componente que queremos que se actualicen solos. Por ejemplo:
```
const [restaurantCategories, setRestaurantCategories] = useState([])

useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        const fetchedRestaurantCategoriesReshaped = fetchedRestaurantCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    
    const listener = navigation.addListener('focus', () => {
      fetchRestaurantCategories()
    })
    return listener
  }, [navigation])
```
Es importante usar addListener dentro de una constante (en este caso listener), e invocarlo haciendo return listener. Esto hara que cada vez que se use el listener se elimine, para asi no crear infinitos listener cada vez que se ejecute el useEffect.
### route

Es un **objeto** que contiene **información sobre la ruta actual**, especialmente los **parámetros que se le pasaron** al navegar.Por ejemplo, si haces:

```
navigation.navigate('DetailScreen', { id: 42, name: 'Pizza' })
```

En `DetailScreen`, puedes acceder a esos datos así:
```
function DetailScreen({ route }) {   const { id, name } = route.params }

```
### Ejemplo completo

```
export default function ProductScreen({ navigation, route }) {   
const { id } = route.params
return (     
<View>       
<Text>Product ID: {id}</Text>       
<Pressable onPress={() => navigation.navigate('Home')}>         
<Text>Go Home</Text>       
</Pressable>     
</View>   
) 
}
```

## Declaracion de Funciones.

Una funcion se puede declarar de 2 formas:

### Forma clasica

```
function fetchRestaurants () {
...
}

async function fetchRestaurants () {
...
}
```

Puede llamarse desde cualquier parte del codigo, es la forma clasica de declaracion de funciones.

### Funcion Flecha

```
const renderRestaurant = ({ item }) => (
...
)

const fetchedRestaurantAndMenu = async () => {
...
}
```

Es mas compacta y sencilla, solo puede llamarse una vez declarada. Las funciones flecha tienen diferentes sintaxis en funcion de lo que vayan a hacer:

| Caso                                                           | Sintaxis               | Ejemplo                           | Explicación                                       |
| -------------------------------------------------------------- | ---------------------- | --------------------------------- | ------------------------------------------------- |
| Función con **cuerpo explícito** (bloque `{}`) y varias líneas | `() => { ... }`        | `() => { console.log("hola") }`   | Para varias instrucciones dentro                  |
| Función con parametro                                          | `(param) => { ... }`   | `(name) => { console.log(name) }` | Usa el parametro ya declarado                     |
| Función con **retorno implícito** (sin `{}`)                   | `() => expression`     | `x => x + 1`                      | Retorna directamente la expresión                 |
| Función con **parámetro destructurado**                        | `({ pressed }) => ...` | `({ pressed }) => pressed ? ...`  | Parámetro recibido como objeto y extrae `pressed` |
Otra cosa a tener en cuenta en las funciones es el uso de return implicito o explicito, es decir, de declarar la funcion con llaves o con parentesis. Cuando declaramos una funcion con parentesis no es necesario añadir return, todo lo escrito se devuleve:
```
const renderHeader = () => ( 
...
)
```

En cambio, con llaves, si es necesario un return ya que hay cosas como declaraciones de varibales que no queremos devolver:
```
const renderTopProducts = ({ item }) => {
const restaurant = restaurants.find(r => r.id === item.restaurantId)
return(
.
)
}

```

Las funciones que devuelvan JSX ( componentes de react que se ven por pantalla) solo pueden devolver un componente hijo, aunque dentro de este haya mas componentes hijos, por ejemplo:
```
  const renderRestaurant = ({ item }) => (
    <ImageCard
      imageUri={item.logo ? { uri: `${API_BASE_URL}/${item.logo}` } : restaurantLogo}
      title={item.name}
      onPress={() => navigation.navigate('RestaurantDetailScreen', { id: item.id })}
    >
      <TextRegular numberOfLines={2}>{item.description}</TextRegular>
      {item.averageServiceMinutes !== null && (
        <TextSemiBold>
          Avg. service time:{' '}
          <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>
            {item.averageServiceMinutes} min.
          </TextSemiBold>
        </TextSemiBold>
      )}
      <TextSemiBold>
        Shipping:
        <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}> {item.shippingCosts.toFixed(2)}€</TextSemiBold>
      </TextSemiBold>
    </ImageCard>
  )
```
Esta funcion usada para renderizar restaurantes solo devuelve un componente hijo, ImageCard, pero dentro de el podemos declarar mas componentes.

## Datos y su mostrado en pantalla.

### useState
`useState` es un **hook** de React que permite a los componentes funcionales **tener estado** (state), es decir, **guardar y actualizar valores** que cambian con el tiempo. Todo lo que deba tener un valor debe tener un useState, tanto lo que se vaya a mostrar en pantalla como lo que no. Cuando se produce un cambio en el estado del componente, este se vuelve a renderizar.

```
const [restaurants, setRestaurants] = useState([])
```

restaurants -> Nombre de la variable que contiene los datos
setRestaurants -> Funcion que actualizará los datos
useState([])-> Indica que el estado incial es una lista vacia

### useEffect
`useEffect` es un hook que permite ejecutar **efectos secundarios** (como peticiones HTTP, temporizadores, eventos) después de que la pagina se monta o actualiza. 

```
useEffect(() => {
const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await getRestaurant()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurants()
    }, [route])

```

Recibe dos parámetros, una función que ejecuta el efecto, y un array de dependencias (qué variables cambian para que se vuelva a ejecutar). En este ejemplo, la funcion a ejecutar se define en el propio useEffect y se llama inmediatamente (fetchRestaurants()). El array de dependencias solo incluye route, es decir, **cada vez que `route` cambie, se volverá a ejecutar el efecto** y volverá a hacer la petición para actualizar la lista de restaurantes.

- **`useEffect(() => { ... }, [])`**  
    Se ejecuta **una sola vez** al montar el componente, porque el array de dependencias está vacío y no hay nada que “dispare” que se vuelva a ejecutar.
    
- **`useEffect(() => { ... })`** (sin segundo parámetro)  
    Se ejecuta **en cada renderizado** del componente, porque no hay dependencias indicadas.
    
- **`useEffect(() => { ... }, [dep1, dep2])`**  
    Se ejecuta al montar **y cada vez que cambie alguna dependencia** (`dep1` o `dep2`).

### Funcion fetch

Es una función que se llama dentro de un `useEffect` para obtener datos externos (por ejemplo, desde una API) y con esos datos se inicializa o actualiza el estado del componente declarado con `useState`. Son funciones asincronas ya que hay que realizar llamadas a la bd. Puede haber varias dentro de un mismo useEffect. 

```
 useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await getRestaurant()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurants()
    async function fetchProducts () {
      try {
        const fetchedProducts = await getTopProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving Products. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProducts()
  }, [route])
```


### Funcion Render

Es una funcion que indica como se debe mostrar un elemento en pantalla de manera personalizada. Se utilizan sobretodo en componentes de react como flatlist (para indicar como se renderizaran los elementos de la lista), o en el propio return de la pagina para no sobrecargarlo a codigo.
Estan formados por diferentes componentes de react que veremos mas adelante.

```
  const renderRestaurant = ({ item }) => (
    <ImageCard
      imageUri={item.logo ? { uri: `${API_BASE_URL}/${item.logo}` } : restaurantLogo}
      title={item.name}
      onPress={() => navigation.navigate('RestaurantDetailScreen', { id: item.id })}
    >
      <TextRegular numberOfLines={2}>{item.description}</TextRegular>
      {item.averageServiceMinutes !== null && (
        <TextSemiBold>
          Avg. service time:{' '}
          <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>
            {item.averageServiceMinutes} min.
          </TextSemiBold>
        </TextSemiBold>
      )}
      <TextSemiBold>
        Shipping:
        <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}> {item.shippingCosts.toFixed(2)}€</TextSemiBold>
      </TextSemiBold>
    </ImageCard>
  )
```

Esta funcion, por cada item que recibe (restaurante), se ejecuta.

### Error en concatenaciones

Uno de los errores más comunes en React (y JavaScript en general) ocurre cuando intentamos **acceder directamente a propiedades de un objeto que puede ser `undefined` o `null`**, lo que da lugar a un error de tipo:

`TypeError: Cannot read property 'name' of undefined`

Este error sucede si tratamos de acceder a una propiedad concatenada, es decir, a una propiedad que se accede a traves de otra propiedad, por ejemplo, `order.restaurant.name`. En el render inicial, el useState de order está vacío, por lo que al acceder a `order.restaurant` obtenemos undefined, esto no daria ningun error, sin embargo, al hacer la concatenacion estariamos haciendo `undefined.name`, produciendo el error. 

La solución al error es usar `?`: 
`<Text>{order.restaurant?.name}</Text> `
De esta forma le estariamos dicendo al programa que si order.restaurant existe, acceda a la propiedad name, pero sino, que no lo intente.

Tras esto se haria el segundo render, el del useEffect, y ahora si accedería sin problemas a todas las propiedades.


## Componentes de React

Los componentes de react son elementos que se muestran por pantalla. Se escriben de la siguiente forma:
```
<Componente >
.
</Componente>
```
Dentro de las primeras llaves podemos poner tanto los props como los estilos:
```
<View style={{ color: 'blue', fontSize: 18 }}>
</View>

<View style={styles.texto}>
</View>
```
Ademas, pueden usar sentencias if:
```
<View style={item.availability ? styles.available : styles.notAvailable}>
</View>
```

Para mostrar los componentes deben ir en el return de una funcion o de la pagina principal.
Vamos a ver los diferentes componentes que podemos usar para mostrar en nuestra pagina web:

### View y Fragment

Estos no son componentes visuales de React Native, sino estructurales. Se utilizan ya que las funciones que devuelven elementos visuales (como las de render), o el return de la pagina, solo pueden devolver un componente padre, no varios. Por ello, devolvemos un solo componente View o fragment, y en su interior todos los componentes hijos. La diferencia entre fragment y View es que a View podemos añadirle estilos que se aplicarán sobre sus hijos.

```
 Ejemplo Fragment:
 const renderHeader = () => {
    return (
    <>
      <TextSemiBold textStyle={styles.title}>
      Top-selling products </TextSemiBold>
      <FlatList
        style={styles.container}
        data={products}
        renderItem={renderTopProducts}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<TextRegular textStyle={styles.emptyList}>No popular products found.</TextRegular>}
      />
      <TextSemiBold textStyle={styles.title}>
      Restaurants </TextSemiBold>
    </>
    )
  }
```

```
 Ejemplo View:
 const renderHeader = () => {
    return (
    <View style={{flexDirection='row'}}>
      <TextSemiBold textStyle={styles.title}>
      Top-selling products </TextSemiBold>
      <FlatList
        style={styles.container}
        data={products}
        renderItem={renderTopProducts}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<TextRegular textStyle={styles.emptyList}>No popular products found.</TextRegular>}
      />
      <TextSemiBold textStyle={styles.title}>
      Restaurants </TextSemiBold>
    </View>
    )
  }
```

### Text, TextRegular y TextSemiBold

Se usan para mostrar texto en pantalla. `Text` es el componente estándar de React Native. Los componentes `TextRegular` y `TextSemiBold` suelen ser versiones personalizadas que ya incluyen ciertos estilos aplicados, como el peso de la fuente o márgenes comunes, creados por los profesores.

Text muestra texto sin estilo, TextRegular es texto con color y tamaños estandar, TextSemiBold es igual que regular pero en negrita. Para aplicar estilos a estos componentes usamos textStyle en lugar de style. Al escribir no hace falta usar entrecomillado, a no ser que se use una sentencia if dentro.

Ejemplos:
```
<Text textStyle={styles.titulo}>Hola mundo</Text>
<TextRegular textStyle={styles.descripcion}>Descripción aquí</TextRegular>

<TextSemibold textStyle= { item.availability ? styles.avail : styles.notAvail} >
{item.availability ? 'Available' : ' Not Available '}
</TextSemiBold>
```

### Pressable

El componente Pressable es un botón en el que podemos definir que ocurre al pulsarlo. Se declara de la siguiente forma:
```
<Pressable props y estilos>
Contenido del boton (Texto o imagen)
</Pressable>
```
Los props del pressable deben declararse como una función. Pueden ser los siguientes, aunque principalmente solo usaremos onPress:

| Evento        | Cuándo se dispara                                                                | Uso común                                                                     |
| ------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `onPress`     | Cuando el usuario toca y suelta el componente (acción principal).                | Ejecutar una acción básica como navegar o mostrar algo.                       |
| `onLongPress` | Cuando el usuario mantiene presionado el componente por un tiempo prolongado.    | Mostrar un menú contextual, opciones extra, o confirmar algo.                 |
| `onPressIn`   | Inmediatamente cuando el usuario toca el componente (antes de soltar).           | Cambiar estilo para dar feedback inmediato (por ejemplo, oscurecer un botón). |
| `onPressOut`  | Justo cuando el usuario suelta el dedo, sin importar si el `onPress` se ejecutó. | Revertir estilos aplicados en `onPressIn`.                                    |
Ejemplo de uso:

```
<Pressable
          onPress={() => {
            if (loggedInUser === null) {
              showMessage({
                message: 'You need to be logged in to place an order',
                type: 'warning',
                style: flashStyle,
                titleStyle: flashTextStyle
              })
              navigation.navigate('Profile')
            } else {
              setOrder({
                restaurantId: restaurant.id,
                products: getSelectedProducts(),
                address: loggedInUser.address
              })
              setShowModal(true)
            }
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandBlueTap
                : brandBlue
            },
            styles.buttonOrder
          ]}>
          <TextRegular textStyle={styles.text}>
            Create Order
          </TextRegular>
</Pressable>
```

Como vemos, a los estilos del Pressable le pasamos dos estilos. El primero contiene la propiedad pressed, que indica que estilo se muestra si el botón está pulsado. El segundo es el estilo del componente en sí.
### Image, ImageCard e ImageBackground

Estos **son componentes visuales** usados para mostrar imágenes.  
`Image` y `ImageBackground` vienen de React Native.  
`ImageCard` es un componente personalizado dado por los profesores.

Image muestra una imagen simple, sin fondo ni hijos. Tiene los props style y source. Solo es necesario abrir el componente, no cerrarlo:
```
<Image
  source={{ uri: 'https://example.com/imagen.jpg' }}
  style={{ width: 100, height: 100, borderRadius: 10 }}
/>
```

ImageBackground permite incluir componentes hijos **encima de la imagen como fondo**. Sus props son style y source, pero si es necesario cerrar el componente ya que puede contener hijos:
```
<ImageBackground
  source={{ uri: 'https://example.com/fondo.jpg' }}
  style={{ width: '100%', height: 200 }}
>
  <TextRegular textStyle={{ color: 'white' }}>Texto sobre la imagen</TextRegular>
</ImageBackground>
```

ImageCard muestra una **imagen con un título y contenido opcional**, como texto adicional o botones. También puede ser **interactivo** si se le pasa una función `onPress`. Sus props son los siguientes:

| Prop       | ¿Qué hace?                                        |
| ---------- | ------------------------------------------------- |
| `imageUri` | URL o recurso local de la imagen.                 |
| `title`    | Título que se muestra en la card.                 |
| `onPress`  | Si existe, la card se puede pulsar como botón.    |
| `children` | Contenido adicional (descripción, precios, etc.). |
Ejemplo:
```
 const renderTopProducts = ({ item }) => {
    const restaurant = restaurants.find(r => r.id === item.restaurantId)
    const restaurantName = restaurant ? restaurant.name : 'Restaurante'
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : productImage}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.restaurantId })
        }}
      >
         <TextRegular>{item.description}</TextRegular>
         <TextRegular>
         Price:
        <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}> {item.price.toFixed(2)}€</TextSemiBold>
        </TextRegular>
        <TextRegular>From {restaurantName} </TextRegular>
        <TextSemiBold textStyle= {item.availability ? styles.avail : styles.notAvail}>
          {item.availability ? 'Available' : 'Empty Stock'}
        </TextSemiBold>
      </ImageCard>
    )
  }
```

Aqui tenemos un ejemplo donde aparece una Image dentro de una ImageBackGround y debajo una FlatList de ImageCards de productos:
![[Pasted image 20250628114655.png]]
### MaterialCommunityIcons

Es **una colección de íconos** basada en el conjunto de iconos de [Material Design Community](https://materialdesignicons.com/). Estos íconos son populares, bien diseñados y ofrecen muchas opciones visuales para interfaces modernas. Suelen incluirse en botones, inputs, alertas (showMessage)...
Se importan de la siguiente forma: 
`import { MaterialCommunityIcons } from '@expo/vector-icons'`

Ejemplo en un botón de guardado:
```
<Pressable
    onPress={ handleSubmit }
    style={({ pressed }) => [
      {
       backgroundColor: pressed ? GlobalStyles.brandSuccessTap 
       : GlobalStyles.brandSuccess }, styles.button ]}>
     <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
     <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
     <TextRegular textStyle={styles.text}>
       Save
     </TextRegular>
     </View>
</Pressable>
```

![[Pasted image 20250628113922.png]]

### FlatList

Se usa para renderizar listas de elementos de forma eficiente. Solo es necesario abrir el componente, no cerrarlo, y necesita de varios props que añadir. Son los siguientes:

| Prop                  | ¿Qué hace?                                                                            |
| --------------------- | ------------------------------------------------------------------------------------- |
| ListHeaderComponent   | Qué muestra la cabecera                                                               |
| style                 | Estilo de la lista como componente, suele usarse flex 1 para que ocupe toda la pagina |
| data                  | Los elementos de la lista                                                             |
| renderItem            | Renderizado personalizado de los elementos de la lista                                |
| keyExtractor          | Identificador de los elementos de la lista                                            |
| ListEmptyComponent    | Qué se muestra en caso de que la lista esté vacía                                     |
| contentContainerStyle | Estilo de los elementos de la lista                                                   |
Ejemplo:
```
<FlatList
    ListHeaderComponent={renderHeader}
      style={styles.container}
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <TextRegular textStyle={styles.emptyList}>No restaurants found.</TextRegular>
      }
    />
```

###  showMessage

`showMessage` no es un componente que se muestra en un return,  es una función del paquete [`react-native-flash-message`](https://github.com/lucasferreira/react-native-flash-message) que permite mostrar **mensajes emergentes** (tipo _toast_) en la parte superior o inferior de la pantalla.
Se usa comúnmente para **avisos, errores, confirmaciones, etc.** y es muy fácil de usar. Se le debe pasar diferentes props como message, type, style o titleStyle. Para utilizarse, se llama desde otra función que se vaya a utilizar, por ejemplo la funcion onPress de un pressable:

```
<Pressable
          onPress={() => {
            if (loggedInUser === null) {
              showMessage({
                message: 'You need to be logged in to place an order',
                type: 'warning',
                style: flashStyle,
                titleStyle: flashTextStyle
              })
              navigation.navigate('Profile')
            } else {	
            ... }
            }>
            ...
</Pressable>
```

O por ejemplo como el catch de un bloque try/catch:

```
 const fetchedRestaurantAndMenu = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.id)
      const product = await fetchedRestaurant.products
      setRestaurant(fetchedRestaurant)
      setProducts(product)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }
```

![[Pasted image 20250628114117.png]]
### Formik, DropDownPicker y Switch

Para crear una pagina de formulario necesitamos el componente Formik, pero antes de explicarlo vamos a hablar de los componentes DropDownPicker y Switch, necesarios para crear ciertos campos del Formik. Ademas de estos componentes usaremos otros para formar visualmente nuestro Formik.

*DropDownPicker:*
![[Pasted image 20250628114204.png]]
Es un componente que muestra un desplegable con diferentes opciones para elegir una de ellas. Se declara de la siguiente forma, no es necesario abrirlo y cerrarlo, solo abrirlo:
```
<DropDownPicker
                open={open}
                value={values.productCategoryId}
                items={productCategories}
                setOpen={setOpen}
                onSelectItem={item => {
                  setFieldValue('productCategoryId', item.value)
                }}
                setItems={setProductCategories}
                placeholder="Select the product category"
                containerStyle={{ height: 40, marginTop: 20, marginBottom: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
 />
```

open y setOpen indican cuando esta abierto o cerrado el desplegable, se declaran con un estado de esta manera: `const [open, setOpen] = useState(false)` .

value es el valor actualmente seleccionado, en este caso values.productCategoryId que hace referencia al campo productCategoryId del formik.

items son las opciones a elegir, tienen dos campos, value y label. Previamente hemos mapeado las productCategories para que tengan value (id) y label (name). El componente DropDownPicker autodetecta que, cuando le llegan los item, label es lo que mostrará en pantalla y value lo que guardará en el código. Asi hemos mapeado los productCategories:
```
useEffect(() => {
    async function fetchProductCategories () {
      try {
        const fetchedProductCategories = await getProductCategories()
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map((e) => (
          {
            label: e.name,
            value: e.id
          }
        ))
        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductCategories()
  }, [])
```

onSelectItem indica qué ocurre cuando se selecciona una opción, en este caso, al campo productCategoryId se le asigna el campo value (id) del item seleccionado.

setItems es una función para actualizar la lista si cambian las categorías.

placeholder es el texto que aparece cuando no has elegido nada todavia


*Switch*
![[Pasted image 20250628114220.png]]
El switch es un componente que es como un interruptor, está encendido o apagado. Se declara de la siguiente forma, solo es necesario abrirlo:
```
<Switch
                trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
                value={values.availability}
                style={styles.switch}
                onValueChange={value =>
                  setFieldValue('availability', value)
                }
              />
```

| Prop                                                            | ¿Qué hace?                                                                             | Ejemplo / Detalles                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `trackColor={{ false: ..., true: ... }}`                        | Cambia el **color del fondo del switch** (la pista) según su estado (`false` o `true`) | Cuando está apagado (false) se ve gris, cuando está encendido (true) usa tu color personalizado |
| `thumbColor={...}`                                              | Cambia el **color del "botón" circular** que se desliza                                | Aquí, si `availability` es true, el botón es del color principal, si no, es gris claro          |
| `value={values.availability}`                                   | El **estado actual del switch**                                                        | Formik guarda el valor de `availability` (booleano) y lo pasa aquí                              |
| `style={styles.switch}`                                         | Aplica estilos propios (padding, margen, etc.)                                         | Se define en tu archivo `styles` al final del componente                                        |
| `onValueChange={value => setFieldValue('availability', value)}` | Esta función se llama cuando el usuario activa o desactiva el switch                   | Actualiza el valor del campo `availability` dentro del formulario de Formik                     |

Ahora si, podemos pasar a explicar el Formik.
Antes del return de la pagina, donde irá el formik, debemos declarar las siguientes cosas:

`const [backendErrors, setBackendErrors] = useState()` Para mostrar los errores que ocurran en el backend al mandar el formik

`const initialProductValues = { name: null, description: null, price: null, order: null, restaurantId: route.params.id, productCategoryId: null, availability: true }`
Para declarar los valores iniciales de los campos del formik

```
const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required'),
    price: yup
      .number()
      .positive('Please provide a positive price value')
      .required('Price is required'),
    order: yup
      .number()
      .nullable()
      .positive('Please provide a positive order value')
      .integer('Please provide an integer order value'),
    availability: yup
      .boolean(),
    productCategoryId: yup
      .number()
      .positive()
      .integer()
      .required('Product category is required')
  })
```
Para indicar las restricciones de los campos del formik.

```
 const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }
```
Una funcion que usaremos para seleccionar imagenes de nuestro dispositivo

```
const createProduct = async (values) => {
    setBackendErrors([])
    try {
      const createdProduct = await create(values)
      showMessage({
        message: `Product ${createdProduct.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('RestaurantDetailScreen', { id: route.params.id, dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
```
La función que utilizaremos para guardar en la BD el resultado del formik. Si falla se pasan los errores producidos al estado que hemos creado como backendErrors

Ahora ya podemos pasar al return: 

```
return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialProductValues}
      onSubmit={createProduct}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView contentContainerStyle={{ alignItems: 'center', width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />
              <InputItem
                name='description'
                label='Description:'
              />
              <InputItem
                name='price'
                label='Price:'
              />
              <InputItem
                name='order'
                label='Order/position to be rendered:'
              />
              <DropDownPicker
                open={open}
                value={values.productCategoryId}
                items={productCategories}
                setOpen={setOpen}
                onSelectItem={item => {
                  setFieldValue('productCategoryId', item.value)
                }}
                setItems={setProductCategories}
                placeholder="Select the product category"
                containerStyle={{ height: 40, marginTop: 20, marginBottom: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
              <ErrorMessage name={'productCategoryId'} render={msg => <TextError>{msg}</TextError> }/>
              <TextRegular>Is it available?</TextRegular>
              <Switch
                trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
                value={values.availability}
                style={styles.switch}
                onValueChange={value =>
                  setFieldValue('availability', value)
                }
              />
              <ErrorMessage name={'availability'} render={msg => <TextError>{msg}</TextError> }/>
              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('image', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Product image: </TextRegular>
                <Image style={styles.image} source={values.image ? { uri: values.image.assets[0].uri } : defaultProductImage} />
              </Pressable>
              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }
              <Pressable
                onPress={ handleSubmit }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
              </Pressable>
        </ScrollView>
      )}
    </Formik>
  )
```

Al declarar el formik le pasamos los siguiente props:
validationSchema={validationSchema} -> Las restricciones que hemos declarado antes.
initialValues={initialProductValues} -> Los valores inciales que hemos declarado antes.
onSubmit={createProduct} -> La función que hemos declarado para que se ejecute al mandar el formik.

Posteriormente, escribimos el contenido del formik, que debe ser si o si una función con la siguiente estructura: 
```
{({ handleSubmit, setFieldValue, values }) => (
componentes de react que se mostraran por pantalla
)}
```
A esta funcion le pasamos los siguientes parámetros ( No los hemos creado nosotros, están automaticamente creados por React Native):
handleSubmit -> Una función que activa la propiedad onSubmit del formik
setFieldValue -> Una función que actualiza el valor del campo del formik que le indiquemos
values -> Un objeto con la siguiente estructura ( La que hemos creado en initialValues):
```
{
  "name": null
  "description": null
  "price": null
  "restaurantId": 1
  "availability": true
  ...
}
```

Ahora usamos los componentes de react que necesitemos:
Primero usamos como componente padre ScrollView, que engloabará al resto de componentes. Este componente actua como View pero si hay muchos datos se convierte en una pagina con scroll.
Dentro, usamos los componentes InputItem que son los campos del formulario en los que podemos escribir. Sus props son: name, que indica a que campo de validationSchema y initialValues se conecta, y  label, que es el texto que aparece sobre el componente.
```
<InputItem
        name='price'
        label='Price:'
/>
```
![[Pasted image 20250628114252.png]]

Tambien usamos los componentes DropDownPicker y Switch ya explicados. Debajo de estos utilizamos el componente ErrorMessage, que se encarga de mostrar **los mensajes de error de validación** de un campo específico del formulario. Sus props son: name, indica el campo del formik al que se conecta, y render, que muestra el mensaje de error.
```
<ErrorMessage name={'productCategoryId'} render={msg => <TextError>{msg}</TextError> }/>
```

Como vemos, tambien usamos un Pressable que al pulsarlo llamamos a la función que hemos declarado antes para coger una foto de nuestro dispositivo y lo asigna al campo image del formik. Dicho pressable esta compuesto por un texto y una imagen (la que seleccionamos, o si no seleccionamos ninguna, la default )
```
<Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('image', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Product image: </TextRegular>
                <Image style={styles.image} source={values.image ? { uri: values.image.assets[0].uri } : defaultProductImage} />
              </Pressable>
```
![[Pasted image 20250628114342.png]]

Lo siguiente que utilizamos es el mostrado de errores del backend que hemos declarado antes como un estado. Si se muestra no se manda el formik. Esto lo que hace es que, en la función de crear que hemos declarado antes, si algo sale mal, se vevuelve un Array de errores y estas lineas de código lo muestran en esta parte del Formik.
```
{backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>) }
```

Por ultimo incluimos el Pressable para mandar el formik.
```
<Pressable
                onPress={ handleSubmit }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
              </Pressable>
```
![[Captura de pantalla 2025-06-28 113855.png]]

Ejemplo visual del Formik completo:
![[Pasted image 20250629131236.png]]

### Modales

Un **modal** es una **ventana emergente** que aparece encima de la pantalla actual para mostrarte un mensaje, pregunta o acción importante, **sin cambiar de pantalla**. Para utilizar un modal primero debemos crearlo en un archivo js distinto a la pantalla que estamos usando (podemos crearlo en la propia pantalla, pero haciendolo en otro archivo queda mas limpio). En este nuevo archivo creamos la parte visual del modal y en nuestra pagina hacemos la funcional, asi podremos reutilizar el modal que hemos creado siempre que queramos. Por ejemplo:

```
import React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextSemiBold from './TextSemibold'
import * as GlobalStyles from '../styles/GlobalStyles'
import TextRegular from './TextRegular'
export default function DeleteModal (props) {
  return (
    <Modal
    presentationStyle='overFullScreen'
    animationType='slide'
    transparent={true}
    visible={props.isVisible}
    onRequestClose={props.onCancel}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TextSemiBold textStyle={{ fontSize: 15 }}>Please confirm deletion</TextSemiBold>
        {props.children}
        <Pressable
          onPress={props.onCancel}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandBlueTap
                : GlobalStyles.brandBlue
            },
            styles.actionButton
          ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='close' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Cancel
            </TextRegular>
          </View>
        </Pressable>
        <Pressable
        onPress={props.onConfirm}
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
          Confirm delete
        </TextRegular>
      </View>
    </Pressable>
      </View>
    </View>
  </Modal>
  )
}
  
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
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
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})
```

Como vemos creamos DeleteModal pasandole como parametros los props que definiremos mas adelante en la pagina donde usemos el modal. Lo primero que hacemos es abrir el componente Modal e incluimos los siguientes props en él:

| **Prop**            | **Tipo de valor**                                                           | **Qué hace**                                                          |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `visible`           | `boolean` (`true` o `false`)                                                | Controla si el modal se muestra (`true`) o se oculta (`false`).       |
| `transparent`       | `boolean`                                                                   | Si es `true`, el fondo del modal es transparente. Útil para overlays. |
| `presentationStyle` | `string` (`"fullScreen"`, `"pageSheet"`, `"formSheet"`, `"overFullScreen"`) | Determina cómo se presenta el modal visualmente.                      |
| `animationType`     | `string` (`"slide"`, `"fade"`, `"none"`)                                    | Establece el tipo de animación al mostrar/ocultar el modal.           |
| `onRequestClose`    | `function`                                                                  | Función que se llama cuando el usuario intenta cerrar el modal.       |
Tanto visible como onRequestClose se declararán en la pagina que usemos el modal.

El componente Modal es de los pocos que solo admite un solo hijo que englobe al resto.
Lo siguiente es crear dos contenedores View. El primero (que englobará al resto) indica los estilos que tendrá el desplegable sobre la pagina principal. El segundo indica los estilos que tendrá el contenido del desplegable.

Lo siguiente que hacemos es añadir un texto para indicar una pregunta o aviso, y también utilizamos `{props.children}`. Este prop muestra todo lo que escribamos dentro del modal cuando lo utilicemos en nuestra pagina. Por ejemplo, si al usar el modal ponemos dentro esto:

```
<DeleteModal ...>
  <Text>Hola, soy un texto dentro de MiCaja</Text>
  <Button title="Clic aquí" onPress={() => {}} />
</DeleteModal>
```
Cuando llamemos a props.children mostraremos el text y el button.
Por último, añadimos los botones de confirmacion y de negacion al modal que estamos creando.

Ahora ya tenemos nuestro DeleteModal listo para usarlo siempre que lo necesitemos. Para ello, en la pagina que estamos programando, debemos primero crear un estado para indicar cuando se mostrará o no el modal:

` const [showDelete, setShowDelete] = useState(false)`

Siempre que hagamos `setShowDelete(true)` se mostrará el modal y cuando hagamos `setShowDelete(false)` se ocultará.
Ahora declaramos el modal junto con sus props en el return:

```
<DeleteModal
      isVisible={showDelete}
      onCancel={() => setShowDelete(false)}
      onConfirm={() => {
        restaurant.products.forEach(element => {
          setProductQuantity(new Map(productQuantity.set(element.id, 0)))
        })
        setProducts([...products])
        setShowDelete(false)
      }}>
</DeleteModal>
```

Aqui definimos la parte funcional, es decir, qué pasa cuando se confirma y que pasa cuando se cancela. Los nombres de los props deben coincidir con los que hemos usado al crear DeleteModal.

isVisible -> Este prop se pasó como valor del prop visible al crear el modal: 
`visible={props.isVisible}`. Por lo tanto, indica cuando debe mostrarse o no el modal, dependiendo del valor del estado que hemos declarado antes.

onCancel-> Este prop es una función que pasamos como valor en el prop onRequestCancel, por lo que indica que ocurre cuando el usuario cierra el modal. Además también se pasó como función del Pressable que declaramos como Cancel, por lo que tambien se ejecuta cuando cancelamos el modal.

onConfirm-> Este prop es una función que utilizamos en el Pressable que declaramos como Confirm, por lo que se produce cuando confirmamos el modal.

Como vemos, no hemos incluido ningún componente visual en el modal, luego props.children no mostrará nada.
Ejemplo visual de DeleteModal:
![[Pasted image 20250629125239.png]]


## Mostrar componentes con condiciones

En React (y React Native) es común querer **mostrar o no mostrar un componente según una condición**. Esto se hace con expresiones dentro del JSX que devuelven el componente solo si la condición se cumple.

En JSX puedes usar **operadores lógicos** como `&&` para hacer renderizado condicional:

`{ condición && <Componente /> }`

- Si `condición` es `true`, entonces `<Componente />` se renderiza.
- Si `condición` es `false`, no se renderiza nada (no muestra nada en pantalla).

Por ejemplo:
```
{!item.availability &&
  <TextRegular textStyle={styles.availability }>Not available</TextRegular>
}
```
Aqui el texto de Not available solo se muestra si item.availability es false.

Otra opción es utilizar el operador ternario:
`{ condición ? <ComponenteA /> : <ComponenteB /> }`

Pero si solo quieres mostrar o esconder un componente, el `&&` es más simple y legible.