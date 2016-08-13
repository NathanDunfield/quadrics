/*
  Returns a basic 3D scene attached to a canvas with id "name". 
*/

function setup3DScene(name){
    var canvas, scene, camera, renderer, controls;
    canvas = document.getElementById(name);
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
    
    return {scene:scene, animate:animate, camera:camera};
}

function fancyLighting(scene){
    /* Vaguely Mathematica-style multicolored lighting. */
    var light0 = new THREE.DirectionalLight("white", 0.15);
    light0.position.set(0, -5, 10);
    scene.add(light0);
    
    var light1 = new THREE.DirectionalLight("red", 0.8);
    light1.position.set(10, -7, 10);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight("green", 1.0);
    light2.position.set(-5, -10, 10);
    scene.add(light2);
    
    var light3 = new THREE.DirectionalLight("blue", 1.0);
    light3.position.set(-10, 5, 10);
    scene.add(light3);

    var ambientLight = new THREE.AmbientLight("white", 0.5);
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

function QuadricSlice(name, scene, axis, c, cmax, a, b, drawSlice){
    this.axis = axis;
    this.c = c;
    this.a = a;
    this.b = b;
    this.color = {x:0xE87722, y:0x606EB2, z:0x002058}[axis];
    this.scene = scene;
    this.name = name;
    this.cmax = cmax;
    this.drawSlice = drawSlice;
    this.sliderElement = document.getElementById(this.name + this.axis + "slider");
    this.sliderLabel = document.getElementById(this.name + this.axis + "label");
    noUiSlider.create(this.sliderElement, {
	start: this.c, 
	range: {"min":-this.cmax, "max":this.cmax},
	orientation: "horizontal",
    });
    
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

    this.updateValue = function()
    {
	this.c = Number(this.sliderElement.noUiSlider.get());
	this.sliderLabel.innerHTML = this.axis + " = " + this.c.toFixed(1);
    }
    
    this.updateActive = function()
    {
	this.scene.remove(this.plane);
	this.scene.remove(this.slice);
	this.updateValue();
	this.drawPlane();
	this.drawSlice();
    };
    
    this.updateFinished = function()
    {
	this.scene.remove(this.plane);
	this.scene.remove(this.slice);
	this.updateValue();
	this.drawSlice();
    };

    this.sliderElement.noUiSlider.on("update", this.updateActive.bind(this));
    this.sliderElement.noUiSlider.on("start", this.updateActive.bind(this));
    this.sliderElement.noUiSlider.on("end", this.updateFinished.bind(this));
    this.sliderElement.noUiSlider.set(this.c);
    this.scene.remove(this.plane);
}



function quadricSlices(name, scene, x, xbox, y, ybox, z, zbox){
    function addCallbacks(name, slice){
	this.sliderElement.noUiSlider.on("start", this.updateActive);
	this.sliderElement.noUiSlider.on("update", this.updateActive);
	this.sliderElement.noUiSlider.on("end", this.updateFinished);
    }


    var xslice = new QuadricSlice(name, scene, "x", x, xbox, ybox, zbox, 0xE87722);
    var yslice = new QuadricSlice(name, scene, "y", y, ybox, xbox, zbox, 0x606EB2);
    var zslice = new QuadricSlice(name, scene, "z", z, zbox, xbox, ybox, 0x002058);
    //xslice.connectToSlider();
    //yslice.connectToSlider();
    //zslice.connectToSlider();
    return {x:xslice, y:yslice, z:zslice};
}
