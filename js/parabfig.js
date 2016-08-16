/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene;
    var container;
    var camera;
    var plot;
    var basicGUI;
    
    init();

    function f(x, y){
	return x*x + y*y;
    }
    
    function init()
    {
	// Setup scene and lighting
	container = document.getElementById("ellfig");
	var values = setup3DScene(container);
	scene = values.scene;
	camera = values.camera;
	// values.controls.target.set(0, 0, 1.0);
	
	fancyLighting(scene);
	setCamera();

	// Axes
	var ticks = [-1, 0, 1];
	var zticks = [0, 1, 2];
	var ax = axes(1.25, ticks, 1.25, ticks, 0, 2.5, zticks, {fontsize: 16, axisLabelSep:0.6});
	scene.add(ax);

	// Setup UI, first the simple stuff.

	basicGUI = new BasicGUI(container, updatePlot, setCamera);
	updatePlot();
	values.animate();
    }

    function setCamera(){
	camera.position.set(6.7, -7.9, 6.4);
	camera.up = new THREE.Vector3(0,0,1);
    }
	
    function updatePlot()
    {
	scene.remove(plot);
	var opts = {showgrid: basicGUI.checkbox.checked, samples:200};

	if (basicGUI.menu.value == "square"){
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
