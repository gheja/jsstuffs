var _gl1 = null;
var _vertex_shaders = [
	"attribute vec3 aVertexPosition;\n" +
	"attribute vec4 aVertexColor;\n" +
	"uniform mat4 aModelViewProjectionMatrix;\n" +
	"varying vec4 vColor;\n" +
	"void main(void) {\n" +
	"	gl_Position = aModelViewProjectionMatrix * vec4(aVertexPosition, 1.0);\n" +
	"	vColor = aVertexColor;\n" +
	"}"
];
var _fragment_shaders = [
	"precision mediump float;\n" +
	"varying vec4 vColor;\n" +
	"void main(void) {\n" +
	"	gl_FragColor = vColor;\n" +
	"}\n"
];

function init()
{
	_gl1 = new DisplayWebgl({
		canvas_name: "canvas1",
		vertex_shaders: _vertex_shaders,
		fragment_shaders: _fragment_shaders
	});
	
	_gl1.storeObject(_gl1.createObject([
		0, 1, 0, -1, 0, -1,  1, 0, -1,
		0, 1, 0,  1, 0, -1,  1, 0,  1,
		0, 1, 0,  1, 0,  1, -1, 0,  1,
		0, 1, 0, -1, 0,  1, -1, 0, -1
	],
	[
		0.0, 0.6, 0.0, 1.0,
		0.0, 0.5, 0.8, 1.0,
		0.5, 1.0, 1.0, 1.0,
		
		0.0, 0.6, 0.0, 1.0,
		0.0, 0.5, 0.8, 1.0,
		0.5, 1.0, 1.0, 1.0,
		
		0.0, 0.6, 0.0, 1.0,
		0.0, 0.5, 0.8, 1.0,
		0.5, 1.0, 1.0, 1.0,
		
		0.0, 0.6, 0.0, 1.0,
		0.0, 0.5, 0.8, 1.0,
		0.5, 1.0, 1.0, 1.0
	]));
	
	window.setInterval(render, 1000 / 60);
}

function render()
{
	_gl1.drawScene();
}

window.onload = init;
