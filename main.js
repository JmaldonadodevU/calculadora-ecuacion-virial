document.addEventListener('DOMContentLoaded', () => {
    // Adjuntar el oyente de eventos al botón de calcular
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRealGasVolume);
        console.log("Oyente de eventos adjunto al botón de calcular."); // Mensaje de depuración
    } else {
        console.error("¡Botón de calcular no encontrado!"); // Mensaje de error si el botón no se encuentra
    }
});

function calculateRealGasVolume() {
    console.log("Función calculateRealGasVolume llamada."); // Mensaje de depuración al inicio de la función

    // Obtener los valores de los campos de entrada
    const R = parseFloat(document.getElementById('R_val').value);
    const T = parseFloat(document.getElementById('T_val').value);
    const P = parseFloat(document.getElementById('P_val').value);
    const B = parseFloat(document.getElementById('B_val').value);
    const C = parseFloat(document.getElementById('C_val').value);

    // Obtener los elementos de salida
    const vIdealOutput = document.getElementById('vIdealOutput');
    const vRealOutput = document.getElementById('vRealOutput');
    const zFactorOutput = document.getElementById('zFactorOutput'); // Elemento para Z
    const iterationsOutput = document.getElementById('iterationsOutput');
    const messageBox = document.getElementById('messageBox');
    const resultsDiv = document.getElementById('results');
    const iterationDetailsDiv = document.getElementById('iterationDetails'); // Elemento para detalles de iteración
    const iterationList = document.getElementById('iterationList');     // Lista de iteraciones

    // Limpiar resultados y mensajes anteriores
    vIdealOutput.textContent = '';
    vRealOutput.textContent = '';
    zFactorOutput.textContent = ''; // Limpiar Z
    iterationsOutput.textContent = '';
    messageBox.className = 'message'; // Restablecer clases
    messageBox.textContent = '';
    resultsDiv.classList.add('hidden'); // Ocultar resultados hasta que se calculen
    iterationDetailsDiv.classList.add('hidden'); // Ocultar detalles de iteración
    iterationList.innerHTML = ''; // Limpiar lista de iteraciones

    // Validación de entrada
    if (isNaN(R) || isNaN(T) || isNaN(P) || isNaN(B) || isNaN(C)) {
        messageBox.classList.add('error');
        messageBox.textContent = 'Error: Por favor, ingrese valores numéricos válidos para todos los campos.';
        resultsDiv.classList.remove('hidden'); // Mostrar la caja de mensajes
        return;
    }
    if (T <= 0 || P <= 0) {
        messageBox.classList.add('error');
        messageBox.textContent = 'Error: La Temperatura y la Presión deben ser valores positivos.';
        resultsDiv.classList.remove('hidden');
        return;
    }

    // Calcular el volumen del gas ideal
    const V_ideal = (R * T) / P;
    console.log(`V_ideal calculado: ${V_ideal.toFixed(4)} L/mol`); // Mensaje de depuración

    let V_current = V_ideal; // Iniciar la iteración con el volumen del gas ideal como suposición inicial
    let V_previous = 0; // Inicializar V_previous a 0 para asegurar que la primera diferencia no sea cero si V_ideal es 0
    const tolerance = 1e-6; // Tolerancia para la convergencia
    let iteration = 0;
    const maxIterations = 100; // Un límite más conservador para la visualización
    let stopConditionMet = false;
    let zFactor = 1.0; // Inicializar Z factor

    try {
        // Mostrar la suposición inicial V0
        let listItem = document.createElement('li');
        listItem.textContent = `V₀ = ${V_ideal.toFixed(6)} L/mol (Inicio con V_ideal)`;
        iterationList.appendChild(listItem);

        do {
            V_previous = V_current;

            // Evitar la división por cero o números muy pequeños
            if (Math.abs(V_previous) < 1e-10) {
                messageBox.classList.add('error');
                messageBox.textContent = "Error: El volumen se volvió demasiado pequeño (casi cero) durante la iteración, lo que podría indicar un problema físico o de cálculo.";
                stopConditionMet = false;
                break;
            }

            // Calcular el nuevo V usando la ecuación virial
            // V = V_ideal * (1 + B/V_previous + C/V_previous^2)
            V_current = V_ideal * (1 + (B / V_previous) + (C / (V_previous * V_previous)));
            console.log(`Iteración ${iteration + 1}: V_current = ${V_current.toFixed(6)} L/mol`);

            iteration++;

            // Añadir cada paso de iteración a la lista visual
            listItem = document.createElement('li');
            listItem.textContent = `V${iteration} = ${V_current.toFixed(6)} L/mol`;
            iterationList.appendChild(listItem);


            // Condición de parada principal: Cuando el volumen del gas real converge
            // Es decir, cuando la diferencia entre V_current y V_previous es muy pequeña
            if (Math.abs(V_current - V_previous) < tolerance) {
                stopConditionMet = true;
                console.log("Condición de parada cumplida: Volumen del gas real ha convergido.");
                break;
            }

        } while (iteration < maxIterations);

        // Calcular el factor Z usando el V_current final
        if (P !== 0 && R !== 0 && T !== 0) {
            zFactor = (P * V_current) / (R * T);
        } else {
            console.warn("No se pudo calcular Z debido a valores de P, R o T iguales a cero.");
        }

        // Mostrar resultados
        vIdealOutput.textContent = `${V_ideal.toFixed(4)} L/mol`;
        vRealOutput.textContent = `${V_current.toFixed(4)} L/mol`;
        zFactorOutput.textContent = `${zFactor.toFixed(4)}`; // Mostrar Z
        iterationsOutput.textContent = iteration;

        if (stopConditionMet) {
            messageBox.classList.add('success');
            messageBox.textContent = "¡Cálculo completado! El volumen del gas real ha convergido después de " + iteration + " iteraciones.";
        } else if (iteration >= maxIterations) {
            messageBox.classList.add('warning');
            messageBox.textContent = "Advertencia: Se alcanzó el número máximo de iteraciones. La condición de igualdad puede no haberse cumplido completamente.";
        } else {
            messageBox.classList.add('error');
            messageBox.textContent = "El cálculo no convergió correctamente. Por favor, verifique los valores de entrada y vuelva a intentarlo.";
        }
    } catch (error) {
        messageBox.classList.add('error');
        messageBox.textContent = `Se produjo un error durante el cálculo: ${error.message}`;
        console.error("Error durante el cálculo:", error);
    } finally {
        resultsDiv.classList.remove('hidden'); // Siempre mostrar la caja de resultados
        iterationDetailsDiv.classList.remove('hidden'); // Mostrar los detalles de la iteración
        console.log("Intento de mostrar resultados.");
    }
}
