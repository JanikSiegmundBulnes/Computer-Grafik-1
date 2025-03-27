'use strict';

var r;
var g;
var b;
var frames;

async function init() {
 console.log('Hallo');

 // "canvas" Element aus der HTML holen
 let canvas = document.getElementById('cg1-canvas');
 let gl = canvas.getContext('webgl');
 if(!gl) {
    console.error('webgl not supported');
 }

 // Vertex Shader code aus externer Datei laden
  // Vertex Shader fuer Berechnung der Position eines Punktes verantwortlich
 let vertexTextResponse = await fetch('./vertexShader.glsl');
 let vertexText = await vertexTextResponse.text();

 let vertexShader = gl.createShader(gl.VERTEX_SHADER); // Vertex Shader erstellen
 gl.shaderSource(vertexShader, vertexText); // Shader Code in WebGL laden
 gl.compileShader(vertexShader); // Shader kompilieren
 if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){ // pruefen ob Fehler beim kompilieren
   console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertexShader));
 }

 // Fragment Shader code aus externer Datei laden
  // Fragment Shader fuer Berechnung der Farbe eines Pixels verantwortlich
 let fragmentTextResponse = await fetch('./fragmentShader.glsl');
 let fragmentText = await fragmentTextResponse.text();

 let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // Fragment Shader erstellen
 gl.shaderSource(fragmentShader, fragmentText); // Shader Code in WebGL laden
 gl.compileShader(fragmentShader); // Shader kompilieren
 if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){ // pruefen ob Fehler beim kompilieren
   console.error('Error compiling vertex shader', gl.getShaderInfoLog(fragmentShader));
 }

 // Shader Programm erstellen
 let program = gl.createProgram(); // Shader Programm erstellen
 gl.attachShader(program, vertexShader); // vertex Shader an Programm knuepfen
 gl.attachShader(program, fragmentShader); // fragment Shader an Programm knuepfen
 gl.linkProgram(program); // vertex und fragment Shader verbinden
 //pruefen ob Programm gueltig ist
 if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
   console.error('Error linking program', gl.getProgramInfoLog(program));
 }
 gl.validateProgram(program);
 if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
   console.error('Error validating program', gl.getProgramInfoLog(program));
 }
 let hex = '#dc3c05';
 r = hexToRgb(hex).r/255;
 g = hexToRgb(hex).g/255;
 b = hexToRgb(hex).b/255;
 
 frames = 0;
 

  function loop(){
    frames++;
    calculateColor(frames);

    //Hintergrund festlegen
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); // Framebuffer loeschen und Hintergrund faerben

    //Shader Programm an WebGL zuweisen, um zu nutzen
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

  // drei Eckpunkte eines Dreiecks
  let triangleVertices = 
  [ //X  Y
    x1, y1,
    x2, y2,
    x3, y3
  ];

  // Buffer (GPU Speicher) fuer die Dreiecksdaten erstellen
  let triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); // Buffer an GPU Speicher  binden
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); //Koordinaten des Dreiecks in Buffer schreiben
  gl.bindBuffer(gl.ARRAY_BUFFER, null); 

 
  // Buffer erneut binden, um Daten zu nutzen
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);

  // Position des Attributs "vertPosition" aus Shader holen
  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');


  // WebGL angeben, wie die Vertex-Daten im Buffer gespeichert sind
  gl.vertexAttribPointer(
    positionAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(positionAttribLocation); //Attribut 'vertPosition' aktivieren
 
  // Location der Farbe im Shader holen und auf 'r, g, b' setzen
  let location = gl.getUniformLocation(program, 'color');
  gl.uniform3f(location, r, g, b);
 
  // Dreieck mit den drei angegebenen Punkten zeichnen
  gl.drawArrays(gl.TRIANGLES, 0, 3);


}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function calculateColor(){
  if(frames > 2){
    if(r <= 0.9){
      r = r + 0.01;
    } else r = 0;
    if(g <= 0.9){
      g = g + 0.01;
    } else g = 0;
    if(b <= 0.9){
      b = b + 0.01;
    } else b = 0;

    frames = 0;
  }
}

window.onload = init;