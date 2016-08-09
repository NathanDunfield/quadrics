/*
  Returns a basic 3D scene attached to a canvas with id "name", 
  with an attached dat.gui.
*/

function setup3DScene(name){
    var canvas, scene, camera, renderer, controls, gui;
    canvas = document.getElementById(name);
    gui = new dat.GUI({autoPlace:false});
    document.getElementById(name + "controls").appendChild(gui.domElement);
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
    
    controls = new THREE.TrackballControls( camera, renderer.domElement );


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
    
    return {scene:scene, gui:gui, animate:animate, camera:camera};
}

function fancyLighting(scene){
    /* Vaguely Mathematica-style multicolored lighting. */
    var light0 = new THREE.DirectionalLight("white", 0.2);
    light0.position.set(15, -10, 14);
    scene.add(light0);

    var light1 = new THREE.PointLight(0x002058, 0.7);
    light1.position.set(5, -15, 5);
    scene.add(light1);

    var light2 = new THREE.PointLight(0xE87722, 0.6);
    light2.position.set(-3, 4, 15);
    scene.add(light2);

    var ambientLight = new THREE.AmbientLight(0xCCCCCC);
    scene.add(ambientLight);
}
    
function basicLighting(scene){
   // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(5,-5,20);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);
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

      QuadricSlice("z", 1, 2, 3)

  is the intersection with the plane z = 1.  When the plane itself is
  drawn, it will have -2 <= x <= 2 and -3 <= y <= 3.  
*/

function QuadricSlice(scene, axis, c,  a, b, color){
    this.axis = axis;
    this.c = c;
    this.a = a;
    this.b = b;
    this.color = color;
    this.scene = scene;
    
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
	var material = new THREE.MeshLambertMaterial(
	    {color:this.color, transparent:true, opacity:0.1});
	material.side = THREE.DoubleSide;
	var plane = new THREE.Mesh(geometry, material);
	this.placeGroup(plane);
	var edges = new THREE.EdgesHelper(plane, this.color);
	edges.material.linewidth = 2;
	this.plane.add(plane);
	this.plane.add(edges);
	this.scene.add(this.plane);
    };
    
    this.updateActive = function()
    {
	this.scene.remove(this.plane);
	this.scene.remove(this.slice);
	this.drawPlane();
	this.drawSlice();
    };
    
    this.updateFinished = function()
    {
	this.scene.remove(this.plane);
	this.scene.remove(this.slice);
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

