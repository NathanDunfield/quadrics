/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface, surface;
    var basicGUI;
    var Aslider, Bslider, Cslider;

    container = document.getElementById("hyper1");
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
	range: {"min": 0.1, "max": 2.5},
	orientation: "horizontal",
	connect: "lower",
    });

    Bslider = setupSlider(sliders[1], "B = ", {
	start: 1.0,
	range: {"min": 0.1, "max": 2.5},
	orientation: "horizontal",
	connect: "lower",
    });

    Cslider = setupSlider(sliders[2], "C = ", {
	start: 1.0,
	range: {"min": 0.1, "max": 2.5},
	orientation: "horizontal",
	connect: "lower",
    });

    Aslider.noUiSlider.on("update", drawSurface);
    Bslider.noUiSlider.on("update", drawSurface);
    Cslider.noUiSlider.on("update", drawSurface);
    
    // Axes
    var ticks = [-4, -2, 0, 2, 4];
    var ax = axes(4.5, ticks, 4.5, ticks, -4.5, 4.5, ticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);


    // Create three parameterizations, to make computing slices trivial.

    function createParametricSurface(A, B, C){
	var phi = function(s, t){
	    var r = Math.sqrt(1 + s*s/(C*C));
	    var x = r * A * Math.cos(t);
	    var y = r * B * Math.sin(t);
	    var z = s;
	    return new THREE.Vector3(x, y, z);
	};

	var normal = function(s, t){
	    var r = Math.sqrt(1 + s*s/(C*C));
	    var x = r * A * Math.cos(t)/A;
	    var y = r * B * Math.sin(t)/B;
	    var z = -s/(C*C);
	    var ans = new THREE.Vector3(x, y, z);
	    ans.normalize();
	    return ans;
	};

	return new ParametricSurface(phi, normal, -3, 3, 0, 2*Math.PI, 100);
    }

    drawSurface();
    values.animate();

    function setCamera(){
	var s = 1.3;
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
