// thx http://graphics.cs.wisc.edu/Courses/Games11/WebGLTest/first.htm

DisplayWebgl = function(parameters)
{
	this.canvas = null;
	this.gl = null;
	this.objects = [];
	
	this.createShader = function(text, is_fragment_shader)
	{
		var shader;
		
		shader = this.gl.createShader(is_fragment_shader ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER);
		
		this.gl.shaderSource(shader, text);
		this.gl.compileShader(shader);
		
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
		{
			console.log("WebGL compileShader() failed");
			return null;
		}
		
		return shader;
	}
	
	this.createShaderProgram = function(vertex_shader, fragment_shader)
	{
		var s;
		
		s = this.gl.createProgram();
		this.gl.attachShader(s, this.createShader(vertex_shader, 0));
		this.gl.attachShader(s, this.createShader(fragment_shader, 1));
		this.gl.linkProgram(s);
		
		if (!this.gl.getProgramParameter(s, this.gl.LINK_STATUS))
		{
			console.log("WebGL linkProgram() failed");
			return null;
		}
		
		return s;
	}
	
	this.createObject = function(vertex_positions, vertex_colors)
	{
		var position_buffer, color_buffer;
		
		position_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertex_positions), this.gl.STATIC_DRAW);
		position_buffer.itemSize = 3;
		position_buffer.numItems = vertex_positions.length / 3;
		
		color_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertex_colors), this.gl.STATIC_DRAW);
		color_buffer.itemSize = 4;
		color_buffer.numItems = vertex_colors.length / 4;
		
		return {
			positions: position_buffer,
			colors: color_buffer,
			shader_program: this.default_shader_program
		}
	}
	
	this.renderObjects = function()
	{
		var i, o;
		
		for (i=0; i<this.objects.length; i++)
		{
			o = this.objects[i];
			
			this.gl.useProgram(o.shader_program);
			
			o.shader_program.vertexPositionAttribute = this.gl.getAttribLocation(o.shader_program, "aVertexPosition");
			this.gl.enableVertexAttribArray(o.shader_program.vertexPositionAttribute);
			
			o.shader_program.vertexColorAttribute = this.gl.getAttribLocation(o.shader_program, "aVertexColor");
			this.gl.enableVertexAttribArray(o.shader_program.vertexColorAttribute);
			
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.positions);
			this.gl.vertexAttribPointer(o.shader_program.vertexPositionAttribute, o.positions.itemSize, this.gl.FLOAT, false, 0, 0);
			
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.colors);
			this.gl.vertexAttribPointer(o.shader_program.vertexColorAttribute, o.colors.itemSize, this.gl.FLOAT, false, 0, 0);
			
			this.gl.drawArrays(this.gl.TRIANGLES, 0, o.positions.numItems);
		}
	}
	
	this.drawScene = function()
	{
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		this.renderObjects();
	}
	
	// initialization
	this.parameters = parameters;
	this.canvas = document.getElementById(parameters.canvas_name);
	
	this.gl = this.canvas.getContext("experimental-webgl");
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	
	this.default_shader_program = this.createShaderProgram(parameters.vertex_shaders[0], parameters.fragment_shaders[0]);
	
	// test data
	this.objects.push(this.createObject([
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		-0.5, -1.0,  0.0
	],
	[
		0.0, 0.6, 0.0, 1.0,
		0.0, 0.5, 0.8, 1.0,
		0.5, 1.0, 1.0, 1.0
	]));
}
