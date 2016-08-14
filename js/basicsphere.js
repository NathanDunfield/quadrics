/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var container;
    var scene;
    var sphere;
    var edges;
    var slider;

    init();

    function init()
    {
	container = document.getElementById("basicsphere");
	var values = setup3DScene(container);
	scene = values.scene;
	var animate = values.animate;

	var sliders = container.getElementsByClassName("slidergroup");
	slider = setupSlider(sliders[0], "radius = ", {
	    start: 2.0,
	    range: {"min": 0.5, "max": 3.0},
	    orientation: "horizontal",
	    connect: "lower",
	});

	slider.noUiSlider.on("update", updateSphere);

	fancyLighting(scene);

	var ticks = [-2, 0, 2];
	scene.add(axes(3, ticks, 3, ticks, -3, 3, ticks,
		       {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8, fontsize: 24, linewidth: 1}));
	slider.noUiSlider.set(2.0);
	animate();
    }


    function updateSphere()
    {
	scene.remove(sphere);
	scene.remove(edges);
	drawSphere();
    }
    
    function drawSphere()
    {
	var radius = getSliderValue(slider);
	// Sphere parameters: radius, segments along width, segments along height
	var geometry = new THREE.SphereGeometry(radius, 32, 16 );
	geometry.rotateX(Math.PI/2);
	// use a "lambert" material rather than "basic" for realistic lighting.
	var material = new THREE.MeshLambertMaterial({color:0xEEEEEE });
	sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(0, 0, 0);
	sphere.scale.multiplyScalar(0.995);
	var othersphere = new THREE.Mesh(geometry, material);
	edges = new THREE.EdgesHelper(othersphere, "black");
	edges.material.linewidth=1.5;
	scene.add(edges);
	scene.add(sphere);
}

}()); // calling anonymous function. 
