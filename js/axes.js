function axes(xmax, xticks, ymax, yticks, zmin, zmax, zticks, opts)
{
    /*
       Draw 3-d axes on three sides of a rectangular box centered about
       the origin, namely:

           [-xmax, xmax] x [-ymax, ymax] x [zmin, zmax]

       with the given ticks.
     */
    

    if (typeof opts === 'undefined') {opts = {};}
    opts.tickLen = opts.tickLen || 0.12;
    opts.tickLabelSep = opts.tickLabelSep || 0.25;
    opts.axisLabelSep = opts.axisLabelSep || 0.7;
    opts.linewidth = opts.linewidth || 0.5;
    opts.fontsize = opts.fontsize || 20;
    
    var ans = new THREE.Group();

    var xaxis = oneAxis(-xmax, xmax, "x", xticks, opts);
    xaxis.rotateX(5*Math.PI/4);
    xaxis.position.y += -ymax;
    xaxis.position.z += zmin;
    ans.add(xaxis);

    var yaxis = oneAxis(-ymax, ymax, "y", yticks, opts);
    yaxis.rotateZ(Math.PI/2);
    yaxis.rotateX(Math.PI/4);
    yaxis.position.x += -xmax;
    yaxis.position.z += zmax;
    ans.add(yaxis);

    var zaxis = oneAxis(zmin, zmax, "z", zticks, opts);
    zaxis.rotateY(-Math.PI/2);
    zaxis.rotateX(3*Math.PI/4);
    zaxis.position.x += -xmax;
    zaxis.position.y += -ymax;
    ans.add(zaxis);

    return ans;
}

function oneAxis(axisMin, axisMax, axisName, ticks, opts)
{
    // Build this along the x-axis, caller can then move into place. 
    var ans = new THREE.Group();
    var material = new THREE.LineBasicMaterial({color: 'black', linewidth: opts.linewidth});
    var axisGeometry = new THREE.Geometry();
    var a = new THREE.Vector3(axisMin, 0, 0);
    var b = new THREE.Vector3(axisMax, 0, 0);
    axisGeometry.vertices.push(a);
    axisGeometry.vertices.push(b);
    var line = new THREE.Line(axisGeometry, material);
    ans.add(line);
    
    for (var i = 0; i < ticks.length; i++){
	var tickGeometry = new THREE.Geometry();
	var u = new THREE.Vector3(ticks[i], 0, 0);
	var v = new THREE.Vector3(ticks[i], -opts.tickLen, 0);
	tickGeometry.vertices.push(u);
	tickGeometry.vertices.push(v);
	var tick = new THREE.Line(tickGeometry, material);
	ans.add(tick);

	var label = makeTextSprite(ticks[i], {fontsize:0.75*opts.fontsize});
	label.position.set(ticks[i], opts.tickLabelSep, 0);
	ans.add(label);
    }

    var name = makeTextSprite(axisName, {fontsize:opts.fontsize, fontstyle:"italic"});
    name.position.set(0, opts.axisLabelSep, 0);
    ans.add(name);
    return ans;
}

function makeTextSprite(message, opts) {
    var parameters = opts || {};
    var fontsize = parameters.fontsize || 24;
    var fontstyle = parameters.fontstyle || "";
    var canvas = document.createElement('canvas');
    canvas.width = 200; 
    canvas.height = 100;
    var context = canvas.getContext('2d');
    context.font = fontstyle + " " + fontsize + "px Times";
    context.textBaseline = "alphabetic"; 
    context.textAlign = "left";
    
    // get size data (height depends only on font size)
    var metrics = context.measureText(message);
    var textWidth = metrics.width;
    context.textBaseline = "alphabetic"; 
    context.textAlign = "left";

    var cx = canvas.width / 2;
    var cy = canvas.height / 2; 
    var tx = textWidth/ 2.0;
    var ty = fontsize / 2.0; 

    // text color
    context.fillStyle = "black";

    // write text 
    context.fillText(message, cx - tx, cy + ty);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
	map: texture,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4.0, 2.0, 1.0);
    return sprite;
}
