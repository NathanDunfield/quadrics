/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface, surface;
    var basicGUI;
    var Aslider, Bslider, Cslider;

    container = document.getElementById("ellipsoid");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);

    // Setup sliders

    var sliders = container.getElementsByClassName("slidergroup");
    Aslider = setupSlider(sliders[0], "A = ", {
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

    Aslider.noUiSlider.on("update", drawSurface);
    Bslider.noUiSlider.on("update", drawSurface);
    Cslider.noUiSlider.on("update", drawSurface);
    
    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-3, -2, -1, 0, 1, 2, 3];
    var ax = axes(2.5, ticks, 2.5, ticks, -3.5, 3.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);


    // Create three parameterizations, to make computing slices trivial.

    function createParametricSurface(A, B, C){
	var phi = function(s, t){
	    var x = A * Math.sin(s) * Math.cos(t);
	    var y = B * Math.sin(s) * Math.sin(t);
	    var z = C *Math.cos(s);
	    return new THREE.Vector3(x, y, z);
	};

	var normal = function(s, t){
	    var x = Math.sin(s)*Math.cos(t)/A;
	    var y = Math.sin(s)*Math.sin(t)/B;
	    var z = Math.cos(s)/C;
	    var ans = new THREE.Vector3(x, y, z);
	    ans.normalize();
	    return ans;
	};

	return new ParametricSurface(phi, normal, 0, Math.PI, 0, 2*Math.PI, 100);
    }

    drawSurface();
    values.animate();

    function setCamera(){
	var s = 0.83;
	camera.position.set(s*9.4, -s*14.1, s*10.8);
	camera.up = new THREE.Vector3(0,0,1);
    }

    function drawSurface()
    {
	scene.remove(surface);
	var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
	var A =  getSliderValue(Aslider);
	var B =  getSliderValue(Bslider);
	var C =  getSliderValue(Cslider);
	paramsurface = createParametricSurface(A, B, C);
	surface = paramsurface.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 8, 8);
    }

}()); // call anonymous function. 
