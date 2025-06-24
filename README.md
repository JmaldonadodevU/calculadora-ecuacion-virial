# **Calculadora de Ecuación Virial (Modo Oscuro)**

Esta aplicación web interactiva permite calcular el volumen molar de un gas real utilizando la ecuación virial. Además, calcula el factor de compresibilidad (Z) y visualiza el proceso iterativo que se lleva a cabo para encontrar la solución.

## **Tabla de Contenidos**

1. [Introducción](#bookmark=id.yyu6vw2lbn2)  
2. [La Ecuación Virial](#bookmark=id.k2jihnb39b4m)  
3. [El Factor de Compresibilidad (Z)](#bookmark=id.8s0crwk9v1rt)  
4. [Cómo Funciona el Programa](#bookmark=id.v4za3ruim6xq)  
   * [Cálculo Iterativo del Volumen](#bookmark=id.gnmxw7o5ixky)  
   * [Condición de Parada](#bookmark=id.pid2gkog9gg9)  
   * [Visualización de Iteraciones](#bookmark=id.5n93zsqumntp)  
5. [Uso de la Aplicación](#bookmark=id.ek0r1rpdfoad)  
6. [Estructura del Proyecto](#bookmark=id.lvg4d5hqvhvp)

## **1\. Introducción**

En el estudio de los gases, el modelo de gas ideal (PV=RT) es una aproximación útil, pero no describe con precisión el comportamiento de los gases reales, especialmente a altas presiones y bajas temperaturas, donde las interacciones intermoleculares y el volumen de las moléculas se vuelven significativos. La ecuación virial es una de las herramientas más utilizadas para describir el comportamiento de los gases reales, introduciendo coeficientes que corrigen las desviaciones del comportamiento ideal.

## **2\. La Ecuación Virial**

La ecuación virial expresa el factor de compresibilidad (Z) o el volumen (V) en función de la presión o el volumen, mediante una serie de potencias inversas de V o directas de P. La forma más común, y la utilizada en esta calculadora, es:  
V=PRT​(1+VB​+V2C​)  
Donde:

* V: Volumen molar del gas real (L/mol)  
* R: Constante de los gases ideales (L·atm/(mol·K))  
* T: Temperatura (K)  
* P: Presión (atm)  
* B: Segundo coeficiente virial (L/mol)  
* C: Tercer coeficiente virial (L²/mol²)

Los coeficientes viriales (B, C, etc.) son empíricos y dependen de la naturaleza del gas y la temperatura. Capturan los efectos de las interacciones moleculares y el volumen molecular.

## **3\. El Factor de Compresibilidad (Z)**

El factor de compresibilidad (Z) es una cantidad adimensional que describe la desviación de un gas real del comportamiento de un gas ideal. Se define como:  
Z=RTPV​  
Para un gas ideal, Z=1. Para gases reales, Z puede ser mayor o menor que 1, dependiendo de la temperatura y la presión, indicando que el gas es más o menos compresible que un gas ideal, respectivamente.  
Al sustituir la ecuación virial en la definición de Z, obtenemos:  
Z=1+VB​+V2C​  
Esta calculadora determina el volumen real (V) de forma iterativa y luego utiliza este valor para calcular Z.

## **4\. Cómo Funciona el Programa**

La ecuación virial es una ecuación implícita para V, lo que significa que V aparece en ambos lados de la ecuación y no se puede despejar fácilmente de forma analítica (excepto en casos simplificados). Por lo tanto, el programa utiliza un método iterativo de punto fijo para encontrar el valor de V.

### **Cálculo Iterativo del Volumen**

El programa sigue estos pasos para encontrar el volumen real:

1. **Estimación Inicial (**V0​**)**: La primera suposición para el volumen real es el volumen molar del gas ideal, calculado como Videal​=PRT​. Esta es una buena aproximación de partida, especialmente a bajas presiones.  
2. Iteración: En cada paso de la iteración, se utiliza el valor de volumen de la iteración anterior (o la suposición inicial) en el lado derecho de la ecuación virial para calcular un nuevo valor para V. La fórmula de iteración es:  
   Vn+1​=Videal​(1+Vn​B​+Vn2​C​)

   Donde Vn​ es el volumen de la iteración actual y Vn+1​ es el volumen calculado para la siguiente iteración.  
3. **Convergencia**: Este proceso se repite hasta que el valor de V converge.

### **Condición de Parada**

El bucle iterativo se detiene bajo una de las siguientes condiciones:

* **Convergencia de V**: La diferencia absoluta entre el V\_current (volumen calculado en la iteración actual) y V\_previous (volumen de la iteración anterior) es menor que una tolerance predefinida (1×10−6). Esto significa que el valor de V ha cambiado muy poco entre iteraciones y se considera que ha convergido a una solución estable.  
* **Número Máximo de Iteraciones**: Si el cálculo no converge después de un maxIterations (fijado en 100), el bucle se detiene para evitar ciclos infinitos y se muestra una advertencia.

### **Visualización de Iteraciones**

La aplicación muestra cada paso del proceso iterativo en una lista, permitiéndote observar cómo el valor de V se ajusta con cada iteración hasta que converge. Esto es útil para comprender cómo se llega a la solución.

## **5\. Uso de la Aplicación**

1. **Abrir index.html**: Abre el archivo index.html en tu navegador web.  
2. **Ingresar Parámetros**: Introduce los valores para la Constante de Gas (R), Temperatura (T), Presión (P), y los Coeficientes Viriales (B y C) en los campos de entrada. Se proporcionan valores predeterminados para una prueba rápida.  
3. **Hacer Clic en "Calcular Volumen y Z"**: Haz clic en el botón para iniciar el cálculo.  
4. **Ver Resultados**: Los resultados, incluyendo el volumen del gas ideal, el volumen del gas real, el factor de compresibilidad (Z) y el número de iteraciones, se mostrarán en la sección "Resultados del Cálculo".  
5. **Ver Detalles de la Iteración**: La sección "Detalles de la Iteración" mostrará una lista de los valores de volumen calculados en cada paso del proceso iterativo.

## **6\. Estructura del Proyecto**

El proyecto está organizado en tres archivos principales para una clara separación de responsabilidades:

* **index.html**: Contiene la estructura HTML de la página web, incluyendo el formulario de entrada, el botón y los contenedores para mostrar los resultados y los detalles de la iteración. Es el punto de entrada de la aplicación.  
* **styles.css**: Proporciona los estilos CSS para la aplicación, implementando un tema de modo oscuro y asegurando un diseño responsivo y estético.  
* **main.js**: Contiene la lógica principal de JavaScript para:  
  * Manejar la entrada del usuario.  
  * Realizar el cálculo iterativo del volumen molar del gas real utilizando la ecuación virial.  
  * Calcular el factor de compresibilidad (Z).  
  * Actualizar dinámicamente la interfaz de usuario con los resultados y los pasos de la iteración.  
  * Manejar validaciones de entrada y errores.