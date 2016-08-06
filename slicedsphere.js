// Basic sphere, can change the radius and rotate.  

// Key example: http://threejs.org/docs/scenes/geometry-browser.html

// standard globals
var container, scene, camera, renderer, controls;

// custom globals

var parameters;
var gui;
var xplane, yplane, zplane;


init();
animate();

function init()
{
    gui = new dat.GUI();
    scene = new THREE.Scene();
    parameters = {x:1.0, y:2.0, z:1.0};
    gui.add(parameters, 'x', -2.0, 2.0, 0.1).onChange(updatePlanes);
    gui.add(parameters, 'y', -2.0, 2.0, 0.1).onChange(updatePlanes);
    gui.add(parameters, 'z', -2.0, 2.0, 0.1).onChange(updatePlanes);

    // setup camera
    var SCREEN_WIDTH = 800, SCREEN_HEIGHT = 600;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    scene.add(camera);
    camera.position.set(0, -10, 10);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xffffff);
    
    container = document.getElementById( 'basicsphere' );
    container.appendChild(gui.domElement);
    container.appendChild(renderer.domElement);



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
    drawPlanes();
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


function drawSphere()
{
    // Sphere parameters: radius, segments along width, segments along height
    var geometry = new THREE.SphereGeometry(2, 16, 12);
    geometry.rotateX(Math.PI/2);
    // use a "lambert" material rather than "basic" for realistic lighting.
    var material = new THREE.MeshLambertMaterial({color: 0x8888ff});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    // scene.add(sphere);
    edges = new THREE.EdgesHelper(sphere, 0x888888);
    edges.material.linewidth=2;
    scene.add(edges);
}

function updatePlanes()
{
    //scene.remove(xplane);
    //scene.remove(yplane);
    scene.remove(zplane);
    drawPlanes();
}

function circleGeometry(radius, numsegs)
{
    var geometry = new THREE.Geometry();
    var t, v, dt;
    t = 0.0;
    dt = 2*Math.PI/numsegs;
    for(var k=0; k < numsegs; k++){
	t = t + dt;
	v = new THREE.Vector3(radius*Math.cos(t), radius*Math.sin(t), 0)
	geometry.vertices.push(v);
    }
    return geometry;
}

function drawPlanes()
{
    z = parameters.z;
    zplane = new THREE.Group();
    var geometry = new THREE.PlaneGeometry(6, 6);
    var material = new THREE.MeshLambertMaterial({color:0x999999, transparent:true, opacity:0.2});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.z += z;
    var edges = new THREE.EdgesHelper(plane, "black");
    edges.material.linewidth = 2;
    zplane.add(plane);
    zplane.add(edges);

    var geometry = circleGeometry(Math.sqrt(4 - z*z), 40);
    var material = new THREE.LineBasicMaterial({color:"black", linewidth:4});
    var circle = new THREE.Line(geometry, material);
    circle.position.z += z;
    zplane.add(circle)
    scene.add(zplane);    
}

