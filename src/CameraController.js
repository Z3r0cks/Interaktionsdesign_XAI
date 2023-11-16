export class CameraController {
    _Camera;
    
    constructor(_camera) {
        this._Camera = _camera;
        this._Camera.position.z = 15;
    }

    findLongestHiddenLayer(_arr) {
        let longestLength = 0;
        for (let i = 0; i < _arr.length; i++) {
            if (_arr[i] > longestLength) {
                longestLength = _arr[i];
            }
        }
        return longestLength;
    }

    adjustPosition(_neuralNodes, _vertTrans, _sphereDistance) {
        const cameraZoom = Math.max(_neuralNodes[0], this.findLongestHiddenLayer(_neuralNodes[1]), _neuralNodes[2], _neuralNodes[1].length) * _sphereDistance / 4;
        this._Camera.position.z = cameraZoom < 1 ? 6 : 6 * cameraZoom;
        console.log("Cam ZoomFaktor: " + cameraZoom);
        console.log("Cam Pos: " + this._Camera.position.z);
        this._Camera.position.x = _vertTrans;
    }
}