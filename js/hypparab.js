/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene;
    var container;
    var camera;
    var plot;
    var Aslider;
    var Bslider;
    var showGridCheckbox;
    var domainMenu;
    
    init();

    function createPlotFunction(A, B){
	return function(x, y){return A*x*x + B*y*y;}
    }
    
    function init()
    {
	// Setup scene and lighting
	container = document.getElementById("hypparab");
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
	    range: {"min": 0.0, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	Bslider = setupSlider(sliders[1], "B = ", {
	    start: -1.0,
	    range: {"min": -3.0, "max": 0.0},
	    orientation: "horizontal",
	    connect: "upper",
	});

	Aslider.noUiSlider.on("update", updatePlot);
	Bslider.noUiSlider.on("update", updatePlot);
	values.animate();
    }

    function updatePlot()
    {
	scene.remove(plot);
	var A = getSliderValue(Aslider);
	var B =  getSliderValue(Bslider);
	var f = createPlotFunction(A, B);
	var opts = {showgrid: showGridCheckbox.checked};

	if (domainMenu.value == "square"){
	    plot = drawPlotOverSquare(f, opts);
	}
	else{
	    plot = drawPlotOverDisk(f, opts);
	}
	    
	scene.add(plot);
	// console.log(camera.position);
	// console.log(camera.up);
	
    }
    
}()); // calling anonymous function. 
