import * as THREE from 'three';
import NeuralNetwork from './simple_NN.js';

let NN;

const cameraX = document.getElementById('cameraX');
const cameraY = document.getElementById('cameraY');
const cameraZ = document.getElementById('cameraZ');

const inputInput = document.getElementById('inputInput');
// const hiddenInput = document.getElementById('inputHidden');
const outputInput = document.getElementById('inputOutput');
const connBox = document.getElementById('connBox');
const hiddenLayerCount = document.getElementById('hiddenLayerCount');

const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.1; // Adjust this value as needed
const mouse = new THREE.Vector2();

hiddenLayerCount.addEventListener('input', function () {
   const wrapper = document.querySelector('#hiddelLayerWrapper');
   wrapper.innerHTML = '';
   for (let i = 0; i < this.value; i++) {
      const hiddenInput = document.createElement('input');
      const hiddenLabel = document.createElement('label');
      hiddenLabel.innerText = `Hidden Layer ${i + 1}`;
      hiddenInput.id = `inputHidden${i}`;
      hiddenInput.type = 'range';
      hiddenInput.min = 1;
      hiddenInput.max = 20;
      hiddenInput.value = 1;
      hiddenInput.addEventListener('input', function () {
         // generateVisualNN(inputInput.value, getAllHiddenLayer(), outputInput.value)
      });
      wrapper.append(hiddenLabel, hiddenInput);
   }
   console.log(inputInput.value);
   // generateNeuralNetwork(inputInput.value, getAllHiddenLayer(), outputInput.value);
   // createNeuralNodes(inputInput.value, getAllHiddenLayer(), outputInput.value);
});

function generateNeuralNetwork(input, hidde, output) {
   console.log("testgnn");
   // console.log(input, hidde, output);
}

function createNeuralNodes(input, hidden, output) {
   neuralNodes = [input, hidden, output];
}

function getAllHiddenLayer() {
   const hiddenLayers = [];
   for (let i = 0; i < hiddenLayerCount.value; i++) {
      hiddenLayers.push(document.getElementById(`inputHidden${i}`).value);
   }
   return hiddenLayers;
}

// let neuralNodes = [];
// let [inputNodes, hiddenNodes, outputNodes] = [];

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const sphereDistance = 1.5;

// function showNeuronTooltip(neuronData, position) {
//    const tooltip = document.getElementById('neuronTooltip') || createTooltip();
//    tooltip.innerHTML = `Neuron Data: ${JSON.stringify(neuronData)}`;
//    tooltip.style.display = 'block';
//    tooltip.style.left = `${position.x}px`;
//    tooltip.style.top = `${position.y}px`;
// }

// function hideNeuronTooltip() {
//    const tooltip = document.getElementById('neuronTooltip');
//    if (tooltip) {
//       tooltip.style.display = 'none';
//    }
// }

// function createTooltip() {
//    const tooltip = document.createElement('div');
//    tooltip.id = 'neuronTooltip';
//    tooltip.style.position = 'absolute';
//    tooltip.style.padding = '5px';
//    tooltip.style.background = 'rgba(0, 0, 0, 0.75)';
//    tooltip.style.color = 'white';
//    tooltip.style.borderRadius = '4px';
//    tooltip.style.pointerEvents = 'none'; // Damit der Tooltip nicht mit der Maus interferiert
//    document.body.appendChild(tooltip);
//    return tooltip;
// }


// function onMouseMove(event) {
//    // Update the mouse position
//    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//    // Raycasting for tooltips
//    raycaster.setFromCamera(mouse, camera);
//    const intersects = raycaster.intersectObjects(scene.children);

//    if (intersects.length > 0) {
//       const closestIntersectedObject = intersects[0].object;
//       if (closestIntersectedObject.isNeuron) {
//          showNeuronTooltip(closestIntersectedObject.neuronData, {
//             x: event.clientX,
//             y: event.clientY
//          });
//       } else {
//          hideNeuronTooltip();
//       }
//    } else {
//       hideNeuronTooltip();
//    }
// }
// window.addEventListener('mousemove', onMouseMove);

