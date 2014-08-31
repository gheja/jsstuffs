var _gl1 = null;
var _camera = null;
var _a = 0;
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
var _objects = [];

function init()
{
	var id;
	
	_gl1 = new DisplayWebgl({
		canvas_name: "canvas1",
		vertex_shaders: _vertex_shaders,
		fragment_shaders: _fragment_shaders,
		clear_color: [ 0.1, 0.2, 0.3 ]
	});
	
	_camera = _gl1.getCamera();
	
	id = _gl1.createBody([
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
	]);
	
	_objects.push({ position: { x: 0, y: 0, z: 0 }, visible: true, bodies: [ { display_body_id: id, bone_length: 0, rotation: { rot_a: 0, rot_b: 0, rot_c: 0 } } ] });
	
	_gl1.setRenderableObjects(_objects);
	
	window.setInterval(render, 1000 / 60);
}

function render()
{
	_a += 0.5;
	
	_camera.position.x = Math.sin(_a / 30) * 5;
	_camera.position.y = Math.sin(_a / 75 - 2) * 5 + 6;
	_camera.position.z = Math.cos(_a / 30) * 5;
	
	_gl1.drawScene();
}

window.onload = init;
