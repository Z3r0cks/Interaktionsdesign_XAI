import * as THREE from 'three';
import NeuralNetwork from './simple_NN.js';
import { NeuronStates } from './NeuronStates.js';
import { changeState, changeWeight } from './Neuron.js';

import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

let NN;

// const cameraX = document.getElementById('cameraX');
// const cameraY = document.getElementById('cameraY');
const cameraZ = document.getElementById('cameraZ');
let neuralNodes = [];

let wheelListenerExists = false;
let activeObject;
let selectedObjects = [];

const inputInput = document.getElementById('inputInput');
const outputInput = document.getElementById('inputOutput');
const connBox = document.getElementById('connBox');
const hiddenLayerCountElement = document.getElementById('hiddenLayerCount');

let raycaster, mouse;

let [inputNodes, hiddenNodes, outputNodes] = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const labelRenderer = new CSS2DRenderer();

const sphereDistance = 1.5;


function init() {
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   raycaster = new THREE.Raycaster();
   raycaster.params.Points.threshold = 0.1; // Adjust this value as needed
   mouse = new THREE.Vector2();

   labelRenderer.setSize(window.innerWidth, window.innerHeight);
   labelRenderer.domElement.style.position = 'absolute';
   labelRenderer.domElement.style.top = '0px';
   document.body.appendChild(labelRenderer.domElement);

   hiddenLayerCountElement.addEventListener('input', function () {
      const wrapper = document.querySelector('#hiddelLayerWrapper');
      wrapper.innerHTML = '';
      for (let i = 0; i < this.value; i++) {
         wrapper.innerHTML += `
         <label for="inputHidden${i}">Hidden Layer ${i + 1}</label>
         <input id="inputHidden${i}" class="inputHidden" type="range" min="1" max="10" value="1" />`;
      }
      generateNeuralNetwork(inputInput.value, getAllHiddenLayer(), outputInput.value);

      // Event Delegation für die Range-Inputs
      document.querySelector('#hiddelLayerWrapper').addEventListener('input', function (event) {
         // Überprüfen, ob das Event von einem Range-Input ausgelöst wurde
         if (event.target.type === 'range') {
            generateVisualNN(inputInput.value, getAllHiddenLayer(), outputInput.value);
            setConnection();
         }
      });
   });

   camera.position.z = 15;

   labelRenderer.domElement.addEventListener('wheel', onWheel, { passive: true });
   labelRenderer.domElement.addEventListener('click', onClick);
   labelRenderer.domElement.addEventListener('mousemove', onMouseMove);
   window.addEventListener('resize', onWindowResize, false);

   hiddenLayerCountElement.dispatchEvent(new Event('input'));
}
init();



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
   // TODO: ADD Data to inputNodes (simple_NN.js)
   generateNodes(input, -1, 0xee6363, NN.inputNodes, inputNodes);
   for (i; i < hidden.length; i++) {
      generateNodes(hidden[i], i, 0x58ea8e, NN.hiddenNodes[i], hiddenNodes);
   }
   generateNodes(output, i, 0x4f6357, NN.biasOutput.data, outputNodes);
   neuralNodes = [input, hidden, output];
   const cameraZoom = Math.max(input, hidden, output) * sphereDistance / 4;
   cameraZ.value = cameraZoom < 1 ? 8 : 8 * cameraZoom;
};

