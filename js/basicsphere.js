/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {

var canvas, scene, camera, renderer, controls;

var parameters;
var gui;
var sphere;
var edges;

init();
animate();

function init()
{
    canvas = document.getElementById( 'basicsphere' );
    gui = new dat.GUI({autoPlace:false});
    parameters = {radius:2.0};
    gui.add(parameters, 'radius', 1, 3, 0.1).onChange(updateSphere);
    document.getElementById('basicspherecontrols').appendChild(gui.domElement);
    
    scene = new THREE.Scene();

    // setup camera
    var SCREEN_WIDTH = canvas.clientWidth;
    var SCREEN_HEIGHT = canvas.clientHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    scene.add(camera);
    camera.position.set(0, -10, 10);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer( {canvas:canvas, antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xffffff);



    // move mouse and: left   click to rotate, 
    //                 middle click to zoom, 
    //                 right  click to pan
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.enableZoom = false;

    // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(5,-5,20);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));
    drawSphere();
}

function animate() 
{
    requestAnimationFrame( animate );
    render();
    controls.update();
}

function render() 
{	
    renderer.render( scene, camera );
}

function updateSphere()
{
    scene.remove(sphere);
    scene.remove(edges);
    drawSphere();
}

function drawSphere()
{
    
    // Sphere parameters: radius, segments along width, segments along height
    var geometry = new THREE.SphereGeometry( parameters.radius, 32, 16 );
    geometry.rotateX(Math.PI/2);
    // use a "lambert" material rather than "basic" for realistic lighting.
    var material = new THREE.MeshLambertMaterial({color: 0x8888ff});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
    edges = new THREE.EdgesHelper(sphere, "black");
    edges.material.linewidth=1.5;
    scene.add(edges);
}

}()); // calling anonymous function. 
