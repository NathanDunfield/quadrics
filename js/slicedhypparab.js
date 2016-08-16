/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var scene, camera, container, values;
    var paramsurface, surface;
    var basicGUI;
    
    
    container = document.getElementById("slicedhypparab");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);
    
    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    var ax = axes(2.5, ticks, 2.5, ticks, -4.5, 4.5, zticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    scene.add(ax);
    
    // Create the parameterization

    var phi = function(s, t){
	return new THREE.Vector3(s, t, s*s - t*t);
    };

    var normal = function(s, t){
	var ans = new THREE.Vector3(-2*s, 2*t, 1);
	ans.normalize();
	return ans;
    };

    paramsurface = new ParametricSurface(phi, normal, -2, 2, -2, 2, 60);

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
	var a, c1, c2;
	var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({color:color, linewidth:5});
	if(c < 0){
	    c1 = function(x){
		return [x, Math.sqrt(x*x - c)];
	    };
	    c2 = function(x){
		return [x, -Math.sqrt(x*x - c)];
	    };
	    a = Math.sqrt(4 + c);
	}
	if(c > 0){
	    c1 = function(y){
		return [Math.sqrt(y*y + c), y];
	    };
	    c2 = function(y){
		return [-Math.sqrt(y*y + c), y];
	    };
	    a = Math.sqrt(4 - c);
	}

	if(c === 0){
	    c1 = function(x){
		return [x, x];
	    };
	    c2 = function(x){
		return [x, -x];
	    };
	    a = 2;
	}
	paramsurface.addCurveTo(group, material, c1, -a, a);
	paramsurface.addCurveTo(group, material, c2, -a, a);
	return group;
    }
    
    // Now setup and connect the sliders to the slices.
    
    var xslice = new QuadricSlice(container, scene, "x", -2,
				 -2, 2, -2.5, 2.5, -4.5, 4.5, graphXSlice);
    var yslice = new QuadricSlice(container, scene, "y", -2,
				 -2, 2, -2.5, 2.5, -4.5, 4.5,  graphYSlice);

    var zslice = new QuadricSlice(container, scene, "z", -1, 
				 -3.95, 3.95, -2.5, 2.5, -2.5, 2.5,
				  zSlice);

    drawSurface();
    values.animate();

    function setCamera(){
	var s = 0.95;
	camera.position.set(s*9.4, -s*14.1, s*5.8);
	camera.up = new THREE.Vector3(0,0,1);
    }

    function drawSurface()
    {
	scene.remove(surface);
	var gridmat = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
	surface = paramsurface.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 6, 6);
    }

}()); // call anonymous function. 
