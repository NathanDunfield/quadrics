/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, animate, parameters, surface, container, values;
    var showGridCheckbox;
    var surfaceMenu;
    var vshift = -3.5;

    container = document.getElementById("slicedellparab");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    animate = values.animate;
    var s = 0.85;
    camera.position.set(s*9.4, -s*14.1, s*4.8);
    camera.up = new THREE.Vector3(0,0,1);
    fancyLighting(scene);

    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var ax = axes(2.5, ticks, 2.5, ticks, 0, 8.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    ax.position.z += vshift;
    scene.add(ax);

    // Setup UI, first the simple stuff.

    showGridCheckbox = container.getElementsByTagName("input")[0];
    showGridCheckbox.checked = true;
    showGridCheckbox.onchange = drawParaboloid;
    
    surfaceMenu = container.getElementsByTagName("select")[0];
    surfaceMenu.value = "transparent";
    surfaceMenu.onchange = drawParaboloid;
    
    // Now setup and connect the sliders to the slices.
    
    var xslice = new QuadricSlice(container, scene, "x", -2,
				 -2, 2, -2.5, 2.5, 0, 8.5, 
				  vshift, drawVerticalSlice);
    var yslice = new QuadricSlice(container, scene, "y", 2,
				  -2, 2, -2.5, 2.5, 0, 8.5,
				  vshift, drawVerticalSlice);
    var zslice = new QuadricSlice(container, scene, "z", 1, 
				  0.005, 4, -2.5, 2.5, -2.5, 2.5,
				  vshift, drawHorizontalSlice);
    drawParaboloid();
    animate();

    function perturbSlice(slice){
	var ans = new THREE.Group();
	var other = slice.clone();
	slice.position.z += 0.01;
	other.position.z += -0.01;
	ans.add(slice);
	ans.add(other);
	return ans;
    }
    
    function drawHorizontalSlice()
    {
	var geometry = circleGeometry(Math.sqrt(this.c), 40);
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:6});
	var slice = new THREE.Line(geometry, material);
	this.placeGroup(slice);
	this.slice = perturbSlice(slice);
	this.scene.add(this.slice);
    };

    function drawVerticalSlice()
    {
	var geometry = new THREE.Geometry;
	var t, c, dt;
	t = -2.0;
	dt = 1/10.0;
	c = this.c*this.c;
	for (var k=0; k <= 40; k++){
	    geometry.vertices.push(new THREE.Vector3(t, t*t + c, 0));
	    t = t+dt;
	}
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:6});
	var slice = new THREE.Line(geometry, material);
	this.placeGroup(slice);
	this.slice = perturbSlice(slice);
	this.scene.add(this.slice);
    };

    function drawParaboloid()
    {
	function f(x, y){
	    return x*x + y*y;
	}
	var showsurface, opacity;

	scene.remove(surface);

	switch(surfaceMenu.value){
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
	    showgrid: showGridCheckbox.checked, 
	    showsurface: showsurface, opacity: opacity,
	    squareSize: 2});
	surface.position.z += vshift;
	scene.add(surface);
    }

}()); // call anonymous function. 
