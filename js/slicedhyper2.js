/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface0, paramsurface1, paramsurface2, paramsurface3, surface;
    var basicGUI;

    container = document.getElementById("slicedhyper2");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);


    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-3, -2, -1, 0, 1, 2, 3];
    var ax = axes(3.1, ticks, 3.1, ticks, -3.5, 3.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);


    // Create four parameterizations, to make computing slices trivial.

    // Here it is as a surface of rotation, which is the one we usually plot.
    
    var phi0 = function(s, t){
	var x = s * Math.cos(t);
	var y = s * Math.sin(t);
	var z = Math.sqrt(1 + s*s);
	return new THREE.Vector3(x, y, z);
    };

    var normal0 = function(s, t){
	var x = s * Math.cos(t);
	var y = s * Math.sin(t);
	var z = Math.sqrt(1 + s^2);
	var ans = new THREE.Vector3(x, y, -z);
	ans.normalize();
	return ans;
    };

    paramsurface0 = new ParametricSurface(phi0, normal0, 0, 3, 0, 2*Math.PI, 100);


    var phi1 = function(s, t){
	var x = s * Math.cos(t);
	var y = s * Math.sin(t);
	var z = -Math.sqrt(1 + s*s);
	return new THREE.Vector3(x, y, z);
    };

    var normal1 = function(s, t){
	var x = s * Math.cos(t);
	var y = s * Math.sin(t);
	var z = Math.sqrt(1 + s^2);
	var ans = new THREE.Vector3(x, y, z);
	ans.normalize();
	return ans;
    };

    paramsurface1 = new ParametricSurface(phi1, normal1, 0, 3, 0, 2*Math.PI, 100);


    // Here they are as z = f(x, y) so we can easily draw the vertical slices.

    var phi2 = function(x, y){
	return new THREE.Vector3(x, y, Math.sqrt(1 + x*x + y*y));
    };

    var normal2 = function(x, y){
	var z = Math.sqrt(1 + x*x + y*y);
	var ans = new THREE.Vector3(x, y, -z);
	ans.normalize();
	return ans;
    };

    paramsurface2 = new ParametricSurface(phi2, normal2, -3, 3, -3, 3, 50);

    var phi3 = function(x, y){
	return new THREE.Vector3(x, y, -Math.sqrt(1 + x*x + y*y));
    };

    var normal3 = function(x, y){
	var z = -Math.sqrt(1 + x*x + y*y);
	var ans = new THREE.Vector3(x, y, -z);
	ans.normalize();
	return ans;
    };

    paramsurface3 = new ParametricSurface(phi3, normal3, -3, 3, -3, 3, 50);

    // Compute the slice functions.

    function xSlice(c, color){
	var group = new THREE.Group();
	if(Math.abs(c) <= 3.0){
	    var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	    var a = Math.sqrt(9 - c*c);
	    var curve = function(t){
		return [c, t];
	    };
	    paramsurface2.addCurveTo(group, material, curve, -a, a);
	    paramsurface3.addCurveTo(group, material, curve, -a, a);
	}
	return group;
    }


    function ySlice(c, color){
	var group = new THREE.Group();
	if(Math.abs(c) <= 3.0){
	    var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	    var a = Math.sqrt(9 - c*c);
	    var curve = function(t){
		return [t, c];
	    };
	    paramsurface2.addCurveTo(group, material, curve, -a, a);
	    paramsurface3.addCurveTo(group, material, curve, -a, a);
	}
	return group;
    }


    function zSlice(c, color){
	var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	if(Math.abs(c) >= 1){
	    var r = Math.sqrt(c*c - 1);
	    var curve = function(t){
		return [r, t];
	    };
	    if(c >= 1){
		paramsurface0.addCurveTo(group, material, curve, 0, 2*Math.PI);
	    }
	    if(c <= -1){
		paramsurface1.addCurveTo(group, material, curve, 0, 2*Math.PI);
	    }
	}
	return group;
    }

    // Now setup and connect the sliders to the slices.

    var xslice = new QuadricSlice(container, scene, "x", 1,
				 -3.1, 3.1, -3.1, 3.1, -3.5, 3.5, xSlice);

    var yslice = new QuadricSlice(container, scene, "y", -1,
				 -3.1, 3.1, -3.1, 3.1, -3.5, 3.5, ySlice);

    var zslice = new QuadricSlice(container, scene, "z", -2, 
				 -3, 3, -3.1, 3.1, -3.1, 3.1, zSlice);
       
    
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
	surface = new THREE.Group();
	paramsurface0.addTo(surface, basicGUI.material(), gridmat,
			    basicGUI.checked(), 6, 6);
	paramsurface1.addTo(surface, basicGUI.material(), gridmat,
			    basicGUI.checked(), 6, 6);
	scene.add(surface);
    }

}()); // call anonymous function. 