function generateNodes(nodesCount, pos, color, data, nodeArray) {
   const halfDistance = (nodesCount - 1) * sphereDistance / 2;
   const xPosition = pos * 3;

   for (let i = 0; i < nodesCount; i++) {
      const circleGeometry = new THREE.CircleGeometry(0.5, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.neuronData = data[i];
      circle.isNeuron = true;
      circle.neuronState = NeuronStates.FREE;
      circle.weight = 0.5;
      circle.layers.enable(1);
      circle.originColor = color;

      circle.position.set(xPosition, i * sphereDistance - halfDistance, 0);
      nodeArray.push(circle);
      scene.add(circle);
   }
}

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

function setConnection() {
   if (!connBox.checked) return;
   const hiddenInputs = document.querySelectorAll(".inputHidden");
   let count = 0;

   // Verbindungen von Eingabe- zu versteckten Knoten
   for (let j = 0; j < inputNodes.length; j++) {
      for (let k = 0; k < parseInt(hiddenInputs[0].value); k++) {
         drawLine(inputNodes[j], hiddenNodes[k], 0xaaaaaa);
      }
   }

   // Verbindungen zwischen versteckten Knotenschichten
   for (let i = 0; i < hiddenInputs.length - 1; i++) {
      const leftLayer = parseInt(hiddenInputs[i].value);
      const rightLayer = parseInt(hiddenInputs[i + 1].value);

      for (let j = 0; j < leftLayer; j++) {
         for (let k = 0; k < rightLayer; k++) {
            drawLine(hiddenNodes[count], hiddenNodes[count + leftLayer + k - j], 0xaaaaaa);
         }
         count++;
      }
   }

   // Verbindungen von versteckten Knoten zu Ausgabeknoten
   const lastHiddenLayer = parseInt(hiddenInputs[hiddenInputs.length - 1].value);
   for (let j = 0; j < lastHiddenLayer; j++) {
      for (let k = 0; k < outputNodes.length; k++) {
         drawLine(hiddenNodes[count], outputNodes[k], 0xaaaaaa);
      }
      count++;
   }
}


function render() {
   if (haveNodesChanged()) {
      generateVisualNN(inputInput.value, getAllHiddenLayer(), outputInput.value); setConnection();
   }

   requestAnimationFrame(render);
   renderer.render(scene, camera);
   labelRenderer.render(scene, camera);
}

render();

// Funktion, um eine Linie zwischen zwei Knoten zu zeichnen
function drawLine(startNode, endNode, color = 0xffffff) {
   // Erstellen einer Vektorreihe, die die Positionen der Knoten enthält
   const points = [];
   points.push(startNode.position.clone());
   points.push(endNode.position.clone());

   // Erstellen einer Liniengeometrie aus den Punkten
   const geometry = new THREE.BufferGeometry().setFromPoints(points);
   const material = new THREE.LineBasicMaterial({ color: color });

   // Erstellen einer Linie mit der definierten Geometrie und dem Material
   const line = new THREE.Line(geometry, material);
   line.isLine = true;
   line.renderOrder = -1;

   scene.add(line);
   // Rückgabe der erstellten Linie, falls benötigt
   return line;
}

connBox.addEventListener('change', () => {
   if (connBox.checked) {
      connectNodes(inputNodes, hiddenNodes, 0xaaaaaa);
      connectNodes(hiddenNodes, outputNodes, 0xaaaaaa);
   } else {
      scene.clear();
      generateNodes(inputInput.value, -2, 0xee6363, NN.inputNodes, inputNodes);
      generateNodes(hiddenInput.value, 0, 0x58ea8e, NN.hiddenNodes, hiddenNodes);
      generateNodes(outputInput.value, 2, 0x4f6357, NN.outputNodes, outputNodes);
   }
});

/*____________Interaction Events _________________________*/
function onClick(event) {
   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
   raycaster.setFromCamera(mouse, camera);
   var intersects = raycaster.intersectObject(scene, true);

   if (intersects.length > 0) {
      if (intersects[0].object.neuronState != NeuronStates.SELECTED) selectedObjects.push(intersects[0].object);
      changeState(intersects[0].object, NeuronStates.SELECTED);
   } else {
      for (let i = 0; i < selectedObjects.length; i++) {
         changeState(selectedObjects[i], NeuronStates.FREE);
      }
      selectedObjects = [];
   }
}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
   labelRenderer.setSize(window.innerWidth, window.innerHeight);
   render();
}

function onMouseMove(event) {
   // Update the mouse position
   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

   // Raycasting for tooltips
   raycaster.setFromCamera(mouse, camera);
   const intersects = raycaster.intersectObject(scene, true);
   raycaster.layers.set(1);

   if (intersects.length > 0) {
      activeObject = intersects[0].object;
      console.log(intersects[0].object);
      if (activeObject.neuronState != NeuronStates.SELECTED) changeState(activeObject, NeuronStates.ACTIVE);
      if (!wheelListenerExists) {
         wheelListenerExists = true;
      }
   } else {
      if (activeObject != null) {
         if (activeObject.neuronState != NeuronStates.SELECTED) changeState(activeObject, NeuronStates.FREE);
         activeObject = null;
         if (wheelListenerExists) {
            wheelListenerExists = false;
         }
      }
   }
}

function onWheel(event) {
   if (selectedObjects.length > 0) {
      for (let i = 0; i < selectedObjects.length; i++) {
         changeWeight(selectedObjects[i], 0.1 * -Math.sign(event.deltaY) + selectedObjects[i].weight);
      }
   }
   if (activeObject) {
      if (activeObject.isNeuron && selectedObjects.length == 0) {
         changeWeight(activeObject, 0.1 * -Math.sign(event.deltaY) + activeObject.weight)
      }
   }
}
/*____________Interaction Events End_________________________*/