/*

   Helper functions for using "noUiSliders"

 */

function setupSlider(slidergroup, labelText, sliderOpts){
    var slider = slidergroup.getElementsByClassName("threeslider")[0];
    slider.labelElement = slidergroup.getElementsByClassName("sliderlabel")[0];
    slider.labelText = labelText;
    noUiSlider.create(slider, sliderOpts);
    return slider;
}

function getSliderValue(slider){
    // Gets the current slider value, updating the label in the process.
    var ans = Number(slider.noUiSlider.get());
    var valueText = ans.toFixed(1).replace("-", "&minus;");
    slider.labelElement.innerHTML = slider.labelText + valueText;
    return ans;
}

/*

  Returns a basic 3D scene attached to a canvas with id "name". 

*/

function setup3DScene(container){
    var canvas, scene, camera, renderer, controls;
    canvas = container.getElementsByClassName("threejs")[0];
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

/*

Some lighting options.

*/

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



/*

   Useful geometries

 */

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

function QuadricSlice(container, scene, axis, c, cmax, a, b, drawSlice){
    this.axis = axis;
    this.c = c;
    this.a = a;
    this.b = b;
    this.color = {x:0xE87722, y:0x606EB2, z:0x002058}[axis];
    this.scene = scene;
    this.name = name;
    this.cmax = cmax;
    this.drawSlice = drawSlice;
    var sliderGroupElements = container.getElementsByClassName("slidergroup");
    var ourSliderGroup = sliderGroupElements[{x:0, y:1, z:2}[this.axis]];
    this.sliderElement = setupSlider(ourSliderGroup, this.axis + " = ",
				     {
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

    this.updateValue = function(){
	this.c = getSliderValue(this.sliderElement);
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



function quadricSlices(container, scene, x, xbox, y, ybox, z, zbox){
    function addCallbacks(name, slice){
	this.sliderElement.noUiSlider.on("start", this.updateActive);
	this.sliderElement.noUiSlider.on("update", this.updateActive);
	this.sliderElement.noUiSlider.on("end", this.updateFinished);
    }


    var xslice = new QuadricSlice(container, scene, "x", x, xbox, ybox, zbox, 0xE87722);
    var yslice = new QuadricSlice(container, scene, "y", y, ybox, xbox, zbox, 0x606EB2);
    var zslice = new QuadricSlice(container, scene, "z", z, zbox, xbox, ybox, 0x002058);
    return {x:xslice, y:yslice, z:zslice};
}

/*

   Plotting a function f(x,y) over a domain in the plane, here either
   the square [-1, 1] x [-1, 1] or the unit disc.  
   
 */

function drawPlotOverSquare(f, opts)
{
    phi = function(s, t){
	return [s, t];
    }
    ans = new THREE.Group();
    if (typeof opts === 'undefined') {opts = {};}
    opts.samples = opts.samples || 40;
    opts.sGridlines = opts.gridlines || 6;
    opts.tGridlines = opts.gridlines || 6;
    opts.gridpushoff = opts.gridpushoff || 0.01;
    if (typeof opts.showgrid === 'undefined') {opts.showgrid = true;}
    
    ans.add(plotOverDomain(f, phi, -1, 1, -1, 1, opts));

    if (opts.showgrid){
	ans.add(plotOverDomainGrid(f, phi, -1, 1, -1, 1, opts));
    }
    return ans;
}


function drawPlotOverDisk(f, opts)
{
    phi = function(r, t){
	return [r*Math.cos(t), r*Math.sin(t)];
    }
    ans = new THREE.Group();
    if (typeof opts === 'undefined') {opts = {};}
    opts.samples = opts.samples || 100;
    opts.sGridlines = opts.gridlines || 6;
    opts.tGridlines = opts.gridlines || 12;
    opts.gridpushoff = opts.gridpushoff || 0.005;
    if (typeof opts.showgrid === 'undefined') {opts.showgrid = true;}
    
    ans.add(plotOverDomain(f, phi, 0, 1, 0, 2*Math.PI, opts));

    if (opts.showgrid){
	ans.add(plotOverDomainGrid(f, phi, 0, 1, 0, 2*Math.PI, opts));
    }
    return ans;
}


function plotOverDomain(f, phi, s0, s1, t0, t1, opts){
    /*
       The function phi is a parameterization from [s0, s1] x [t0, t1]
       to the region in the plane that we care about.
     */
    
    var geometry = new THREE.Geometry();
    var n = opts.samples;
    var p, x, y, s, t, ds, dt;

    ds = (s1 - s0)/n;
    dt = (t1 - t0)/n;
    // Evaluate the function at the sample points to find the vertices.	
    for(var i = 0; i <= n; i++){
	for(var j = 0; j <= n; j++){
	    s = s0 + i*ds;
	    t = t0 + j*dt;
	    p = phi(s, t);
	    x = p[0];
	    y = p[1];
	    geometry.vertices.push(new THREE.Vector3(x, y, f(x, y)));
	}
    }
    
    // Now add in the triangles.
    for(var i = 0; i < n; i++){
	for(var j = 0; j < n; j++){
	    k = (n + 1)*j + i;
	    geometry.faces.push(new THREE.Face3(k, k+1, k + n + 2));
	    geometry.faces.push(new THREE.Face3(k, k + n + 2, k + n + 1));
	}
    }
    
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var material = new THREE.MeshLambertMaterial({color: 0xEEEEEE, side: THREE.DoubleSide});
    return new THREE.Mesh(geometry, material);
}


function plotOverDomainGrid(f, phi, s0, s1, t0, t1, opts){
    /* 
       The trick to drawing gridlines so they don't flicker is to push them
       just off the surface itself.  So that things look good, we have one
       copy of the gridline above and the other below. 
     */
    
    var ans = new THREE.Group();
    var topgeom, bottomgeom, material;
    var n = opts.samples;
    var eps = opts.gridpushoff;
    var x, y, z, s, t, ds, dt, m; 
    material = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});

    // First, we draw the gridlines where s is constant.

    m = opts.sGridlines;
    ds = (s1 - s0)/m;
    dt = (t1 - t0)/n;
    for(i = 0; i <=m; i++){
	topgeom = new THREE.Geometry();
	bottomgeom = new THREE.Geometry();
	s = s0 + i*ds;
	for(j = 0; j <= n; j++){
	    t = t0 + j*dt;
	    p = phi(s, t);
	    x = p[0];
	    y = p[1];
	    z = f(x,y);
	    topgeom.vertices.push(new THREE.Vector3(x, y, z + eps));
	    bottomgeom.vertices.push(new THREE.Vector3(x, y, z - eps));
	}
	ans.add(new THREE.Line(topgeom, material));
	ans.add(new THREE.Line(bottomgeom, material));
    }

    // Now those where t is constant.

    m = opts.tGridlines;
    ds = (s1 - s0)/n;
    dt = (t1 - t0)/m;
    for(i = 0; i <=m; i++){
	topgeom = new THREE.Geometry();
	bottomgeom = new THREE.Geometry();
	t = t0 + i*dt;
	for(j = 0; j <= n; j++){
	    s = s0 + j*ds;
	    p = phi(s, t);
	    x = p[0];
	    y = p[1];
	    z = f(x,y);
	    topgeom.vertices.push(new THREE.Vector3(x, y, z + eps));
	    bottomgeom.vertices.push(new THREE.Vector3(x, y, z - eps));
	}
	ans.add(new THREE.Line(topgeom, material));
	ans.add(new THREE.Line(bottomgeom, material));
    }
    
    return ans;
}
