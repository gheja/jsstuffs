var _gl1 = null;
var _vertex_shaders = [
	"attribute vec3 aVertexPosition; void main(void) { gl_Position = vec4(aVertexPosition, 1.0); }"
];
var _fragment_shaders = [
	"void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }"
];

function init()
{
	_gl1 = new DisplayWebgl({
		canvas_name: "canvas1",
		vertex_shaders: _vertex_shaders,
		fragment_shaders: _fragment_shaders
	});
	
	_gl1.drawScene();
}

window.onload = init;
