/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene;
    var container;
    var camera;
    var plot;
    var Aslider;
    var Bslider;
    var basicGUI;
    
    init();

    function createPlotFunction(A, B){
	return function(x, y){return A*x*x + B*y*y;};
    }

    function createPlotParameterization(A, B){
	A = Math.max(A, 0.01);
	B = Math.max(B, 0.01);
	var xmax, ymax;
	var zmax = 3.0;
	var rmax = 3.0;
	var C = Math.min(A, B);
	if(zmax <  C*rmax*rmax){
	    xmax = Math.sqrt(zmax/A);
	    ymax = Math.sqrt(zmax/B);
	}
	else{
	    xmax = Math.sqrt(C/A)*rmax;
	    ymax = Math.sqrt(C/B)*rmax;
	}
	
	var phi = function(s, t){
	    var x = xmax*s*Math.cos(t);
	    var y = ymax*s*Math.sin(t);
	    return new THREE.Vector3(x, y, A*x*x + B*y*y);
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
	container = document.getElementById("ellparab");
	var values = setup3DScene(container);
	scene = values.scene;
	camera = values.camera;
	values.controls.target.set(0, 0, 3.0);
	
	fancyLighting(scene);
	setCamera();

	// Axes
	var ticks = [-1, 0, 1];
	var zticks = [0, 1, 2, 3, 4, 5, 6];
	var ax = axes(1.5, ticks, 1.5, ticks, 0, 6.5, zticks);
	scene.add(ax);

	// Setup UI, first the simple stuff.

	basicGUI = new BasicGUI(container, updatePlot, setCamera);
	
	// Now setup and connect the sliders.

	var sliders = container.getElementsByClassName("slidergroup");
	Aslider = setupSlider(sliders[0], "A = ",  {
	    start: 1.0,
	    range: {"min": 0, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Bslider = setupSlider(sliders[1], "B = ", {
	    start: 1.0,
	    range: {"min": 0, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Aslider.noUiSlider.on("update", updatePlot);
	Bslider.noUiSlider.on("update", updatePlot);
	values.animate();
    }

    function setCamera(){
	camera.position.set(6.7, -7.9, 6.4);
	camera.up = new THREE.Vector3(0,0,1);
    }
	
    function updatePlot()
    {
	scene.remove(plot);
	var A = getSliderValue(Aslider);
	var B =  getSliderValue(Bslider);
	var opts = {showgrid: basicGUI.checked()};

	if (basicGUI.menu.value == "square"){
	    var f = createPlotFunction(A, B);
	    plot = drawPlotOverSquare(f, opts);
	}
	else{
	    plot = new THREE.Group();
	    var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
	    var param = createPlotParameterization(A, B);
	    param.addTo(plot, basicMaterial(1.0), gridmat, basicGUI.checked(), 6, 6);
	}

	scene.add(plot);
    }
    
}()); // calling anonymous function. 
