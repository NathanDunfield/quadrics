/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene, camera, animate, parameters, surface, container, values;
    var basicGUI;
    var vshift = 0;    
    
    container = document.getElementById("slicedhypparab");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    animate = values.animate;
    setCamera();

    fancyLighting(scene);
    
    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    var ax = axes(2.5, ticks, 2.5, ticks, -4.5, 4.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    ax.position.z += vshift;
    scene.add(ax);
    
    // Setup UI, first the simple stuff.

    basicGUI = setupBasicGUI(container, drawParaboloid, setCamera);
        
    // Now setup and connect the sliders to the slices.
    
    var xslice = new QuadricSlice(container, scene, "x", -2,
				 -2, 2, -2.5, 2.5, -4.5, 4.5, 
				  vshift, drawXSlice);
    var yslice = new QuadricSlice(container, scene, "y", -2,
				 -2, 2, -2.5, 2.5, -4.5, 4.5, 
				  vshift, drawYSlice);
    var zslice = new QuadricSlice(container, scene, "z", 1, 
				 -3.95, 3.95, -2.5, 2.5, -2.5, 2.5,
				  vshift, drawZSlice);
    drawParaboloid();
    animate();

    function setCamera(){
	var s = 0.95;
	camera.position.set(s*9.4, -s*14.1, s*5.8);
	camera.up = new THREE.Vector3(0,0,1);
    }
    
    function perturbSlice(slice){
	var ans = new THREE.Group();
	var other = slice.clone();
	slice.position.z += 0.02;
	other.position.z += -0.02;
	ans.add(slice);
	ans.add(other);
	return ans;
    }
    

    function parabolaGeometry(c, s){
	var geometry = new THREE.Geometry();
	var t, dt;
	t = -2.0;
	dt = 1/10.0;
	for (var k=0; k <= 40; k++){
	    geometry.vertices.push(new THREE.Vector3(t, s*(- t*t + c*c), 0));
	    t = t+dt;
	}
	return geometry;
    }


    function hyperbolaGeometry(c, s){
	var geometry = new THREE.Geometry();
	var t, v, dt;
	t = -2.0;
	dt = 1/10.0;
	if(c < 0){
	    for (var k=0; k <= 40; k++){
		v = Math.sqrt(t*t - c);
		if (v <= 2.0) {
		    geometry.vertices.push(new THREE.Vector3(t, s*v, 0));
		}
		t = t+dt;
	    }
	}
	if(c > 0){
	    for (var k=0; k <= 40; k++){
		v = Math.sqrt(t*t + c);
		if (v <= 2.0) {
		    geometry.vertices.push(new THREE.Vector3(s*v, t, 0));
		}
		t = t+dt;
	    }
	}
	if (c == 0){
	    geometry.vertices.push(new THREE.Vector3(-2*s, 2*s, 0));
	    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(2*s, 2*s, 0));
	}
	
	
	return geometry;
    }
    
    function drawXSlice()
    {
	var geometry = parabolaGeometry(this.c, 1);
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:6});
	var slice = new THREE.Line(geometry, material);
	this.placeGroup(slice);
	this.slice = perturbSlice(slice);
	this.scene.add(this.slice);
    };

    function drawYSlice()
    {
	var geometry = parabolaGeometry(this.c, -1);
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:6});
	var slice = new THREE.Line(geometry, material);
	this.placeGroup(slice);
	this.slice = perturbSlice(slice);
	this.scene.add(this.slice);
    };

    function drawZSlice()
    {
	var slice = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:6});
	slice.add(new THREE.Line(hyperbolaGeometry(this.c, 1), material));
	slice.add(new THREE.Line(hyperbolaGeometry(this.c, -1), material));
	this.placeGroup(slice);
	this.slice = perturbSlice(slice);
	this.scene.add(this.slice);
    };

    function drawParaboloid()
    {
	function f(x, y){
	    return x*x - y*y;
	}
	var showsurface, opacity;

	scene.remove(surface);

	switch(basicGUI.menu.value){
	    case "invisible":
		showsurface = false;
		break
	    case "transparent":
		showsurface = true;
		opacity = 0.3;
		break;
	    case "solid":
		showsurface = true;
		opacity = 1.0;
		break;
	}
	surface = drawPlotOverSquare(f, {
	    showgrid: basicGUI.checkbox.checked, 
	    showsurface: showsurface, opacity: opacity,
	    squareSize: 2});
	surface.position.z += vshift;
	scene.add(surface);
    }

}()); // call anonymous function. 
