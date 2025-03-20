precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform vec3 color;

void main() {
    fragColor = color;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}