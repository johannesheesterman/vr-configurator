
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from 'three-mesh-ui';
import { ConfiguratorContext } from '@elfsquad/configurator';
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera, 
    renderer: THREE.WebGLRenderer, 
    controls: OrbitControls;

window.addEventListener('load', init );
window.addEventListener('resize', onWindowResize );

//

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );

	// TEXT PANEL
    initializeModelPicker();

	//

	renderer.setAnimationLoop( loop );

};

//

// handles resizing the renderer when the viewport is resized

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

//

function loop() {

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );
};


function initializeModelPicker(){


    const TENANT_ID = '6fd356f8-b46f-4683-825d-cc17cc7fb73d';

    const configuratorContext = new ConfiguratorContext({
        tenantId: TENANT_ID
    });
    
    configuratorContext.getConfigurationModels().then((models) => {
        console.log('models', models);
    
    
        const container = new ThreeMeshUI.Block({
            width: 1.2,
            height: 0.5,
            padding: 0.05,
            justifyContent: 'center',
            alignContent: 'left',
            fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
            fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
        });
    
        container.position.set( 0, 1, -1.8 );
        container.rotation.x = -0.55;
        scene.add( container );
    
        //
    
        container.add(
    
            new ThreeMeshUI.Text({
                content: `${models.features[0].description}`,
                fontSize: 0.055
            })
    
        );
    });

}

