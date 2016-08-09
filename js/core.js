
function setup3DScene(name){
    var canvas, scene, camera, renderer, controls, gui;
    canvas = document.getElementById(name);
    gui = new dat.GUI({autoPlace:false});
    document.getElementById(name + "controls").appendChild(gui.domElement);
    scene = new THREE.Scene();

    // setup camera
    var SCREEN_WIDTH = canvas.clientWidth;
    var SCREEN_HEIGHT = canvas.clientHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    scene.add(camera);
    camera.position.set(0, -10, 10);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer( {canvas:canvas, antialias:true} );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xffffff);
    
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    return {scene:scene, gui:gui, renderer:renderer};
}
