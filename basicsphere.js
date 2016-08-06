// Basic sphere, can change the radius and rotate.  

// Key example: http://threejs.org/docs/scenes/geometry-browser.html

// standard globals
var container, scene, camera, renderer, controls;

// custom globals

var parameters;
var gui;
var sphere;

init();
animate();

function init()
{
    gui = new dat.GUI();
    parameters = {radius:2.0};
    gui.add(parameters, 'radius', 1, 3, 0.1).onFinishChange(updateSphere);
    
    scene = new THREE.Scene();

    // setup camera
    var SCREEN_WIDTH = 800, SCREEN_HEIGHT = 600;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    scene.add(camera);
    camera.position.set(0, -10, 10);
    camera.lookAt(scene.position);

    // create and start the renderer; choose antialias setting.
    if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xffffff);
    
    container = document.getElementById( 'basicsphere' );
    container.appendChild(gui.domElement);
    container.appendChild(renderer.domElement);



    // move mouse and: left   click to rotate, 
    //                 middle click to zoom, 
    //                 right  click to pan
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.enableZoom = false;

    // create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,0,20);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x777777);
    scene.add(ambientLight);

    var ticks = [-2, 0, 2];
    scene.add(axes(3, ticks, 3, ticks, 3, ticks, 0.2, 0.4, 0.8));
    drawSphere();
}

function animate() 
{
    requestAnimationFrame( animate );
    render();
    controls.update();
}

function render() 
{	
    renderer.render( scene, camera );
}

function updateSphere()
{
    scene.remove(sphere);
    drawSphere();
}

function drawSphere()
{
    
    // Sphere parameters: radius, segments along width, segments along height
    var sphereGeometry = new THREE.SphereGeometry( parameters.radius, 32, 16 ); 
    // use a "lambert" material rather than "basic" for realistic lighting.
    //   (don't forget to add (at least one) light!)
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff});
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
}


function axes(xmax, xticks, ymax, yticks, zmax, zticks, tickLen, tickLabelSep, axisLabelSep)
{
    /*
      Draw 3-d axes on three sides of a rectangular box centered about
      the origin, namely:

           [-xmax, xmax] x [-ymax, ymax] x [-zmax, zmax]

      with the given ticks.
    */
    
    var ans = new THREE.Group();

    var xaxis = oneAxis(xmax, "x", xticks, tickLen, tickLabelSep, axisLabelSep);
    xaxis.rotateX(5*Math.PI/4);
    xaxis.position.y += -3;
    xaxis.position.z += -3;
    ans.add(xaxis);

    var yaxis = oneAxis(ymax, "y", yticks, tickLen, tickLabelSep, axisLabelSep);
    yaxis.rotateZ(Math.PI/2);
    yaxis.rotateX(Math.PI/4);
    yaxis.position.x += -3;
    yaxis.position.z += 3;
    ans.add(yaxis);

    var zaxis = oneAxis(zmax, "z", zticks, tickLen, tickLabelSep, axisLabelSep);
    zaxis.rotateY(Math.PI/2);
    zaxis.rotateX(5*Math.PI/4);
    zaxis.position.x += -3;
    zaxis.position.y += -3;
    ans.add(zaxis);

    return ans;
}

function oneAxis(axisMax, axisName, ticks, tickLen, tickLableSep, axisLabelSep)
{
    // Build this along the x-axis, caller can then move into place. 
    var ans = new THREE.Group();
    var material = new THREE.LineBasicMaterial({color: 'black', linewidth: 3});
    var axisGeometry = new THREE.Geometry();
    var a = new THREE.Vector3(-axisMax, 0, 0);
    var b = new THREE.Vector3(axisMax, 0, 0);
    axisGeometry.vertices.push(a);
    axisGeometry.vertices.push(b);
    var line = new THREE.Line(axisGeometry, material);
    ans.add(line);
    
    for (var i = 0; i < ticks.length; i++){
	var tickGeometry = new THREE.Geometry();
	var u = new THREE.Vector3(ticks[i], 0, 0);
	var v = new THREE.Vector3(ticks[i], -tickLen, 0);
	tickGeometry.vertices.push(u);
	tickGeometry.vertices.push(v);
	var tick = new THREE.Line(tickGeometry, material);
	ans.add(tick);

	var label = makeTextSprite(ticks[i], {fontsize:18});
	label.position.set(ticks[i], tickLableSep, 0);
	ans.add(label);
    }

    var name = makeTextSprite(axisName, {fontsize:24, fontstyle:"italic"});
    name.position.set(0, axisLabelSep, 0);
    ans.add(name);
    return ans;
}
