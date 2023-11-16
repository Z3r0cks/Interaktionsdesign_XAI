class LayerState {
   constructor() {
      this._layers = [];
   }

   addLayer(layer) {
      this._layers.push(layer);
   }

   removeLayer(layer) {
      const index = this._layers.indexOf(layer);
      if (index > -1) {
         this._layers.splice(index, 1);
      }
   }

   get layers() {
      return this._layers;
   }  
}