'use strict';

async function init() {
 console.log('Hallo');
 let canvas = document.getElementById('cg1-canvas');
 let gl = canvas.getContext('webgl');
 if(!gl) {
    console.error('webgl not supported');
 }

 // create shader program
 let vertexTextResponse = await fetch('./vertexShader.glsl');
 let vertexText = await vertexTextResponse.text();

 let vertexShader = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vertexShader, vertexText);
 gl.compileShader(vertexShader);
 if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
   console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertexShader));
 }

 let fragmentTextResponse = await fetch('./fragmentShader.glsl');
 let fragmentText = await fragmentTextResponse.text();

 let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fragmentShader, fragmentText);
 gl.compileShader(fragmentShader);
 if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
   console.error('Error compiling vertex shader', gl.getShaderInfoLog(fragmentShader));
 }

 let program = gl.createProgram();
 gl.attachShader(program, vertexShader);
 gl.attachShader(program, fragmentShader);
 gl.linkProgram(program);
 if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
   console.error('Error linking program', gl.getProgramInfoLog(program));
 }
 gl.validateProgram(program);
 if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
   console.error('Error validating program', gl.getProgramInfoLog(program));
 }

 // create triangle buffer
 let triangleVertices = 
 [ //X  Y     R    G    B
   0.0, 0.5, 1.0, 1.0, 0.0,
   -0.5, -0.5, 0.7, 0.0, 1.0,
   0.5, -0.5, 0.2, 0.0, 0.6
 ];
 let triangleVertexBufferObject = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
 gl.bindBuffer(gl.ARRAY_BUFFER, null);

 gl.clearColor(0.75, 0.85, 0.8, 1.0);

 // draw
 gl.clear(gl.COLOR_BUFFER_BIT);
 gl.useProgram(program);
 gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
 let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
 gl.vertexAttribPointer(
   positionAttribLocation,
   2,
   gl.FLOAT,
   gl.FALSE,
   5 * Float32Array.BYTES_PER_ELEMENT,
   0 * Float32Array.BYTES_PER_ELEMENT
 );
 gl.enableVertexAttribArray(positionAttribLocation);

 let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
 gl.vertexAttribPointer(
   colorAttribLocation,
   3,
   gl.FLOAT,
   gl.FALSE,
   5 * Float32Array.BYTES_PER_ELEMENT,
   2 * Float32Array.BYTES_PER_ELEMENT
 );
 gl.enableVertexAttribArray(colorAttribLocation);

 gl.drawArrays(gl.TRIANGLES, 0, 3);

}

window.onload = init;