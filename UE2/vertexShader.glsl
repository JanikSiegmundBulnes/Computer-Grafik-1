// Setzt die Genauigkeit für Gleitkommazahlen auf mittlere Präzision (spart Leistung)
precision mediump float;

// Attribute sind Eingabewerte für den Vertex Shader (pro Vertex).
// vertPosition: Die Position des aktuellen Vertex (x, y).
attribute vec2 vertPosition;

// uniform ist ein globaler Wert, der für alle Vertices gleich bleibt.
// color: Die Farbe, die vom JavaScript-Programm gesetzt wird.
uniform vec3 color;

// varying gibt Werte an den Fragment Shader weiter.
// fragColor: Speichert die Farbe, die später von den Pixeln verwendet wird.
varying vec3 fragColor;

uniform vec2 offset;

void main() {
    // Weist der Farbe des Fragments den Wert aus 'color' zu.
    // Dadurch werden alle Dreiecke in der gleichen Farbe gerendert.
    fragColor = color;

    // Setzt die endgültige Position des Vertex.
    // WebGL erwartet einen 4D-Vektor (vec4), deshalb:
    // - x und y kommen von vertPosition (übergeben aus JavaScript)
    // - z wird auf 0.0 gesetzt, da wir in 2D arbeiten
    // - w ist 1.0, um eine korrekte Skalierung zu ermöglichen
    gl_Position = vec4(vertPosition + offset, 0.0, 1.0);
}
