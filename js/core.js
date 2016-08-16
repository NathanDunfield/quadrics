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

   Setting up the basic controls at the bottom of a plot.  
   
 */


function basicMaterial(opacity){
    if (opacity === 0){
	return null;
    }
    var opts = {color:0xEEEEEE, side: THREE.DoubleSide};
    if (opacity < 1){
	opts.transparent = true;
	opts.opacity = opacity;
    }
    return new THREE.MeshLambertMaterial(opts);
}

function BasicGUI(container, onchange, onclick){
    var checkbox = container.getElementsByTagName("input")[0];
    checkbox.checked = true;
    checkbox.onchange = onchange;

    var menu = container.getElementsByTagName("select")[0];
    menu.onchange = onchange;

    var button =  container.getElementsByTagName("button")[0];
    button.onclick = onclick;

    this.checkbox = checkbox;
    this.menu = menu;
    this.button = button;

    /*

       Returns surface material associated to the menu.

     */
    
    this.material = function(){
	switch(this.menu.value){
	    case "invisible":
		return null;
	    case "transparent":
		return basicMaterial(0.3);
	    case "solid":
		return basicMaterial(1.0);
	}
    };

    this.checked = function(){
	return this.checkbox.checked;
    };
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
    
    return {scene:scene, animate:animate, camera:camera, controls:controls};
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
	    v = new THREE.Vector3(radius*Math.cos(t), radius*Math.sin(t), 0);
	    geometry.vertices.push(v);
	}
	return geometry;
    }


function QuadricSlice(container, scene, axis, c,
		      cmin, cmax, amin, amax, bmin, bmax,
		      makeSlice){
    this.scene = scene;
    this.axis = axis;
    this.c = c;
    this.cmin = cmin;
    this.cmax = cmax;
    this.amin = amin;
    this.amax = amax;
    this.bmin = bmin;
    this.bmax = bmax;
    this.color = {x:0xE87722, y:0x606EB2, z:0x002058}[axis];
    this.makeSlice = makeSlice;

    var sliderGroupElements = container.getElementsByClassName("slidergroup");
    var ourSliderGroup = sliderGroupElements[{x:0, y:1, z:2}[this.axis]];
    this.sliderElement = setupSlider(ourSliderGroup, this.axis + " = ",
				     {
					 start: this.c, 
					 range: {"min":this.cmin, "max":this.cmax},
					 orientation: "horizontal",
				     });
  
    
    this.placeGroup = function(group){
	if(this.axis == "z"){
	    group.position.z += this.c;
	}
	if(this.axis == "x"){
	    group.rotateY(-Math.PI/2);
	    group.rotateZ(-Math.PI/2);
	    group.position.x += this.c;
	}
	if(this.axis == "y"){
	    group.rotateX(Math.PI/2);
	    group.position.y += this.c;
	}
    };

    this.drawSlice = function(){
	this.slice = this.makeSlice(this.c, this.color);
	this.scene.add(this.slice);
    };
    
    this.drawPlane = function()
    {
	this.plane = new THREE.Group();
	var x0 = this.amin;
	var x1 = this.amax;
	var y0 = this.bmin;
	var y1 = this.bmax;
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(x0, y0, 0));
	geometry.vertices.push(new THREE.Vector3(x1, y0, 0));
	geometry.vertices.push(new THREE.Vector3(x1, y1, 0));
	geometry.vertices.push(new THREE.Vector3(x0, y1, 0));
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.faces.push(new THREE.Face3(0, 2, 3));
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	
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
    };

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


/*

   Plotting a function f(x,y) over a domain in the plane, here either
   the square [-1, 1] x [-1, 1] or the unit disc.  
   
 */

function drawPlotOverSquare(f, opts)
{
    var ans = new THREE.Group();
    if (typeof opts === 'undefined') {opts = {};}
    opts.samples = opts.samples || 40;
    opts.sGrid = opts.gridlines || 6;
    opts.tGrid = opts.gridlines || 6;
    opts.squareSize = opts.squareSize || 1;
    opts.gridpushoff = opts.gridpushoff || 0.01;
    if (typeof opts.showgrid === 'undefined') {opts.showgrid = true;}
    if (typeof opts.showsurface === 'undefined') {opts.showsurface = true;}
    if (typeof opts.opacity === 'undefined') {opts.opacity = 1.0;}

    var a = opts.squareSize;

    var phi = function(s, t){
	return new THREE.Vector3(s, t, f(s,t));
    };
    var normal = function(s, t){
	return new THREE.Vector3(0, 0, 1);
    };

    var material = null;
    if(opts.showsurface){
	material = basicMaterial(opts.opacity);
    }
    
    var param = new ParametricSurface(phi, normal, -a, a, -a, a,
				      opts.samples, opts.gridpushoff);


    var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
    param.addTo(ans, material, gridmat, opts.showgrid,
		opts.sGrid, opts.tGrid);
    return ans;
}


