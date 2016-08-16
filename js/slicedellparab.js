/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface, surface;
    var basicGUI;

    container = document.getElementById("slicedellparab");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    values.controls.target.set(0, 0, 3.5);
    
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);


    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var ax = axes(2.5, ticks, 2.5, ticks, 0, 8.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);


    // Create the parameterization

    var phi = function(s, t){
	return new THREE.Vector3(s, t, s*s + t*t);
    };

    var normal = function(s, t){
	var ans = new THREE.Vector3(-2*s, -2*t, 1);
	ans.normalize();
	return ans;
    };

    paramsurface = new ParametricSurface(phi, normal, -2, 2, -2, 2, 100);

    // Compute the slice functions. 
    
    function graphXSlice(c, color){
	var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	var curve = function(x){
	    return [c, x];
	};
	paramsurface.addCurveTo(group, material, curve, -2, 2);
	return group;
    }

    function graphYSlice(c, color){
	var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	var curve = function(x){
	    return [x, c];
	};
	return paramsurface.addCurveTo(group, material, curve, -2, 2);
    }

    function zSlice(c, color){
	var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	var r = Math.sqrt(c);
	var curve = function(x){
	    return [r*Math.cos(x), r*Math.sin(x)];
	};
	return paramsurface.addCurveTo(group, material, curve, 0, 2*Math.PI);
    }
	
    // Now setup and connect the sliders to the slices.

    
    var xslice = new QuadricSlice(container, scene, "x", -2,
				 -2, 2, -2.5, 2.5, 0, 8.5, graphXSlice);

    var yslice = new QuadricSlice(container, scene, "y", 2,
				 -2, 2, -2.5, 2.5, 0, 8.5, graphYSlice);
    
    var zslice = new QuadricSlice(container, scene, "z", 1, 
				  0.005, 4, -2.5, 2.5, -2.5, 2.5, zSlice);

    drawSurface();
    values.animate();

    function setCamera(){
	var s = 0.9;
	camera.position.set(s*9.4, -s*14.1, s*10.8);
	camera.up = new THREE.Vector3(0,0,1);
    }

    function drawSurface()
    {
	scene.remove(surface);
	var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
	surface = paramsurface.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 6, 6);
    }

}()); // call anonymous function. 
