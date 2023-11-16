import * as tf from '@tensorflow/tfjs';

// Erstellen eines sequentiellen Modells
const model = tf.sequential();

// Hinzufügen des Eingabelayers
// Da es das erste Layer ist, müssen Sie 'inputShape' angeben
model.add(tf.layers.dense({ units: 5, inputShape: [5], activation: 'relu' }));

// Hinzufügen von drei Hidden Layern
// Für diese Layer ist 'inputShape' nicht erforderlich, da TensorFlow.js die Form automatisch ermittelt
model.add(tf.layers.dense({ units: 5, activation: 'relu' }));
model.add(tf.layers.dense({ units: 5, activation: 'relu' }));
model.add(tf.layers.dense({ units: 5, activation: 'relu' }));

// Hinzufügen des Ausgabelayers
model.add(tf.layers.dense({ units: 5 }));

// Kompilieren des Modells
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

// Ausgabe der Modellzusammenfassung zur Überprüfung
// model.summary();  

console.log('model: ', model.layers[0].units);


// // Define a model for linear regression.
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

// model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

// console.log('model: ', model.layers[0]);

// Generate some synthetic data for training.
// const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
// const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// // Train the model using the data.
// model.fit(xs, ys, { epochs: 10 }).then(() => {
//    // Use the model to do inference on a data point the model hasn't seen before:
//    model.predict(tf.tensor2d([5], [1, 1])).print();
//    // Open the browser devtools to see the output
// });