/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var gui, scene, camera, animate, parameters;

    values = setup3DScene("slicedsphere");
    gui = values.gui;
    scene = values.scene;
    camera = values.camera;
    animate = values.animate;
    // basicLighting(scene);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));

    var xslice = new QuadricSlice(scene, "x", 1, 3, 3, 0xE87722);
    var yslice = new QuadricSlice(scene, "y", 1, 3, 3, 0x606EB2);
    var zslice = new QuadricSlice(scene, "z", 1, 3, 3, 0x002058);
    
    parameters = {"x":1.0, "y":1.0, "z":1.0};
    var xcontroller = gui.add(parameters, "x", -3.0, 3.0, 0.1);
    var ycontroller = gui.add(parameters, "y", -3.0, 3.0, 0.1);
    var zcontroller = gui.add(parameters, "z", -3.0, 3.0, 0.1);
    addCallbacks(xslice, xcontroller);
    addCallbacks(yslice, ycontroller);
    addCallbacks(zslice, zcontroller);

    xslice.drawSlice = drawSlice;
    yslice.drawSlice = drawSlice;
    zslice.drawSlice = drawSlice;

    drawSphere();
    xslice.drawSlice();
    yslice.drawSlice();
    zslice.drawSlice();

    animate();


    function drawSlice()
    {
	var geometry = circleGeometry(Math.sqrt(4 - this.c*this.c), 40);
	var material = new THREE.LineBasicMaterial({color:this.color, linewidth:4});
	this.slice = new THREE.Line(geometry, material);
	this.placeGroup(this.slice);
	this.scene.add(this.slice);
    };

    function drawSphere()
    {
	// Sphere parameters: radius, segments along width, segments along height
	var geometry = new THREE.SphereGeometry(2, 16, 12);
	geometry.rotateX(Math.PI/2);
	// use a "lambert" material rather than "basic" for realistic lighting.
	var material = new THREE.MeshLambertMaterial({color: 0x8888ff});
	sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(0, 0, 0);
	edges = new THREE.EdgesHelper(sphere, 0x888888);
	edges.material.linewidth=2;
	scene.add(edges);
    }

}()); // call anonymous function. 