function drawPlotOverDisk(f, opts)
{
    var ans = new THREE.Group();
    if (typeof opts === 'undefined') {opts = {};}
    opts.samples = opts.samples || 100;
    opts.sGrid = opts.gridlines || 12;
    opts.tGrid = opts.gridlines || 6;
    opts.gridpushoff = opts.gridpushoff || 0.01;
    if (typeof opts.showgrid === 'undefined') {opts.showgrid = true;}
    if (typeof opts.showsurface === 'undefined') {opts.showsurface = true;}
    if (typeof opts.opacity === 'undefined') {opts.opacity = 1.0;}


    var phi = function(r, t){
	var x = r*Math.cos(t);
	var y = r*Math.sin(t);
	return new THREE.Vector3(x, y, f(x,y));
    };
    var normal = function(s, t){
	return new THREE.Vector3(0, 0, 1);
    };

    var material = null;
    if(opts.showsurface){
	material = basicMaterial(opts.opacity);
    }
    
    var param = new ParametricSurface(phi, normal, 0, Math.sqrt(2.0), 0, 2*Math.PI,
				      opts.samples, opts.gridpushoff);

    var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
    param.addTo(ans, material, gridmat, opts.showgrid,
		opts.sGrid, opts.tGrid);
    return ans;
}


/*

   A patch of a surface defined as the image of phi(s, t) on the
   square [s0, s1] x [t0, t1]. So that we can draw curves on it, the
   caller must provide a function that computes a unit normal
   vector field. Both phi and normal should return THREE.Vector3's.
   
 */

function ParametricSurface(phi, normal, s0, s1, t0, t1, samples, epsilon){
    this.phi = phi;
    this.normal = normal;
    this.s0 = s0;
    this.s1 = s1;
    this.t0 = t0;
    this.t1 = t1;
    this.samples = samples || 40;
    this.epsilon = epsilon || 0.01;
    this.ds = (s1 - s0)/this.samples;
    this.dt = (t1 - t0)/this.samples;

    this.initGeometry =  function(){
	var geometry = new THREE.Geometry();
	var i, j, k, s, t, n;
	n = this.samples;

	// Evaluate the parameterization at the sample points to find
	// the vertices.
	for(i = 0; i <= n; i++){
	    for(j = 0; j <= n; j++){
		s = this.s0 + i*this.ds;
		t = this.t0 + j*this.dt;
		geometry.vertices.push(this.phi(s, t));
	    }
	}
	
	// Now add in the triangles.
	for(i = 0; i < n; i++){
	    for(j = 0; j < n; j++){
		k = (n + 1)*j + i;
		geometry.faces.push(new THREE.Face3(k, k+1, k + n + 2));
		geometry.faces.push(new THREE.Face3(k, k + n + 2, k + n + 1));
	    }
	}
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
    };

    this.geometry = this.initGeometry();

    this.addTo = function(scene, material, gridMaterial, showGrid, sGrid, tGrid){
	var epsilon = this.epsilon;
	var ans = new THREE.Group();
	if(material !== null){
	    var mesh = new THREE.Mesh(this.geometry, material);
	    ans.add(mesh);
	}
	else{
	    epsilon = 0;
	}
	
	if(showGrid){
	    ans.add(this.addGrid(sGrid, tGrid, gridMaterial, epsilon));
	}
	scene.add(ans);
	return ans;
    };

    /*

       Given path c: [x0, x1] -> [s0, s1] x [t0, t1], return the
       Geometries of two push-offs of (phi o c) by epsilon.
       
     */
    
    this.addCurveTo = function(scene, material, c, x0, x1, epsilon){
	if(epsilon === undefined){
	    epsilon = 0.01;
	}
	var i, p0, p1, v, cval;
	var m = this.samples;
	var dx = (x1 - x0)/m;
	var ans = new THREE.Group();
	var topgeom = new THREE.Geometry();
	var bottomgeom = new THREE.Geometry();
	for(i = 0; i <=m; i++){
	    cval = c(x0 + i*dx);
	    p0 = this.phi(cval[0], cval[1]);
	    p1 = p0.clone();
	    v = this.normal(cval[0], cval[1]);
	    p0.addScaledVector(v, epsilon);
	    p1.addScaledVector(v, -epsilon);
	    topgeom.vertices.push(p0);
	    bottomgeom.vertices.push(p1);
	}
	ans.add(new THREE.Line(topgeom, material));
	ans.add(new THREE.Line(bottomgeom, material));
	scene.add(ans);
	return ans;
    };

    this.addGrid = function(sGrid, tGrid, material, epsilon){
	var i, s, t, c, ds, dt;
	var grid = new THREE.Group();
	// Gridlines that move in the s-direction, so t is constant.	
	dt = (this.t1 - this.t0)/sGrid;
	t = this.t0;
	for (i = 0; i <= sGrid; i++){
	    c = function(x){return [x, t];};
	    this.addCurveTo(grid, material, c, this.s0, this.s1, epsilon);
	    t += dt;
	}

	// Gridlines that move in the t-direction, so s is constant.
	ds = (this.s1 - this.s0)/tGrid;
	s = this.s0;
	for (i = 0; i <= tGrid; i++){
	    c = function(x){return [s, x];};
	    this.addCurveTo(grid, material, c, this.t0, this.t1, epsilon);
	    s += ds;
	}
	return grid;
    };

    
}
