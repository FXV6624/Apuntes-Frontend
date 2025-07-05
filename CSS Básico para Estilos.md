### 1. **color**

- **Qué hace:** Cambia el color unicamente en componentes de texto
    
- **Cuándo usar:** Para cambiar el color de las letras o el contenido textual.
    
- **Ejemplo:** `color: 'red' ` → texto rojo.
---

### 2. **background-color**

- **Qué hace:** Cambia el color de fondo del elemento.
    
- **Cuándo usar:** Para darle un color de fondo visible (detrás del texto o contenido).
    
- **Ejemplo:** `backgroundColor: 'yellow' ` → fondo amarillo.
---

### 3. **font-size**

- **Qué hace:** Cambia el tamaño del texto.
    
- **Cuándo usar:** Para hacer el texto más grande o más pequeño.
    
- **Ejemplo:** `fontSize: 20px;` → texto de 20 píxeles.
---

### 4. **font-weight**

- **Qué hace:** Controla el grosor del texto (normal, negrita, más pesado).
    
- **Cuándo usar:** Para destacar texto usando grosor, por ejemplo negrita.
    
- **Ejemplo:** `fontWeight: 'bold';` o `font-weight: 700;`
---

### 5. **text-align**

- **Qué hace:** Alinea el texto horizontalmente dentro de un bloque.
    
- **Cuándo usar:** Para centrar texto o alinearlo a la izquierda o derecha.
    
- **Ejemplo:** `textAlign: 'center';`
---

### 6. **width**

- **Qué hace:** Establece el ancho del elemento.
    
- **Cuándo usar:** Para controlar qué tan ancho debe ser un div, imagen, botón, etc.
    
- **Ejemplo:** `width: 300px;`
---

### 7. **height**

- **Qué hace:** Establece la altura del elemento.
    
- **Cuándo usar:** Para controlar la altura fija o mínima de un bloque o imagen.
    
- **Ejemplo:** `height: 150px;`
---

### 8. **padding**

- **Qué hace:** Espacio **interno** entre el contenido y el borde del elemento.
    
- **Cuándo usar:** Para separar texto o contenido del borde, como “relleno”.
    
- **Ejemplo:** `padding: 10px;` → espacio interno de 10 píxeles.
---

### 9. **margin**

- **Qué hace:** Espacio **externo** entre el elemento y otros elementos.
    
- **Cuándo usar:** Para separar bloques o elementos entre sí.
    
- **Ejemplo:** `margin: 20px;` → espacio afuera del borde.
---
## **Posicionar objetos**
### 10. **position**

- **Qué hace:** Permite posicionar elementos con precisión respecto a su contenedor o la ventana.
    
- **Cuándo usar:** relative → posiciona el elemento respecto a su posición original, absolute → posiciona el elemento respecto al primer ancestro con position relativa o la ventana si no hay
    
- **Ejemplo:** `position: 'relative'`
---
### 11. top

- **Qué hace:** posicion del componente respecto a la parte superior
    
- **Cuándo usar:** px positivo -> se mueve hacia abajo, px negativo se mueve hacia arriba.
    
- **Ejemplo:** `top: '-25px'`
---
### 12. left

- **Qué hace:** posicion del componente respecto a la parte izquierda
    
- **Cuándo usar:** px positivo -> se mueve hacia la derecha,px negativo se mueve hacia la izquierda.
    
- **Ejemplo:** `left: '1250px'`
---

## **Hacer bordes**

### 13. **borderRadius

- **Qué hace:** Coloca un borde al componente
    
- **Cuándo usar:** 1px -> borde cuadrado, 10px-> borde redondo.
    
- **Ejemplo:** `borderRadius: '10px'`
---
### 14. **borderWidth

- **Qué hace:** Grosor del borde
    
- **Cuándo usar:** Mayor numero, mayor grosor
    
- **Ejemplo:** `borderWidth: 2.5
---
### 15. **borderColor

- **Qué hace:** Color del borde
    
- **Cuándo usar:** color en ingles entre comillas.
    
- **Ejemplo:** `borderColor: 'green'`
---

## **Flex y contenedores**

Con los siguientes comandos indicamos la posicion de objetos en sus contenedores.
Cuando usas: `flex: 1`  en un componente hijo, estás diciendo:  Este elemento **ocupa todo el espacio disponible** dentro de su contenedor padre.

Las siguientes propiedades se ponen en el componente padre para indicar como se colocan los hijos:
### 16. flexDirection

- **Qué hace:** Define **en qué dirección se colocan** los elementos hijos dentro de un contenedor.
    
- **Cuándo usar:** Lo colocas en el contenedor padre y usas row o column.
    
- **Ejemplo:** `flexDirection: 'row'
---

### 17. **justify-content**

- **Qué hace:** Controla cómo se alinean los elementos hijos **a lo largo del eje principal**, es decir, si flexDirection es row -> eje horizontal, si es column -> eje vertical.
    
- **Cuándo usar:**

| `flex-start`    | Alinea al principio                        |
| --------------- | ------------------------------------------ |
| `center`        | Centra los elementos                       |
| `flex-end`      | Alinea al final                            |
| `space-between` | Espacio entre elementos (extremos pegados) |
| `space-around`  | Espacio alrededor (incluso en extremos)    |
| `space-evenly`  | Igual espacio entre todos los elementos    |

- **Ejemplo:**  
    `justify-content: 'center'`

---

### 18. **align-items**

- **Qué hace:** Controla cómo se alinean los elementos **en el eje secundario**  (el eje perpendicular al principal).
    
- **Cuándo usar:** 

| `flex-start` | Alinea al incio del eje      |
| ------------ | ---------------------------- |
| `center`     | Centra en el eje transversal |
| `flex-end`   | Alinea al final              |
| `stretch`    | Estira los elementos         |


- **Ejemplo:** `alignItems: 'center'` 
---
