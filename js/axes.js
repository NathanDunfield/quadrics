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
    zaxis.rotateY(-Math.PI/2);
    zaxis.rotateX(3*Math.PI/4);
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
    var texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
	map: texture,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4.0, 2.0, 1.0);
    return sprite;
}
