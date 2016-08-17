/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene;
    var container;
    var camera;
    var plot;
    var Aslider;
    var Bslider;
    var domainMenu;
    var basicGUI;

    
    init();

    function topPlotFunction(A, B){
	return function(x, y){return Math.sqrt(A*x*x + B*y*y);};
    }

    function bottomPlotFunction(A, B){
	return function(x, y){return -Math.sqrt(A*x*x + B*y*y);};
    }

    function createPlotParameterization(A, B, sign){
	A = Math.max(A, 0.0001);
	B = Math.max(B, 0.0001);
	var xmax, ymax;
	var zmax = 2.0;
	var rmax = 4.0;
	var C = Math.min(A, B);
	if(zmax*zmax <  C*rmax*rmax){
	    xmax = zmax/Math.sqrt(A);
	    ymax = zmax/Math.sqrt(B);
	}
	else{
	    xmax = Math.sqrt(C/A)*rmax;
	    ymax = Math.sqrt(C/B)*rmax;
	}
	
	var phi = function(s, t){
	    var x = xmax*s*Math.cos(t);
	    var y = ymax*s*Math.sin(t);
	    return new THREE.Vector3(x, y, sign*Math.sqrt((A*x*x + B*y*y)));
	};

	var normal = function(s, t){
	    return new THREE.Vector3(0, 0, 1);
	};

	var param = new ParametricSurface(phi, normal, 0, 1, 0, 2*Math.PI, 60);
	return param;
    }
    

    
    
    function init()
    {
	// Setup scene and lighting
	container = document.getElementById("cone");
	var values = setup3DScene(container);
	scene = values.scene;
	fancyLighting(scene);
	camera = values.camera;
	setCamera();
	basicGUI = new BasicGUI(container, updatePlot, setCamera);

	// Axes
	var ticks = [-2, -1, 0, 1, 2];
	var zticks = [-3, -2, -1, 0, 1, 2, 3];
	scene.add(axes(2.5, ticks, 2.5, ticks, -3.5, 3.5,  zticks));

	// Now setup and connect the sliders.

	var sliders = container.getElementsByClassName("slidergroup");
	Aslider = setupSlider(sliders[0], "A = ",  {
	    start: 1.0,
	    range: {"min": 0.0, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Bslider = setupSlider(sliders[1], "B = ", {
	    start: 1.0,
	    range: {"min": 0.0, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Aslider.noUiSlider.on("update", updatePlot);
	Bslider.noUiSlider.on("update", updatePlot);
	values.animate();
    }

    function setCamera(){
	var s = 1.3;
	camera.position.set(s*6.7, -s*7.9, s*5.4);
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,0,0));
    }
    
    function updatePlot()
    {
	scene.remove(plot);
	var A = getSliderValue(Aslider);
	var B =  getSliderValue(Bslider);
	var f = topPlotFunction(A, B);
	var g = bottomPlotFunction(A, B);
	var opts = {showgrid: basicGUI.checked(),
		    squareSize:2.0};

	plot = new THREE.Group();
	if (basicGUI.menu.value == "square"){
	    plot.add(drawPlotOverSquare(f, opts));
	    plot.add(drawPlotOverSquare(g, opts));
	}
	else{
	    var gridmat = new THREE.LineBasicMaterial(
		{color:0x444444, linewidth: 2});
	    var top = createPlotParameterization(A, B, 1);
	    var bottom = createPlotParameterization(A, B, -1);
	    top.addTo(plot, basicMaterial(1.0), gridmat, basicGUI.checked(), 6, 6);
	    bottom.addTo(plot, basicMaterial(1.0), gridmat, basicGUI.checked(), 6, 6);
	}
	    
	scene.add(plot);
	// console.log(camera.position);
	// console.log(camera.up);
	
    }
    
}()); // calling anonymous function. 
