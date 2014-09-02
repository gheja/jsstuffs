var _a = 0;
var _gl1 = null;
var _camera = null;
var _objects = [];
var _object_factory = null;
var _obj1 = null;
var _obj2 = null;
var _obj3 = null;

/** @const */ var _POINTER_ID = 1;

function webgl_render()
{
	_a += 1;
	
	_camera.position.x = Math.sin(_a / 200) * 10 + 5;
	_camera.position.y = Math.cos(_a / 200) * 10;
	_camera.position.z = 5;
	
	_obj1.position.rot_z -= 0.5;
	
	_obj3.position.rot_y += 1;
	_obj3.position.rot_x += 0.5;
	
	_gl1.drawScene();
}

function webgl_init()
{
	_gl1 = new DisplayWebgl({
		canvas_name: "canvas6",
		clear_color: [ 10/255, 60/255, 180/255 ]
	});
	
	_camera = _gl1.getCamera();
	
	_camera.position.x = 5;
	_camera.position.y = 10;
	_camera.position.z = 2;
	
	_camera.target.x = 5;
	_camera.target.y = 0;
	_camera.target.z = 1.5;
	
	window.setInterval(webgl_render, 1000 / 60);
}

function webgl_bind_objects()
{
	_gl1.setRenderableObjects(_objects);
}

function objects_init()
{
	_object_factory = new ObjectFactory([ _POINTER_ID ], [ WorldObjectPointer ], _gl1.createBody.bind(_gl1));
}

function objects_create()
{
	_obj1 = _object_factory.getNewClassInstance(_POINTER_ID);
	
	_obj2 = _object_factory.getNewClassInstance(_POINTER_ID);
	_obj2.position.x = 5;
	_obj2.position.y = 0;
	
	_obj3 = _object_factory.getNewClassInstance(_POINTER_ID);
	_obj3.position.x = 10;
	_obj3.position.y = 0;
	
	_objects.push(_obj1, _obj2, _obj3);
}

function init()
{
	webgl_init();
	objects_init();
	objects_create();
	webgl_bind_objects();
	webgl_render();
}

window.onload = init;
