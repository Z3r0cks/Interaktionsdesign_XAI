// linear function z = wx + b
// w = weight
// b = bias
// z = output for activation function
// x = input	

// Activation function
// sigmoid function = 1 / (1 + e^-z)
// relu function = max(0, z)

// Loss function
// MSE = mean squared error = 1/n * (y - y')^2
// y = actual value
// y' = predicted value
// n = number of training samples

// Gradient descent
// w = w - alpha * dL/dw
// w = weight
// alpha = learning rate
// dL/dw = derivative of loss function with respect to weight

// Backpropagation
// dL/dw = dL/dy' * dy'/dz * dz/dw
// dL/dw = weights from w
// dL/dy' = derivative of loss function with respect to predicted value
// dy'/dz = derivative of activation function with respect to output

// Questions for a XAI neural network: regocnize logical operators (AND, OR, XOR), simple classification (eg. iris dataset), simple regression (eg. house prices)
// What to use for XAI: Visualize the weights and/or biases. Show the activation function. Virsualzie the desicion boundary.

// every neuron needs his own weight and bias

// create one neuron

const trainingInput = [[0, 0], [0, 1], [1, 0], [1, 1]];
const labelAnd = [0, 0, 0, 1];
const labelOr = [0, 1, 1, 1];
const labelXor = [0, 1, 1, 0];

const outputDiv = document.getElementById('output');
const calcBtn = document.getElementById('calc');
const inputBtn = document.getElementById('input');

// random weights and biases between -1 and 1
let biases = [
   [-Math.random(), -Math.random(), -Math.random()], // Biases for the three neurons in hidden layer
   [-Math.random()] // Bias for the single neuron in output layer
];

let weights = [
   [
      [0.3, 0.2, 0.1], // Weights from input to first neuron in hidden layer
      [0.3, -0.1, 0.2], //                    to second 
      [-0.5, 0.4, 0.3]  //                    to third 
   ],
   [
      [-0.3, 0.1, 0.7]  // Weights from hidden layer to the single neuron in output layer
   ]
];

// let hiddenOutputs = [];
let inputs = [0.5, 0.6, 0.7]; // Example inputs

calcBtn.addEventListener('click', () => {
   let inputs = inputBtn.value;

   // Process through the hidden layer
   let hiddenOutputs = [];
   for (let i = 0; i < 3; i++) {
      let result = weightedSum(inputs, weights[0][i], biases[0][i]);
      hiddenOutputs.push(activationSigmoid(result));
   }

   // Process through the output layer
   let finalOutput = weightedSum(hiddenOutputs, weights[1][0], biases[1][0]);
   finalOutput = activationSigmoid(finalOutput);
   const bool = finalOutput > 0.5 ? "true" : "false";
   outputDiv.innerHTML = `${finalOutput} ${bool} (Sigmoid)`;
});

function weightedSum(input, weights, bias) {
   let sum = 0;
   for (let i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
   }
   return sum + bias;
}

function activationSigmoid(z) {
   return 1 / (1 + Math.exp(-z));
}

// function activationRelu(z) {
//    return Math.max(0, z);
// }


// function neuron(x, w, b) {
//    return x * w + b;
// }


// function loss(y, yPrime) {
//    return Math.pow(y - yPrime, 2);
// }

// function derivativeLoss(y, yPrime) {
//    return 2 * (y - yPrime);
// }



// Gradient descent
// w = w - alpha * dL/dw
// w = weight
// alpha = learning rate
// dL/dw = derivative of loss function with respect to weight


// alpha = 0.0001

// theta = np.random.random_sample((14,1))
// num_iters = 1000

// # Perform gradient descent
// for i in range(num_iters):
//     # Compute the predicted values for the current parameters
//     y_pred = X_train @ theta
    
//     # Compute the errors between predicted and target values
//     errors = y_pred - y_train
    
//     # Compute the gradients of the cost function with respect to theta
//     gradients = np.transpose(X_train) @ errors
    
//     # Update the parameters using the gradients and learning rate
//     theta = theta - alpha * gradients
    
//     # Print the cost function every 100 iterations
//     if i % 100 == 0:
//         cost = np.mean(errors ** 2)
//         print(f"Iteration {i}: Cost = {cost}")
