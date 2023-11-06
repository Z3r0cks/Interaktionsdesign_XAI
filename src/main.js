import * as THREE from 'three';
import NeuralNetwork from './simple_NN.js';

let NN;

const cameraX = document.getElementById('cameraX');
const cameraY = document.getElementById('cameraY');
const cameraZ = document.getElementById('cameraZ');
let neuralNodes = [];

const inputInput = document.getElementById('inputInput');
// const hiddenInput = document.getElementById('inputHidden');
const outputInput = document.getElementById('inputOutput');
const connBox = document.getElementById('connBox');
const hiddenLayerCount = document.getElementById('hiddenLayerCount');

const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.1; // Adjust this value as needed
const mouse = new THREE.Vector2();

let [inputNodes, hiddenNodes, outputNodes] = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sphereDistance = 1.5;

hiddenLayerCount.addEventListener('input', function () {
   const wrapper = document.querySelector('#hiddelLayerWrapper');
   wrapper.innerHTML = '';
   for (let i = 0; i < this.value; i++) {
      wrapper.innerHTML += `
      <label for="inputHidden${i}">Hidden Layer ${i + 1}</label>
      <input id="inputHidden${i}" type="range" min="1" max="10" value="1" />
      `;
   }
   generateNeuralNetwork(inputInput.value, getAllHiddenLayer(), outputInput.value);

   // Event Delegation für die Range-Inputs
   document.querySelector('#hiddelLayerWrapper').addEventListener('input', function (event) {
      // Überprüfen, ob das Event von einem Range-Input ausgelöst wurde
      if (event.target.type === 'range') {
         generateVisualNN(inputInput.value, getAllHiddenLayer(), outputInput.value);
      }
   });
});


function getAllHiddenLayer() {
   const hiddenLayers = [];
   const hiddenLayerInputs = document.querySelectorAll('#hiddelLayerWrapper input[type="range"]');
   hiddenLayerInputs.forEach(input => {
      hiddenLayers.push(input.value);
   });
   return hiddenLayers;
}

function generateNeuralNetwork(input, hidden, output) {
   NN = new NeuralNetwork(input, hidden, output);
}

function generateVisualNN(input, hidden, output) {
   scene.clear();
   inputNodes = [];
   hiddenNodes = [];
   outputNodes = [];

   let i = 0;
   // Trainieren Sie das Netzwerk mit Ihren Daten
   // nn2.feedforward(inputArray);
   // TODO: ADD Data to inputNodes (simple_NN.js)
   generateNodes(input, -2, 0xee6363, NN.inputNodes, inputNodes);
   for (i; i < hidden.length; i++) {
      generateNodes(hidden[i], i + 2, 0x58ea8e, NN.hiddenNodes[i], hiddenNodes);
   }
   generateNodes(output, i + 2, 0x4f6357, NN.biasOutput.data, outputNodes);
   neuralNodes = [input, hidden, output];
   const cameraZoom = Math.max(input, hidden, output) * sphereDistance / 4;
   cameraZ.value = cameraZoom < 1 ? 8 : 8 * cameraZoom;
};

function generateNodes(nodesCount, pos, color, data, nodeArray) {
   for (let i = 0; i < nodesCount; i++) {
      const circleGeometry = new THREE.CircleGeometry(0.5, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
      const cirles = new THREE.Mesh(circleGeometry, circleMaterial);
      cirles.neuronData = data[i];
      cirles.isNeuron = true;
      cirles.position.y = i * sphereDistance - (nodesCount - 1) * sphereDistance / 2;
      cirles.position.x = pos * 3;
      nodeArray.push(cirles);
      scene.add(cirles);
   }
}

function createNeuralNodes(input, hidden, output) {
   neuralNodes = [input, hidden, output];
}


// function showNeuronTooltip(neuronData, position) {
//    const tooltip = document.getElementById('neuronTooltip') || createTooltip();
//    tooltip.innerHTML = `Neuron Data: ${ JSON.stringify(neuronData) } `;
//    tooltip.style.display = 'block';
//    tooltip.style.left = `${ position.x } px`;
//    tooltip.style.top = `${ position.y } px`;
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

function haveNodesChanged() {
   if (NN === undefined) return false;
   if (neuralNodes.length <= 0) return false;

   const currentHiddenLayerValues = getAllHiddenLayer();
   // Vergleichen Sie die Länge der Arrays, um sicherzustellen, dass sie die gleiche Anzahl von Schichten haben.
   if (neuralNodes[1].length !== currentHiddenLayerValues.length) return true;

   // Überprüfen Sie, ob die Werte der einzelnen versteckten Schichten sich geändert haben.
   for (let i = 0; i < neuralNodes[1].length; i++) {
      if (neuralNodes[1][i] != currentHiddenLayerValues[i]) return true;
   }

   // Überprüfen Sie, ob die Werte für die Eingabe- und Ausgabeknoten sich geändert haben.
   return inputInput.value != neuralNodes[0] || outputInput.value != neuralNodes[2];
}

function animate() {
   if (haveNodesChanged()) {
      generateVisualNN(inputInput.value, getAllHiddenLayer(), outputInput.value);
      if (connBox.checked) {
         console.log("test");
         // Verbinde Eingabeschicht mit der ersten versteckten Schicht
         connectNodes(inputNodes, hiddenNodes[0], 0xaaaaaa);
         // Verbinde alle versteckten Schichten miteinander
         for (let i = 0; i < hiddenNodes.length - 1; i++) {
            connectNodes(hiddenNodes[i], hiddenNodes[i + 1], 0xaaaaaa);
         }
         // Verbinde letzte versteckte Schicht mit Ausgabeschicht
         connectNodes(hiddenNodes[hiddenNodes.length - 1], outputNodes, 0xaaaaaa);
      }
   }
   camera.position.x = cameraX.value;
   camera.position.y = cameraY.value;
   camera.position.z = cameraZ.value;
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
}

animate();

function connectNodes(nodeArray1, nodeArray2, color) {
   for (let i = 0; i < nodeArray1.length; i++) {
      for (let j = 0; j < nodeArray2.length; j++) {
         drawLine(nodeArray1[i], nodeArray2[j], color);
      }
   }
}

// Funktion, um eine Linie zwischen zwei Knoten zu zeichnen
function drawLine(startNode, endNode, color = 0xffffff) {
   // Erstellen einer Vektorreihe, die die Positionen der Knoten enthält
   const points = [];
   points.push(startNode.position.clone());
   points.push(endNode.position.clone());

   // Erstellen einer Liniengeometrie aus den Punkten
   const geometry = new THREE.BufferGeometry().setFromPoints(points);

   // Erstellen eines Materials für die Linie
   const material = new THREE.LineBasicMaterial({ color: color });

   // Erstellen einer Linie mit der definierten Geometrie und dem Material
   const line = new THREE.Line(geometry, material);
   line.renderOrder = -1;
   // Hinzufügen der Linie zur Szene
   scene.add(line);

   // Rückgabe der erstellten Linie, falls benötigt
   return line;
}
