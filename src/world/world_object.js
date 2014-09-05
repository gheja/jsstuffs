WorldObject = function(recipe, body_register_function)
{
	this.bodies = [];
	
	var generator = new BodyGenerator();
	this.bodies = generator.generate(recipe, body_register_function);
	
	this.getNewInstance = function()
	{
		return {
			position: new Position(),
			visible: true,
			bodies: this.bodies
		};
	}
}

WorldObjectPointer = function(body_register_function)
{
/*
	creating this object runs the following calls of BodyGenerator:
		clear(8);
		close(0.5);
		makeSlice(0.6, 1.0);
		makeSlice(1.0, 1.0);
		makeSlice(1.6, 0.4);
		makeSlice(1.6, 0.3);
		makeSlice(1.2, 0.2);
		makeSlice(0.5, 0.1);
		close();
		(and adds it to the final object)
*/

	WorldObject.call(this, [
		1,
		5,8,8,
		3,5,
		2,6,10,
		2,10,10,
		2,16,4,
		2,16,3,
		2,12,2,
		2,5,1,
		3,0,
		4,0
	], body_register_function);
}
