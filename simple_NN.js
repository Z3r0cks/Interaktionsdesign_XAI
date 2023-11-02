class NeuralNetwork {
   constructor(inputNodes, hiddenNodes, outputNodes) {
      this.inputNodes = inputNodes;
      this.hiddenNodes = hiddenNodes;
      this.outputNodes = outputNodes;

      // Initialize weights with random values between -1 and 1
      this.weightsInputToHidden = new Matrix(this.hiddenNodes, this.inputNodes);
      this.weightsInputToHidden.randomize();
      this.weightsHiddenToOutput = new Matrix(this.outputNodes, this.hiddenNodes);
      this.weightsHiddenToOutput.randomize();

      // Initialize biases with random values between -1 and 1
      this.biasHidden = new Matrix(this.hiddenNodes, 1);
      this.biasHidden.randomize();
      this.biasOutput = new Matrix(this.outputNodes, 1);
      this.biasOutput.randomize();
   }

   feedforward(inputArray) {
      // Convert input array to matrix
      let inputs = Matrix.fromArray(inputArray);

      // Calculate hidden layer
      let hidden = Matrix.multiply(this.weightsInputToHidden, inputs);
      hidden.add(this.biasHidden);
      hidden.map(sigmoid);

      // Calculate output layer
      let output = Matrix.multiply(this.weightsHiddenToOutput, hidden);
      output.add(this.biasOutput);
      output.map(sigmoid);

      // Convert output matrix to array and return
      return output.toArray();
   }

   train(inputArray, targetArray) {
      // Convert input and target arrays to matrices
      let inputs = Matrix.fromArray(inputArray);
      let targets = Matrix.fromArray(targetArray);

      // Calculate hidden layer
      let hidden = Matrix.multiply(this.weightsInputToHidden, inputs);
      hidden.add(this.biasHidden);
      hidden.map(sigmoid);

      // Calculate output layer
      let outputs = Matrix.multiply(this.weightsHiddenToOutput, hidden);
      outputs.add(this.biasOutput);
      outputs.map(sigmoid);

      // Calculate output layer errors
      let outputErrors = Matrix.subtract(targets, outputs);

      // Calculate hidden layer errors
      let hiddenErrors = Matrix.multiply(Matrix.transpose(this.weightsHiddenToOutput), outputErrors);

      // Calculate output layer gradients
      let outputGradients = Matrix.map(outputs, dsigmoid);
      outputGradients.multiply(outputErrors);
      outputGradients.multiply(0.1);

      // Calculate hidden layer gradients
      let hiddenGradients = Matrix.map(hidden, dsigmoid);
      hiddenGradients.multiply(hiddenErrors);
      hiddenGradients.multiply(0.1);

      // Adjust output layer weights and biases
      let weightsHiddenToOutputDeltas = Matrix.multiply(outputGradients, Matrix.transpose(hidden));
      this.weightsHiddenToOutput.add(weightsHiddenToOutputDeltas);
      this.biasOutput.add(outputGradients);

      // Adjust hidden layer weights and biases
      let weightsInputToHiddenDeltas = Matrix.multiply(hiddenGradients, Matrix.transpose(inputs));
      this.weightsInputToHidden.add(weightsInputToHiddenDeltas);
      this.biasHidden.add(hiddenGradients);
   }
}

function sigmoid(x) {
   return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
   return y * (1 - y);
}

class Matrix {
   constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = [];

      for (let i = 0; i < rows; i++) {
         this.data[i] = [];
         for (let j = 0; j < cols; j++) {
            this.data[i][j] = 0;
         }
      }
   }

   randomize() {
      for (let i = 0; i < this.rows; i++) {
         for (let j = 0; j < this.cols; j++) {
            this.data[i][j] = Math.random() * 2 - 1;
         }
      }
   }

   toArray() {
      let arr = [];
      for (let i = 0; i < this.rows; i++) {
         for (let j = 0; j < this.cols; j++) {
            arr.push(this.data[i][j]);
         }
      }
      return arr;
   }

   static fromArray(arr) {
      let m = new Matrix(arr.length, 1);
      for (let i = 0; i < arr.length; i++) {
         m.data[i][0] = arr[i];
      }
      return m;
   }

   map(func) {
      for (let i = 0; i < this.rows; i++) {
         for (let j = 0; j < this.cols; j++) {
            let val = this.data[i][j];
            this.data[i][j] = func(val);
         }
      }
   }

   static map(matrix, func) {
      let result = new Matrix(matrix.rows, matrix.cols);
      for (let i = 0; i < matrix.rows; i++) {
         for (let j = 0; j < matrix.cols; j++) {
            let val = matrix.data[i][j];
            result.data[i][j] = func(val);
         }
      }
      return result;
   }

   multiply(n) {
      if (n instanceof Matrix) {
         // Matrix multiplication
         if (this.cols !== n.rows) {
            console.error('Columns of A must match rows of B');
            return undefined;
         }
         let result = new Matrix(this.rows, n.cols);
         for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < n.cols; j++) {
               let sum = 0;
               for (let k = 0; k < this.cols; k++) {
                  sum += this.data[i][k] * n.data[k][j];
               }
               result.data[i][j] = sum;
            }
         }
         return result;
      } else {
         // Scalar multiplication
         let result = new Matrix(this.rows, this.cols);
         for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
               result.data[i][j] = this.data[i][j] * n;
            }
         }
         return result;
      }
   }

   add(n) {
      if (n instanceof Matrix) {
         // Matrix addition
         if (this.rows !== n.rows || this.cols !== n.cols) {
            console.error('Matrices must have the same dimensions');
            return undefined;
         }
         for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
               this.data[i][j] += n.data[i][j];
            }
         }
      } else {
         // Scalar addition
         for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
               this.data[i][j] += n;
            }
         }
      }
   }

   static subtract(a, b) {
      let result = new Matrix(a.rows, a.cols);
      for (let i = 0; i < result.rows; i++) {
         for (let j = 0; j < result.cols; j++) {
            result.data[i][j] = a.data[i][j] - b.data[i][j];
         }
      }
      return result;
   }

   static transpose(matrix) {
      let result = new Matrix(matrix.cols, matrix.rows);
      for (let i = 0; i < matrix.rows; i++) {
         for (let j = 0; j < matrix.cols; j++) {
            result.data[j][i] = matrix.data[i][j];
         }
      }
      return result;
   }
}

export default NeuralNetwork;
