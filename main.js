
// ¡Hola! Este programa es una calculadora para gases. Es como una calculadora mágica para saber cuánto espacio ocupa un gas.

// Cuando la página se carga completamente, preparamos todo para que funcione
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el botón que dice "Calcular" en la página
    // Es como buscar un juguete en tu cuarto
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Si encontramos el botón...
    if (calculateBtn) {
        // Le decimos: "Cuando alguien te haga clic, haz los cálculos"
        // Es como decirle a un amigo: "Cuando te toque, empieza a contar"
        calculateBtn.addEventListener('click', calculateRealGasVolume);
        console.log("¡El botón de calcular está listo para usarse!"); // Un mensaje secreto para los programadores
    } else {
        // Si no encontramos el botón, avisamos que hay un problema
        // Es como cuando no encuentras tu juguete favorito y tienes que avisar
        console.error("¡Oh no! No encuentro el botón de calcular en la página"); 
    }
});

// Esta es la función principal que hace todos los cálculos
// Como cuando te piden resolver un problema de matemáticas paso a paso
function calculateRealGasVolume() {
    console.log("¡Empezamos a calcular!"); // Un mensaje secreto para los programadores
    
    // Recogemos los números que la persona escribió en los cuadritos
    // Es como cuando recoges los ingredientes para una receta de cocina
    const R = parseFloat(document.getElementById('R_val').value);  // R es la constante de los gases, como la receta base
    const T = parseFloat(document.getElementById('T_val').value);  // T es la temperatura, como qué tan caliente está el horno
    const P = parseFloat(document.getElementById('P_val').value);  // P es la presión, como cuánto aprietas algo
    const B = parseFloat(document.getElementById('B_val').value);  // B es un número especial para el tipo de gas
    const C = parseFloat(document.getElementById('C_val').value);  // C es otro número especial para el gas
    
    // Buscamos dónde vamos a mostrar los resultados
    // Como preparar los platos donde serviremos la comida
    const vIdealOutput = document.getElementById('vIdealOutput');           // Aquí mostraremos el tamaño ideal del gas
    const vRealOutput = document.getElementById('vRealOutput');             // Aquí mostraremos el tamaño real del gas
    const zFactorOutput = document.getElementById('zFactorOutput');         // Aquí mostraremos un número especial llamado Z
    const iterationsOutput = document.getElementById('iterationsOutput');   // Aquí mostraremos cuántas veces tuvimos que calcular
    const messageBox = document.getElementById('messageBox');               // Aquí mostraremos mensajes importantes
    const resultsDiv = document.getElementById('results');                  // Esta es la caja grande donde va todo
    const iterationDetailsDiv = document.getElementById('iterationDetails'); // Aquí mostramos todos los pasos
    const iterationList = document.getElementById('iterationList');         // Esta es la lista de todos los cálculos    // Limpiamos todos los resultados anteriores
    // Es como limpiar tu mesa antes de empezar a dibujar
    vIdealOutput.textContent = '';                        // Borramos el número del tamaño ideal
    vRealOutput.textContent = '';                         // Borramos el número del tamaño real
    zFactorOutput.textContent = '';                       // Borramos el número Z
    iterationsOutput.textContent = '';                    // Borramos el contador de intentos
    messageBox.className = 'message';                     // Quitamos los colores de los mensajes
    messageBox.textContent = '';                          // Borramos los mensajes
    resultsDiv.classList.add('hidden');                   // Escondemos la caja de resultados
    iterationDetailsDiv.classList.add('hidden');          // Escondemos los detalles
    iterationList.innerHTML = '';                         // Borramos la lista de cálculos
    
    // Revisamos si los números que nos dieron son correctos
    // Es como revisar si tienes todos los ingredientes para hacer galletas
    if (isNaN(R) || isNaN(T) || isNaN(P) || isNaN(B) || isNaN(C)) {
        // Si falta algún número o escribieron letras en vez de números...
        messageBox.classList.add('error');                // Ponemos el mensaje en rojo
        messageBox.textContent = 'Error: Por favor, ingrese valores numéricos válidos para todos los campos.';
        resultsDiv.classList.remove('hidden');            // Mostramos la caja de mensajes
        return;                                           // Paramos aquí, no podemos seguir sin números correctos
    }
    
    // Revisamos que la temperatura y presión sean positivas
    // Es como asegurarse que no haga frío bajo cero en el horno
    if (T <= 0 || P <= 0) {
        messageBox.classList.add('error');                // Ponemos el mensaje en rojo
        messageBox.textContent = 'Error: La Temperatura y la Presión deben ser valores positivos.';
        resultsDiv.classList.remove('hidden');            // Mostramos la caja de mensajes
        return;                                           // Paramos aquí, no podemos seguir con números negativos
    }    // Calculamos el tamaño que tendría el gas si fuera perfecto (ideal)
    // Es como calcular cuánto espacio ocuparía tu colección de juguetes si todos fueran del mismo tamaño
    const V_ideal = (R * T) / P;
    console.log(`El tamaño ideal del gas sería: ${V_ideal.toFixed(4)} L/mol`); 
    
    // Preparamos todo para empezar a calcular el tamaño real
    // Es como preparar los materiales antes de empezar un experimento
    let V_current = V_ideal;                             // Empezamos con el tamaño ideal como primera suposición
    let V_previous = 0;                                  // Guardamos un espacio para recordar el cálculo anterior
    const tolerance = 0.000001;                          // Decidimos cuándo dos números son "casi iguales"
    let iteration = 0;                                   // Contamos cuántas veces hacemos el cálculo
    const maxIterations = 100;                           // Decidimos no intentar más de 100 veces
    let stopConditionMet = false;                        // Una banderita para saber si terminamos bien
    let zFactor = 1.0;                                   // Un número especial que nos dice qué tan "no ideal" es el gas
    
    // Empezamos a hacer los cálculos paso a paso
    // Es como resolver un rompecabezas difícil poco a poco
    try {
        // Mostramos nuestro primer intento (el tamaño ideal)
        // Es como anotar nuestro primer intento en un juego
        let listItem = document.createElement('li');                        // Creamos un punto en la lista
        listItem.textContent = `V₀ = ${V_ideal.toFixed(6)} L/mol (Empezamos con el tamaño ideal)`; // Escribimos el valor
        iterationList.appendChild(listItem);                               // Lo ponemos en la lista        // Empezamos un ciclo para hacer muchos intentos hasta encontrar la respuesta
        // Es como seguir intentando hasta adivinar un número secreto
        do {
            // Guardamos nuestro cálculo actual para compararlo después
            V_previous = V_current;
            
            // Nos aseguramos que el número no sea muy pequeñito
            // Es como asegurarnos de que no intentamos dividir un pastel entre mil personas
            if (Math.abs(V_previous) < 0.0000000001) {
                // Si el número es muy pequeñito, nos detenemos y mostramos un error
                messageBox.classList.add('error');
                messageBox.textContent = "Error: El tamaño se volvió tan pequeñito que casi desaparece. Esto no debería pasar.";
                stopConditionMet = false;
                break;                                   // Salimos del ciclo, no podemos seguir
            }
            
            // Calculamos el nuevo tamaño usando una fórmula especial (ecuación virial)
            // Es como una receta mágica para gases no perfectos
            V_current = V_ideal * (1 + (B / V_previous) + (C / (V_previous * V_previous)));
            console.log(`Intento ${iteration + 1}: Nuevo tamaño = ${V_current.toFixed(6)} L/mol`);
            
            // Aumentamos nuestro contador de intentos
            iteration++;
            
            // Anotamos este nuevo intento en nuestra lista
            // Como apuntar cada intento en un juego de adivinanzas
            listItem = document.createElement('li');
            listItem.textContent = `V${iteration} = ${V_current.toFixed(6)} L/mol`;
            iterationList.appendChild(listItem);
            
            // Revisamos si ya encontramos la respuesta
            // Es como cuando juegas "caliente-frío" y ya estás muy cerca
            if (Math.abs(V_current - V_previous) < tolerance) {
                // ¡Encontramos la respuesta! Los números son casi iguales
                stopConditionMet = true;
                console.log("¡Lo logramos! El tamaño del gas ya no cambia mucho entre cálculos.");
                break;                                  // Salimos del ciclo, ya terminamos
            }
            
        } while (iteration < maxIterations);           // Seguimos intentando hasta 100 veces        // Calculamos el factor Z, que nos dice qué tan diferente es el gas real del ideal
        // Es como medir qué tan diferente eres de tu hermano gemelo
        if (P !== 0 && R !== 0 && T !== 0) {
            zFactor = (P * V_current) / (R * T);
        } else {
            console.warn("No pudimos calcular Z porque algunos números importantes son cero.");
        }
        
        // Mostramos todos los resultados en la página
        // Es como presentar tu proyecto de ciencias después de terminarlo
        vIdealOutput.textContent = `${V_ideal.toFixed(4)} L/mol`;           // Mostramos el tamaño ideal
        vRealOutput.textContent = `${V_current.toFixed(4)} L/mol`;          // Mostramos el tamaño real
        zFactorOutput.textContent = `${zFactor.toFixed(4)}`;                // Mostramos el factor Z
        iterationsOutput.textContent = iteration;                           // Mostramos cuántos intentos hicimos
        
        // Mostramos un mensaje final según cómo terminó todo
        // Es como dar la noticia de si ganaste o perdiste un juego
        if (stopConditionMet) {
            // ¡Todo salió bien! Encontramos la respuesta
            messageBox.classList.add('success');                            // Ponemos el mensaje en verde
            messageBox.textContent = "¡Cálculo completado! El tamaño del gas ya no cambia después de " + iteration + " intentos.";
        } else if (iteration >= maxIterations) {
            // Hicimos muchos intentos pero no terminamos del todo
            messageBox.classList.add('warning');                            // Ponemos el mensaje en amarillo
            messageBox.textContent = "Aviso: Hicimos muchos intentos (100) pero no estamos totalmente seguros de la respuesta.";
        } else {
            // Algo salió mal y no pudimos encontrar la respuesta
            messageBox.classList.add('error');                              // Ponemos el mensaje en rojo
            messageBox.textContent = "El cálculo no funcionó bien. Por favor, revisa los números que escribiste y vuelve a intentar.";
        }    } catch (error) {
        // Si ocurre algún error inesperado, lo manejamos aquí
        // Es como tener un plan B por si algo sale mal
        messageBox.classList.add('error');                                 // Ponemos el mensaje en rojo
        messageBox.textContent = `Ocurrió un problema que no esperábamos: ${error.message}`;
        console.error("¡Oh no! Ocurrió un error:", error);                // Mensaje secreto para programadores
    } finally {
        // Siempre mostramos los resultados, aunque haya habido un error
        // Es como siempre limpiar después de jugar, incluso si el juego no terminó bien
        resultsDiv.classList.remove('hidden');                            // Mostramos la caja de resultados
        iterationDetailsDiv.classList.remove('hidden');                   // Mostramos los detalles paso a paso
        console.log("Estamos mostrando los resultados.");                 // Mensaje secreto para programadores
    }
}
// ¡Fin del programa! Gracias por leer el código :)
