import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
import { GameServer } from './GameServer';
import { InputManager } from './InputManager';
import { Player } from './Player';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

const aspectRatio = window.innerWidth / window.innerHeight;

// Set up the isometric camera
const aspect = window.innerWidth / window.innerHeight;
const d = 5;
const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
camera.position.set( d, d, d); // all components equal
camera.lookAt( new THREE.Vector3(0, 0, 0));

// Set up renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0xC2B280);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up pixelation effect
const composer = new EffectComposer( renderer );
const renderPixelatedPass = new RenderPixelatedPass( 4, scene, camera );
renderPixelatedPass.normalEdgeStrength = .6;
renderPixelatedPass.depthEdgeStrength = .8;
composer.addPass( renderPixelatedPass );

// Set up plane
const loader = new THREE.TextureLoader();
const texChecker = pixelTexture( loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/checker.png' ) );
const texChecker2 = pixelTexture( loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/checker.png' ) );
texChecker.repeat.set( 3, 3 );
texChecker2.repeat.set( 1.5, 1.5 );

const planeSideLength = 10;
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry( planeSideLength, planeSideLength ),
  new THREE.MeshPhongMaterial( { map: texChecker } )
);
planeMesh.receiveShadow = true;
planeMesh.rotation.x = - Math.PI / 2;
planeMesh.position.set(0, -.5, 0);
scene.add( planeMesh );

// Setup cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, material);
cube.receiveShadow = true;
cube.castShadow = true;
cube.position.set(-2.5, 0, 0);
scene.add(cube);

// Setup sphere
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere.position.set(2.5, 0, 0);
scene.add(sphere);

// Set diamond
const radius = 1;
const geometry = new THREE.IcosahedronGeometry( radius );
const crystalMesh = new THREE.Mesh(
  geometry,
  new THREE.MeshPhongMaterial( {
    color: 0x2379cf,
    emissive: 0x143542,
    shininess: 10,
    specular: 0xffffff
  } )
);
crystalMesh.receiveShadow = true;
crystalMesh.castShadow = true;
scene.add( crystalMesh );



// Set up lighting
scene.add( new THREE.AmbientLight( 0x2d3645, 1.5 ) );

const directionalLight = new THREE.DirectionalLight( 0xfffc9c, .5 );
directionalLight.position.set( 100, 100, 100 );
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set( 2048, 2048 );
scene.add( directionalLight );

const spotLight = new THREE.SpotLight( 0xff8800, 3, 30, Math.PI / 16, .02, 2 );
spotLight.position.set( 15, 10, 0 );
const target = spotLight.target;
scene.add( target );
target.position.set( 0, 0, 0 );
spotLight.castShadow = true;
scene.add( spotLight );

window['gameServer'] =  new GameServer(scene);
window['inputManager'] =  new InputManager();;
const clock = new THREE.Clock();
const player = new Player();
scene.add(player);

// Start the animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the cube
  crystalMesh.rotation.x += 0.01;
  crystalMesh.rotation.y += 0.01;

  // renderer.render(scene, camera);
  composer.render();

  const delta = clock.getDelta();
  player.render(delta)
};

animate();


function pixelTexture( texture ) {

  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;

}