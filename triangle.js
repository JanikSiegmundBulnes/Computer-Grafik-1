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

  
 
  var r = 1.0;
  var g = 0.0;
  var b = 0.0;


  function loop(){
    
    r = Math.random();
    g = Math.random();
    b = Math.random();

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
 
    //Strich links
    createTriangle(gl, program, -0.5, 0.5, -0.5, -0.5, -0.4, -0.5, r, g, b); 
    createTriangle(gl, program, -0.5, 0.5, -0.4, 0.5, -0.4, -0.5, r, g, b);
    //Strich rechts
    createTriangle(gl, program, -0.1, 0.5, -0.1, -0.5, 0, -0.5, r, g, b); 
    createTriangle(gl, program, -0.1, 0.5, 0, 0.5, 0, -0.5, r, g, b);
    //Strich mitte
    createTriangle(gl, program, -0.5, 0.1, -0.5, 0, 0, 0.1, r, g, b);
    createTriangle(gl, program, -0.5, 0, 0, 0.1, 0, 0, r ,g, b);
    //Strich unten
    createTriangle(gl, program, -0.5, -0.7, -0.5, -0.6, 0, -0.7, r, g, b);
    createTriangle(gl, program, -0.5, -0.6, 0, -0.7, 0, -0.6, r, g, b);


    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

}

function createTriangle(gl, program, x1, y1, x2, y2, x3, y3, r, g, b){

  let triangleVertices = 
  [ //X  Y
    x1, y1,
    x2, y2,
    x3, y3
  ];
  let triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

 
  // draw
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(positionAttribLocation);
 
  let location = gl.getUniformLocation(program, 'color');
  gl.uniform3f(location, r, g, b);
 
  gl.drawArrays(gl.TRIANGLES, 0, 3);


}


window.onload = init;