// connBox.addEventListener('change', () => {
//    if (connBox.checked) {
//       connectNodes(inputNodes, hiddenNodes, 0xaaaaaa);
//       connectNodes(hiddenNodes, outputNodes, 0xaaaaaa);
//    } else {
//       scene.clear();
//       generateNodes(inputInput.value, -2, 0xee6363, NN.inputNodes, inputNodes);
//       generateNodes(hiddenInput.value, 0, 0x58ea8e, NN.hiddenNodes, hiddenNodes);
//       generateNodes(outputInput.value, 2, 0x4f6357, NN.outputNodes, outputNodes);
//    }
// });

// function generateVisualNN(input, hidden, output) {
//    scene.clear();
//    inputNodes = [];
//    hiddenNodes = [];
//    outputNodes = [];
//    NN = new NeuralNetwork(input, hidden, output);

//    // Erstellen Sie eine Instanz des neuronalen Netzwerks
//    // Angenommen, Ihr Netzwerk hat 3 Eingabeknoten, 4 versteckte Knoten und 2 Ausgabeknoten
//    const nn2 = new NeuralNetwork(3, 4, 2);

//    // Erstellen Sie Ihre Trainingsdaten
//    const inputArray = [1, 0.5, -1.2]; // Beispiel für Eingabedaten
//    const targetArray = [0, 1];        // Beispiel für Zielwerte

//    // Trainieren Sie das Netzwerk mit Ihren Daten
//    // nn2.feedforward(inputArray);
//    // TODO: ADD Data to inputNodes (simple_NN.js)
//    generateNodes(input, -2, 0xee6363, NN.inputNodes, inputNodes);
//    generateNodes(hidden, 0, 0x58ea8e, NN.biasHidden.data, hiddenNodes);
//    generateNodes(output, 2, 0x4f6357, NN.biasOutput.data, outputNodes);
//    neuralNodes = [input, hidden, output];
//    const cameraZoom = Math.max(input, hidden, output) * sphereDistance / 4;
//    cameraZ.value = cameraZoom < 1 ? 8 : 8 * cameraZoom;
// };

// function generateNodes(nodesCount, pos, color, data, nodeArray) {
//    for (let i = 0; i < nodesCount; i++) {
//       const circleGeometry = new THREE.CircleGeometry(0.5, 32);
//       const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
//       const cirles = new THREE.Mesh(circleGeometry, circleMaterial);
//       cirles.neuronData = data[i];
//       cirles.isNeuron = true;
//       cirles.position.y = i * sphereDistance - (nodesCount - 1) * sphereDistance / 2;
//       cirles.position.x = pos * 3;
//       nodeArray.push(cirles);
//       scene.add(cirles);
//    }
// }

// function haveNodesChanged() {
//    return inputInput.value != neuralNodes[0] ||
//       hiddenInput.value != neuralNodes[1] ||
//       outputInput.value != neuralNodes[2];
// }

// function animate() {
//    if (haveNodesChanged()) {
//       generateVisualNN(inputInput.value, hiddenInput.value, outputInput.value)
//       if (connBox.checked) {
//          connectNodes(inputNodes, hiddenNodes, 0xaaaaaa);
//          connectNodes(hiddenNodes, outputNodes, 0xaaaaaa);
//       }
//    }
//    camera.position.x = cameraX.value;
//    camera.position.y = cameraY.value;
//    camera.position.z = cameraZ.value;
//    requestAnimationFrame(animate);
//    renderer.render(scene, camera);
// }

// animate();

// function connectNodes(nodeArray1, nodeArray2, color) {
//    for (let i = 0; i < nodeArray1.length; i++) {
//       for (let j = 0; j < nodeArray2.length; j++) {
//          drawLine(nodeArray1[i], nodeArray2[j], color);
//       }
//    }
// }


// // Funktion, um eine Linie zwischen zwei Knoten zu zeichnen
// function drawLine(startNode, endNode, color = 0xffffff) {
//    // Erstellen einer Vektorreihe, die die Positionen der Knoten enthält
//    const points = [];
//    points.push(startNode.position.clone());
//    points.push(endNode.position.clone());

//    // Erstellen einer Liniengeometrie aus den Punkten
//    const geometry = new THREE.BufferGeometry().setFromPoints(points);

//    // Erstellen eines Materials für die Linie
//    const material = new THREE.LineBasicMaterial({ color: color });

//    // Erstellen einer Linie mit der definierten Geometrie und dem Material
//    const line = new THREE.Line(geometry, material);
//    line.renderOrder = -1;
//    // Hinzufügen der Linie zur Szene
//    scene.add(line);

//    // Rückgabe der erstellten Linie, falls benötigt
//    return line;
// }
