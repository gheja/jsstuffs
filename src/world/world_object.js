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
	WorldObject.call(this, [ ], body_register_function);
}
