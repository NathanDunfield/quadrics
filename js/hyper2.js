/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene;
    var container;
    var camera;
    var plot;
    var Aslider, Bslider, Cslider;
    var showGridCheckbox;
    var domainMenu;
    var surpressUpdate = true;
    
    init();

    function topPlotFunction(A, B, C){
	return function(x, y){return C*Math.sqrt(1 + (x/A)*(x/A) + (y/B)*(y/B));};
    }

    function bottomPlotFunction(A, B, C){
	var f = topPlotFunction(A, B, C);
	return function(x, y){return -f(x,y);};
    }
    
    function init()
    {
	// Setup scene and lighting
	container = document.getElementById("hyper2");
	var values = setup3DScene(container);
	scene = values.scene;
	fancyLighting(scene);
	camera = values.camera;
	camera.position.set(6.7, -7.9, 5.4);
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,0,0));

	// Axes
	var ticks = [-1, 0, 1];
	var zticks = [-3, -2, -1, 0, 1, 2, 3];
	scene.add(axes(1.5, ticks, 1.5, ticks, -3.5, 3.5,  zticks));

	// Setup UI, first the simple stuff.

	showGridCheckbox = container.getElementsByTagName("input")[0];
	showGridCheckbox.checked = true;
	showGridCheckbox.onchange = updatePlot;

	domainMenu = container.getElementsByTagName("select")[0];
	domainMenu.onchange = updatePlot;
	
	// Now setup and connect the sliders.

	var sliders = container.getElementsByClassName("slidergroup");
	Aslider = setupSlider(sliders[0], "A = ",  {
	    start: 1.0,
	    range: {"min": 0.1, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Bslider = setupSlider(sliders[1], "B = ", {
	    start: 1.0,
	    range: {"min": 0.1, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Cslider = setupSlider(sliders[2], "C = ", {
	    start: 1.0,
	    range: {"min": 0.1, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Aslider.noUiSlider.on("update", updatePlot);
	Bslider.noUiSlider.on("update", updatePlot);
	surpressUpdate = false;
	Cslider.noUiSlider.on("update", updatePlot);
	values.animate();
    }

    function updatePlot()
    {
	if(surpressUpdate){return;}
	scene.remove(plot);
	var A = getSliderValue(Aslider);
	var B =  getSliderValue(Bslider);
	var C =  getSliderValue(Cslider);
	var f = topPlotFunction(A, B, C);
	var g = bottomPlotFunction(A, B, C);
	var opts = {showgrid: showGridCheckbox.checked};

	plot = new THREE.Group();
	if (domainMenu.value == "square"){
	    plot.add(drawPlotOverSquare(f, opts));
	    plot.add(drawPlotOverSquare(g, opts));
	}
	else{
	    plot.add(drawPlotOverDisk(f, opts));
	    plot.add(drawPlotOverDisk(g, opts));
	}
	    
	scene.add(plot);
	// console.log(camera.position);
	// console.log(camera.up);
	
    }
    
}()); // calling anonymous function. 
