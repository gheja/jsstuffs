// thx http://graphics.cs.wisc.edu/Courses/Games11/WebGLTest/first.htm
// thx https://github.com/evanw/lightgl.js

DisplayWebgl = function(parameters)
{
	this.canvas = null;
	this.gl = null;
	this.bodies = [];
	this.camera = {
		position: { x: 0, y: -1, z: -2 },
		target: { x: 0, y: 0, z: 0 }
	};
	this.objects_to_render = [];
	
	this.createShader = function(text, is_fragment_shader)
	{
		var shader;
		
		shader = this.gl.createShader(is_fragment_shader ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER);
		
		this.gl.shaderSource(shader, text);
		this.gl.compileShader(shader);
		
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
		{
			console.log("WebGL compileShader() failed: " + this.gl.getShaderInfoLog(shader));
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
		
		this.gl.useProgram(s);
		
		s.vertexPositionAttribute = this.gl.getAttribLocation(s, "aVertexPosition");
		this.gl.enableVertexAttribArray(s.vertexPositionAttribute);
		
		s.vertexColorAttribute = this.gl.getAttribLocation(s, "aVertexColor");
		this.gl.enableVertexAttribArray(s.vertexColorAttribute);
		
		s.vertexNormalAttribute = this.gl.getAttribLocation(s, "aVertexNormal");
		this.gl.enableVertexAttribArray(s.vertexNormalAttribute);
		
		s.modelViewProjectionMatrix = this.gl.getUniformLocation(s, "aModelViewProjectionMatrix");
		s.normalMatrix = this.gl.getUniformLocation(s, "aNormalMatrix");
		
		return s;
	}
	
	this.createBody = function(vertex_positions, vertex_colors)
	{
		var i, j, u, v, n, l, translated_vertex_positions, normals, position_buffer,  normal_buffer, color_buffer;
		
		// vertex Y and Z coordinates are swapped before rendering
		// this way the XY plane becomes the ground
		translated_vertex_positions = [];
		for (i=0; i<vertex_positions.length; i+=3)
		{
			translated_vertex_positions.push(vertex_positions[i], vertex_positions[i+2], vertex_positions[i+1]);
		}
		
		// calculate _face_ normals and attach them to the vertices
		// TODO: optimize this
		normals = [];
		for (i=0; i<translated_vertex_positions.length; i+=9)
		{
			u = [
				translated_vertex_positions[i+3+0] - translated_vertex_positions[i+0],
				translated_vertex_positions[i+3+1] - translated_vertex_positions[i+1],
				translated_vertex_positions[i+3+2] - translated_vertex_positions[i+2]
			];
			v = [
				translated_vertex_positions[i+6+0] - translated_vertex_positions[i+0],
				translated_vertex_positions[i+6+1] - translated_vertex_positions[i+1],
				translated_vertex_positions[i+6+2] - translated_vertex_positions[i+2]
			];
			n = [
				u[1] * v[2] - u[2] * v[1],
				u[2] * v[0] - u[0] * v[2],
				u[0] * v[1] - u[1] * v[0],
			];
			l = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);
			n[0] /= l;
			n[1] /= l;
			n[2] /= l;
			normals.push(
				n[0], n[1], n[2],
				n[0], n[1], n[2],
				n[0], n[1], n[2]
			);
		}
		
		position_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(translated_vertex_positions), this.gl.STATIC_DRAW);
		position_buffer.itemSize = 3;
		position_buffer.numItems = translated_vertex_positions.length / 3;
		
		normal_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normal_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
		normal_buffer.itemSize = 3;
		normal_buffer.numItems = normals.length / 3;
		
		color_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertex_colors), this.gl.STATIC_DRAW);
		color_buffer.itemSize = 4;
		color_buffer.numItems = vertex_colors.length / 4;
		
		this.bodies.push({
			positions: position_buffer,
			normals: normal_buffer,
			colors: color_buffer,
			shader_program: this.default_shader_program
		});
		
		return this.bodies.length - 1;
	}
	
	this.renderObjects = function(view, projection, objects)
	{
		var i, o, model, mvp, normal;
		
		for (i=0; i<objects.length; i++)
		{
			for (j=0; j<objects.length; j++)
			{
				if (!objects[i].visible)
				{
					continue;
				}
				
				o = this.bodies[objects[i].bodies[0].display_body_id];
				
				model = Matrix.identity();
				model = Matrix.multiply(model, Matrix.translate(objects[i].position.x, objects[i].position.z, objects[i].position.y));
				model = Matrix.multiply(model, Matrix.rotate(objects[i].position.rot_x, 1, 0, 0));
				model = Matrix.multiply(model, Matrix.rotate(objects[i].position.rot_y, 0, 0, 1));
				model = Matrix.multiply(model, Matrix.rotate(objects[i].position.rot_z, 0, 1, 0));
				
				mvp = Matrix.identity();
				mvp = Matrix.multiply(model, mvp);
				mvp = Matrix.multiply(view, mvp);
				mvp = Matrix.multiply(projection, mvp);
				
				normal = Matrix.identity();
				normal = Matrix.multiply(model, normal);
				normal = Matrix.multiply(view, normal);
				normal = Matrix.inverse(normal);
				
				// TODO: alter the matrix to be transposed by default
				mvp = Matrix.transpose(mvp);
				
				this.gl.useProgram(o.shader_program);
				
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.positions);
				this.gl.vertexAttribPointer(o.shader_program.vertexPositionAttribute, o.positions.itemSize, this.gl.FLOAT, false, 0, 0);
				
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.colors);
				this.gl.vertexAttribPointer(o.shader_program.vertexColorAttribute, o.colors.itemSize, this.gl.FLOAT, false, 0, 0);
				
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.normals);
				this.gl.vertexAttribPointer(o.shader_program.vertexNormalAttribute, o.normals.itemSize, this.gl.FLOAT, false, 0, 0);
				
				this.gl.uniformMatrix4fv(o.shader_program.modelViewProjectionMatrix, false, mvp.m);
				this.gl.uniformMatrix4fv(o.shader_program.normalMatrix, false, normal.m);
				
				this.gl.drawArrays(this.gl.TRIANGLES, 0, o.positions.numItems);
			}
		}
	}
	
	this.setRenderableObjects = function(objects)
	{
		this.objects_to_render = objects;
	}
	
	this.drawScene = function()
	{
		var projection, view, model, mvp;
		
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		// camera Y and Z coordinates are swapped before rendering
		// this way the XY plane becomes the ground
		projection = Matrix.perspective(45, 16/9, 0.1, 1000);
		view = Matrix.lookAt(this.camera.position.x, this.camera.position.z, this.camera.position.y, this.camera.target.x, this.camera.target.z, this.camera.target.y, 0, 1, 0);
		model = Matrix.identity();
		
		this.renderObjects(view, projection, this.objects_to_render);
	}
	
	this.getCamera = function()
	{
		return this.camera;
	}
	
	// initialization
	this.parameters = parameters;
	this.canvas = document.getElementById(parameters.canvas_name);
	
	this.gl = this.canvas.getContext("experimental-webgl");
	this.gl.clearColor(parameters.clear_color[0], parameters.clear_color[1], parameters.clear_color[2], 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	
	this.default_shader_program = this.createShaderProgram(" \
		attribute vec3 aVertexPosition; \
		attribute vec3 aVertexNormal; \
		attribute vec4 aVertexColor; \
		uniform mat4 aModelViewProjectionMatrix; \
		uniform mat4 aNormalMatrix; \
		varying vec4 vColor; \
		void main(void) { \
			gl_Position = aModelViewProjectionMatrix * vec4(aVertexPosition, 1.0); \
			vec3 ambientColor = vec3(1.0, 1.0, 1.0); \
			vec3 lightColor = vec3(1.0, 1.0, 1.0); \
			vec3 lightDirection = vec3(-1, -1, -1); \
			vec4 transformedNormal = aNormalMatrix * vec4(aVertexNormal, 1.0); \
			float lightValue = max(dot(transformedNormal.xyz, lightDirection), 0.0); \
			vColor = aVertexColor * vec4(ambientColor * 0.4 + lightColor * lightValue * 0.6, 1.0); \
		}", " \
		precision mediump float; \
		varying vec4 vColor; \
		void main(void) { \
			gl_FragColor = vColor; \
		}");
}
