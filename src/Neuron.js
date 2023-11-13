import { NeuronStates } from "./NeuronStates";

export function changeState(_neuron, _state) {
   switch(_state) {
      case NeuronStates.ACTIVE: 
      _neuron.material.color.set(0x00ff00);
         break;
      case NeuronStates.FREE:
         _neuron.material.color.set(_neuron.originColor);
         break;
      case NeuronStates.SELECTED:
         _neuron.material.color.set(0x0000ff);
         break;
      default: _neuron.material.color.set(0xff0000);
   }
    
   _neuron.neuronState = _state;
}

export function changeWeight(_neuron, _newWeight) {
   _neuron.weight = +_newWeight;
   //_neuron.children[1].element.textContent = this.weight.toFixed(2);
   if(_newWeight<=1 && _newWeight >= 0.1)_neuron.scale.set(_newWeight, _newWeight, _newWeight);
}