/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, container, values;
    var paramsurface0, surface;
    var basicGUI;

    container = document.getElementById("hyperfig");
    values = setup3DScene(container);
    scene = values.scene;
    camera = values.camera;
    
    setCamera();
    fancyLighting(scene);
    basicGUI = new BasicGUI(container, drawSurface, setCamera);


    // Axes
    var ticks = [-2, -1, 0, 1, 2];
    var zticks = [-3, -2, -1, 0, 1, 2, 3];
    var ax = axes(2.5, ticks, 2.5, ticks, -2.5, 2.5, ticks,
		  {tickLen: 0.2, tickLabelSep: 0.4, axisLabelSep: 0.8,
		   fontsize: 24, linewidth: 1});
    //scene.add(ax);


    // Create three parameterizations, to make computing slices trivial.

    // Here it is as a surface of rotation, which is the one we usually plot.
    
    var phi0 = function(s, t){
	var r = Math.sqrt(1 + s*s);
	var x = r * Math.cos(t);
	var y = r * Math.sin(t);
	return new THREE.Vector3(x, y, s);
    };

    var normal0 = function(s, t){
	var r = Math.sqrt(1 + s*s);
	var x = r * Math.cos(t);
	var y = r * Math.sin(t);
	var ans = new THREE.Vector3(x, y, -s);
	ans.normalize();
	return ans;
    };

    paramsurface0 = new ParametricSurface(phi0, normal0, -2, 2, 0, 2*Math.PI, 100);

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
	surface = paramsurface0.addTo(scene, basicGUI.material(), gridmat, basicGUI.checked(), 10, 6);
    }

}()); // call anonymous function. 
