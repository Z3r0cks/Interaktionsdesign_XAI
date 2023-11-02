import * as THREE from 'three';
import NeuralNetwork from './simple_NN.js';

const cameraX = document.getElementById('cameraX');
const cameraY = document.getElementById('cameraY');
const cameraZ = document.getElementById('cameraZ');

const inputInput = document.getElementById('inputInput');
const hiddenInput = document.getElementById('inputHidden');
const outputInput = document.getElementById('inputOutput');
const generateNN = document.getElementById('generateNN');

let NNExist = false;

generateNN.addEventListener('click', () => {
   if (inputInput.value === '' || hiddenInput.value === '' || outputInput.value === '') return alert('Please fill all the fields'); {
      const NN = new NeuralNetwork(inputInput.value, hiddenInput.value, outputInput.value);
      generateNeuralNetwork(inputInput.value, hiddenInput.value, outputInput.value, NN);
   }
});

const sphereDistance = 1.5;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function generateNeuralNetwork(input, hidden, output, NN) {
   generateNodes(input, -2, 0xee6363, NN.inputNodes);
   generateNodes(hidden, 0, 0x58ea8e, NN.hiddenNodes);
   generateNodes(output, 2, 0x4f6357, NN.outputNodes);
   const cameraZoom = Math.max(input, hidden, output) * sphereDistance / 4;
   cameraZ.value = 5 * cameraZoom;
   NNExist = true;
};

function generateNodes(nodesCount, pos, color, Nodes) {
   for (let i = 0; i < nodesCount; i++) {
      const circleGeometry = new THREE.CircleGeometry(0.5, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
      const cirles = new THREE.Mesh(circleGeometry, circleMaterial);
      cirles.position.y = i * sphereDistance - (nodesCount - 1) * sphereDistance / 2;
      cirles.position.x = pos * 3;
      scene.add(cirles);
   }
}

function animate() {
   camera.position.x = cameraX.value;
   camera.position.y = cameraY.value;
   camera.position.z = cameraZ.value;
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
}

animate();