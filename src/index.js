import {onReady} from './helpers'
import Instascan from 'instascan'

onReady(() => {
    let scanner = new Instascan.Scanner({
        continuous: true,
        video: document.getElementById('preview')
    });
    scanner.addListener('scan', function (content) {
        console.log(content);
        console.log('hey');
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
});