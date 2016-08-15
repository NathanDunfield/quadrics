/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var container;
    var scene;
    var paramsurface;
    var edges;
    var surface;
    var slider;
    var basicGUI;
    var camera;

    init();

    function init()
    {
	container = document.getElementById("basicsphere");
	var values = setup3DScene(container);
	scene = values.scene;	
	camera = values.camera;
	fancyLighting(scene);
	setupCamera();
	basicGUI = new BasicGUI(container, updateSphere, setupCamera);

	var sliders = container.getElementsByClassName("slidergroup");
	slider = setupSlider(sliders[0], "radius = ", {
	    start: 2.0,
	    range: {"min": 0.5, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	slider.noUiSlider.on("update", updateSphere);

	var ticks = [-2, 0, 2];
	scene.add(axes(3, ticks, 3, ticks, -3, 3, ticks,
		       {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8, fontsize: 24, linewidth: 1}));
	slider.noUiSlider.set(2.0);
	values.animate();
    }

    function setupCamera(){
	camera.position.set(0, -10, 10);
	camera.up = new THREE.Vector3(0,0,1);
    }
    
    function updateSphere()
    {
	scene.remove(surface);
	drawSphere();
    }
    
    function drawSphere()
    {
	var radius = getSliderValue(slider);
	
	var phi = function(s, t){
	    var x = radius * Math.sin(s) * Math.cos(t);
	    var y = radius * Math.sin(s) * Math.sin(t);
	    var z = radius * Math.cos(s);
	    return new THREE.Vector3(x, y, z);
	};

	var normal = function(s, t){
	    var x = Math.sin(s) * Math.cos(t);
	    var y = Math.sin(s) * Math.sin(t);
	    var z = Math.cos(s);
	    return new THREE.Vector3(x, y, z);
	};
	
	paramsurface = new ParametricSurface(phi, normal, 0, Math.PI, 0, 2*Math.PI, 50, 0.01);
	var gridmat = new THREE.LineBasicMaterial({color:0x000000, linewidth: 2});
	surface = paramsurface.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 10, 6);
	
}

}()); // calling anonymous function. 
