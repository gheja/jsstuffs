/** @constructor */
var Base64 = function()
{
	"use strict";
	
	/** @const */
	var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	
	this.encode = function(data)
	{
		// the base64 encoding was originally written by @maettig for https://github.com/grumdrig/jsfxr
		
		var i, a, output = "", used = data.length;
		
		for (i = 0; i < used; i += 3)
		{
			a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
			output += BASE64_CHARS[a >> 18] + BASE64_CHARS[a >> 12 & 63] + BASE64_CHARS[a >> 6 & 63] + BASE64_CHARS[a & 63];
		}
		i -= used;
		
		return output.slice(0, output.length - i) + "==".slice(0, i);
	};
	
	// TODO: implement a cross-browser solution instead of atob()
	this.decode = function(encodedData)
	{
		var i, data = atob(encodedData), output = [];
		
		for (i=0; i<data.length; i++)
		{
			output[i] = data.charCodeAt(i);
		}
		
		return output;
	};
	
	this.toInt16Array = function(encodedData)
	{
		var i, data = atob(encodedData);
		
		var output = new Int16Array(data.length / 2);
		
		for (i=0; i<data.length/2; i++)
		{
			output[i] = data.charCodeAt(i*2+1) * 256 + data.charCodeAt(i*2);
		}
		
		return output;
	};
};

module.exports = Base64;
