/* Wrapped in an anonymous function call so all variables are local to this file. */
(function () {
    
    var scene, camera, animate, parameters;

    values = setup3DScene("slicedsphere");
    scene = values.scene;
    camera = values.camera;
    animate = values.animate;
    // basicLighting(scene);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));

    var xslice = new QuadricSlice("slicedsphere", scene, "x", 1, 3, 3, 3, drawSlice);
    var yslice = new QuadricSlice("slicedsphere", scene, "y", 1.4, 3, 3, 3, drawSlice);
    var zslice = new QuadricSlice("slicedsphere", scene, "z", -1.2, 3, 3, 3, drawSlice);

    drawSphere();
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
