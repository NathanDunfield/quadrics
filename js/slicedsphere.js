/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, paramsurface, values;

    container = document.getElementById("slicedsphere");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    camera.position.set(0, -11, 11);
    camera.up = new THREE.Vector3(0,0,1);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, -3, 3, ticks,
		   {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8, fontsize: 24, linewidth: 1}));

    var xslice = new QuadricSlice(container, scene, "x", 1,
				 -3, 3, -3, 3, -3, 3, slice);
    var yslice = new QuadricSlice(container, scene, "y", 1.4,
				  -3, 3, -3, 3, -3, 3, slice);
    var zslice = new QuadricSlice(container, scene, "z", -1.2,
				  -3, 3, -3, 3, -3, 3, slice);

    drawSphere();
    values.animate();


    function slice(c, color)
    {
	var geometry = circleGeometry(Math.sqrt(4 - c*c), 40);
	var material = new THREE.LineBasicMaterial({color:color, linewidth:4});
	var ans = new THREE.Line(geometry, material);
	this.placeGroup(ans);
	return ans;
    }

    function drawSphere()
    {
	var phi = function(s, t){
	    var x = 2 * Math.sin(s) * Math.cos(t);
	    var y = 2 * Math.sin(s) * Math.sin(t);
	    var z = 2 * Math.cos(s);
	    return new THREE.Vector3(x, y, z);
	};

	var normal = function(s, t){
	    var x = Math.sin(s) * Math.cos(t);
	    var y = Math.sin(s) * Math.sin(t);
	    var z = Math.cos(s);
	    return new THREE.Vector3(x, y, z);
	};

	paramsurface = new ParametricSurface(phi, normal, 0, Math.PI, 0, 2*Math.PI, 50);
	var material = new THREE.LineBasicMaterial({color:0x888888, linewidth:1.5});
	paramsurface.addTo(scene, null, material, true, 16, 10);
    }

}()); // call anonymous function. 
