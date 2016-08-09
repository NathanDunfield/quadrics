/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
var canvas, scene, camera, renderer, controls;

var parameters;
var gui;
var xplane, yplane, zplane;
var zslice;

init();
animate();

function init()
{
    canvas = document.getElementById( 'slicedsphere' );
    gui = new dat.GUI({autoPlace:false});
    parameters = {x:1.0, y:2.0, z:1.0};
    document.getElementById("slicedspherecontrols").appendChild(gui.domElement);

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
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    //controls.enableZoom = false;

    // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(5,-5,20);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));

    xslice = new Slice("x", 1, 3, 3, "red");
    yslice = new Slice("y", 1, 3, 3, "cyan");
    zslice = new Slice("z", 1, 3, 3, "black");
    
    parameters = {"x":1.0, "y":1.0, "z":1.0};
    var xcontroller = gui.add(parameters, "x", -3.0, 3.0, 0.1);
    var ycontroller = gui.add(parameters, "y", -3.0, 3.0, 0.1);
    var zcontroller = gui.add(parameters, "z", -3.0, 3.0, 0.1);
    addCallbacks(xslice, xcontroller);
    addCallbacks(yslice, ycontroller);
    addCallbacks(zslice, zcontroller);

    drawSphere();
    xslice.drawSlice();
    yslice.drawSlice();
    zslice.drawSlice();
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

function circleGeometry(radius, numsegs)
{
    var geometry = new THREE.Geometry();
    var t, v, dt;
    t = 0.0;
    dt = 2*Math.PI/numsegs;
    for(var k=0; k <= numsegs; k++){
	t = t + dt;
	v = new THREE.Vector3(radius*Math.cos(t), radius*Math.sin(t), 0)
	geometry.vertices.push(v);
    }
    return geometry;
}


/*
A slice is the intersection of the quadric surface with a plane
orthogonal to a coordinate axis.  For example, 

    Slice("z", 1, 2, 3)

is the intersection with the plane z = 1.  When the plane itself is
drawn, it will have -2 <= x <= 2 and -3 <= y <= 3.  
*/
function Slice(axis, c,  a, b, color){
    this.axis = axis;
    this.c = c;
    this.a = a;
    this.b = b;
    this.color = color;

    this.placeGroup = function(group){
	if(this.axis == "z"){
	    group.position.z += this.c;
	}
	if(this.axis == "x"){
	    group.rotateY(Math.PI/2);
	    group.position.x += this.c;
	}
	if(this.axis == "y"){
	    group.rotateX(-Math.PI/2);
	    group.position.y += this.c;
	}
    }
    
    this.drawPlane = function()
    {
	this.plane = new THREE.Group();
	var geometry = new THREE.PlaneGeometry(2*this.a, 2*this.b);
	var material = new THREE.MeshLambertMaterial({color:this.color, transparent:true, opacity:0.2});
	var plane = new THREE.Mesh(geometry, material);
	this.placeGroup(plane);
	var edges = new THREE.EdgesHelper(plane, this.color);
	edges.material.linewidth = 2;
	this.plane.add(plane);
	this.plane.add(edges);
	scene.add(this.plane);
    };
    
    this.drawSlice = function()
    {
	var geometry = circleGeometry(Math.sqrt(4 - this.c*this.c), 40);
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:4});
	this.slice = new THREE.Line(geometry, material);
	this.placeGroup(this.slice);
	scene.add(this.slice);
    };

    this.updateActive = function()
    {
	scene.remove(this.plane);
	scene.remove(this.slice);
	this.drawPlane();
	this.drawSlice();
    };

    this.updateFinished = function()
    {
	scene.remove(this.plane);
	scene.remove(this.slice);
	this.drawSlice();
    };
}

function addCallbacks(slice, controller)
{
    controller.onChange(
	function(v){
	    slice.c = v;
	    slice.updateActive();
	});
    controller.onFinishChange(
	function(v){
	    slice.c = v;
	    slice.updateFinished();
	});
};

}()); // call anonymous function. 
