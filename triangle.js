'use strict';

var r;
var g;
var b;
var framesColor;
var framesPos;
var offsetX;
var offsetY;
var increaseX;
var increaseY;

async function init() {

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
 
 framesColor = 0;
 framesPos = 0;

 offsetX = 0;
 offsetY = 0;
 increaseX = true;
 increaseY = false;


  function loop(){
    framesColor++;
    framesPos++;
    calculateColor();
    calculateNewPost();

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


    requestAnimationFrame(loop); //ruft function "loop" beim neuen Frame auf
  }
  requestAnimationFrame(loop); //startet erstmals die "loop" funktion

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
 
  // Location der Farbe im Shader (Pointer auf "color") holen und auf 'r, g, b' setzen
  let location = gl.getUniformLocation(program, 'color');
  gl.uniform3f(location, r, g, b);

  let offset = gl.getUniformLocation(program, 'offset');
  gl.uniform2f(offset, offsetX, offsetY);
 
  // Dreieck mit den drei angegebenen Punkten zeichnen
  gl.drawArrays(gl.TRIANGLES, 0, 3);


}


//berechnet rgb werte aus einem hexadezimalcode
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// steigert die rgb werte sequenziell und setzt diese bei 1 zurueck
function calculateColor(){
  if(framesColor > 2){
    if(r <= 0.99){
      r = r + 0.01;
    } else r = 0;
    if(g <= 0.99){
      g = g + 0.01;
    } else g = 0;
    if(b <= 0.99){
      b = b + 0.01;
    } else b = 0;

    framesColor = 0;
  }
}

//
function calculateNewPost(){
  
  if(framesPos > 2){
    if(increaseX){
      offsetX = offsetX+0.01;
    } else offsetX = offsetX-0.01;
    if(increaseY){
      offsetY = offsetY+0.01;
    } else offsetY = offsetY-0.01;
    if(offsetX>0.15){
      increaseX=false;
    }
    if(offsetY>0.15){
      increaseY=false;
    }
    if(offsetX<-0.15){
      increaseX=true;
    }
    if(offsetY<-0.15){
      increaseY=true;
    }
    framesPos = 0;
  }
}



window.onload = init;