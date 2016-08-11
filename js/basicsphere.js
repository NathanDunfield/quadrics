/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {

var gui, scene;
var parameters;
var sphere;
var edges;
var slider;     

init();

function init()
{
    var values = setup3DScene("basicsphere");
    gui = values.gui;
    scene = values.scene;
    var animate = values.animate;

    slider = document.getElementById("radiusslider");
    noUiSlider.create(slider, {
	start: 2.0,
	range: {"min": 0.5, "max": 3.0},
	orientation: "horizontal",
    });

    slider.noUiSlider.on("update", updateSphere)
    // parameters = {radius:2.0};
    // gui.add(parameters, 'radius', 1, 3, 0.1).onChange(updateSphere);

    fancyLighting(scene);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));
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
    var radius = slider.noUiSlider.get();
    console.log(radius);
    // Sphere parameters: radius, segments along width, segments along height
    var geometry = new THREE.SphereGeometry(radius, 32, 16 );
    geometry.rotateX(Math.PI/2);
    // use a "lambert" material rather than "basic" for realistic lighting.
    var material = new THREE.MeshLambertMaterial({color:0xEEEEEE });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
    edges = new THREE.EdgesHelper(sphere, "black");
    edges.material.linewidth=1.5;
    scene.add(edges);
}

}()); // calling anonymous function. 
