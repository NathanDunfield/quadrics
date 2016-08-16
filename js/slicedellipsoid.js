/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface0, paramsurface1, paramsurface2, surface;
    var basicGUI;

    container = document.getElementById("slicedellipsoid");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);


    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-3, -2, -1, 0, 1, 2, 3];
    var ax = axes(2.5, ticks, 2.5, ticks, -3.5, 3.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);


    // Create three parameterizations, to make computing slices trivial.
    
    var phi0 = function(s, t){
	var x = Math.sin(s) * Math.cos(t);
	var y = 2*Math.sin(s) * Math.sin(t);
	var z = 3*Math.cos(s);
	return new THREE.Vector3(x, y, z);
    };

    var normal0 = function(s, t){
	var x = 6*Math.sin(s)*Math.cos(t);
	var y = 3*Math.sin(s)*Math.sin(t);
	var z = 2*Math.cos(s);
	var ans = new THREE.Vector3(x, y, z);
	ans.normalize();
	return ans;
    };

    paramsurface0 = new ParametricSurface(phi0, normal0, 0, Math.PI, 0, 2*Math.PI, 100);


    var phi1 = function(s, t){
	var x = Math.cos(s);
	var y = 2*Math.sin(s) * Math.cos(t);
	var z = 3*Math.sin(s) * Math.sin(t);

	return new THREE.Vector3(x, y, z);
    };

    var normal1 = function(s, t){
	var x = 6*Math.cos(s);
	var y = 3*Math.sin(s)*Math.cos(t);
	var z = 2*Math.sin(s)*Math.sin(t);
	var ans = new THREE.Vector3(x, y, z);
	ans.normalize();
	return ans;
    };

    paramsurface1 = new ParametricSurface(phi1, normal1, 0, Math.PI, 0, 2*Math.PI, 100);

    var phi2 = function(s, t){
	var x = Math.sin(s) * Math.sin(t);
	var y = 2*Math.cos(s);
	var z = 3*Math.sin(s) * Math.cos(t);
	return new THREE.Vector3(x, y, z);
    };

    var normal2 = function(s, t){
	var x = 6*Math.sin(s)*Math.sin(t);
	var y = 3*Math.cos(s);
	var z = 2*Math.sin(s)*Math.cos(t);
	var ans = new THREE.Vector3(x, y, z);
	ans.normalize();
	return ans;
    };

    paramsurface2 = new ParametricSurface(phi2, normal2, 0, Math.PI, 0, 2*Math.PI, 100);

    // Compute the slice functions. 


    function makeSlice(param, a){
	return function(c, color){
	    var group = new THREE.Group();
	    if(Math.abs(c/a) > 1){
		return group;
	    }
	    var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	    var s = Math.acos(c/a);
	    var curve = function(t){
		return [s, t];
	    };
	    return param.addCurveTo(group, material, curve, 0, 2*Math.PI);
	};
    }

    // Now setup and connect the sliders to the slices.
    
    var xslice = new QuadricSlice(container, scene, "x", 0,
				 -2, 2, -2.5, 2.5, -3.5, 3.5,
				  makeSlice(paramsurface1, 1));
	
    var yslice = new QuadricSlice(container, scene, "y", -1,
				  -2, 2, -2.5, 2.5, -3.5, 3.5, 
				  makeSlice(paramsurface2, 2));

    var zslice = new QuadricSlice(container, scene, "z", -1, 
				 -3.5, 3.5, -2.5, 2.5, -2.5, 2.5,
				  makeSlice(paramsurface0, 3));

    
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
	surface = paramsurface0.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 8, 8);
    }

}()); // call anonymous function. 
