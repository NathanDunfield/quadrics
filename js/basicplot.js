/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    var gui, scene;
    var parameters;
    var plotsurface;
    var edges;
    var slider;
    var sliderLabel;
    
    init();

    function f(x,y){
	return 1*x*x - 1*y*y;
    }
    
    function init()
    {
	var values = setup3DScene("basicplot");
	scene = values.scene;


	fancyLighting(scene);

	var ticks = [-1, 0, 1];
	var zticks = [-3, -2, -1, 0, 1, 2, 3];
	scene.add(axes(1.5, ticks, 1.5, ticks, 3.5,  zticks, 0.1, 0.3, 0.6));
	drawPlotSurface();
	values.animate();
    }


    function updatePlot()
    {
	scene.remove(plotsurface);
	drawPlotSurface();
    }
    
    function drawPlotSurface()
    {
	var geometry = new THREE.Geometry();
	
	var n = 20;
	var x, y;
	for(var i = 0; i <= n; i++){
	    for(var j = 0; j <= n; j++){
		x = -1 + i*(2.0/n);
		y = -1 + j*(2.0/n);
		geometry.vertices.push(new THREE.Vector3(x, y, f(x, y)));
	    }
	}
	for(var i = 0; i < n; i++){
	    for(var j = 0; j < n; j++){
		k = (n + 1)*j + i;
		geometry.faces.push(new THREE.Face3(k, k+1, k + n + 2));
		geometry.faces.push(new THREE.Face3(k, k + n + 2, k + n + 1));
	    }
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	var material = new THREE.MeshLambertMaterial({color: 0xEEEEEE, side: THREE.DoubleSide});
	plotsurface = new THREE.Mesh(geometry, material);
	scene.add(plotsurface);
	
	var m = 6;
	material = new THREE.LineBasicMaterial({color:0x444444, linewidth: 2});
	for(i = 0; i <=m; i++){
	    geometry = new THREE.Geometry();
	    for(j = 0; j <= n; j++){
		x = -1 + i*(2.0/m);
		y = -1 + j*(2.0/n);
		geometry.vertices.push(new THREE.Vector3(x, y, f(x,y) + 0.01));
	    }
	    scene.add(new THREE.Line(geometry, material));
	}

	for(i = 0; i <=m; i++){
	    geometry = new THREE.Geometry();
	    for(j = 0; j <= n; j++){
		y = -1 + i*(2.0/m);
		x = -1 + j*(2.0/n);
		geometry.vertices.push(new THREE.Vector3(x, y, f(x,y) + 0.01));
	    }
	    scene.add(new THREE.Line(geometry, material));
	}
    }

}()); // calling anonymous function. 
