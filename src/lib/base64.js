/*
  one base64 character can store 6 bits. 16 bits need 2.66 base64 characters.
  store 3 x 16 bits (= 6 bytes) to have 8 characters of base64 data

  data           11111111 11111111 22222222 22222222 33333333 33333333
  base64 encoded aaaaaabb bbbbcccc ccdddddd eeeeeeff ffffgggg gghhhhhh
*/

/** @const */
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function int16array_to_base64(data, endian_swap)
{
	var i, j, a, b = [], len, output = "";
	
	// TODO: do a proper base64 "===" padding instead of data trimming
	var len = Math.floor(data.length / 3) * 3;
	
	// 6 bytes (3 x 16bit) in each iteration
	for (i = 0; i < len; i += 3)
	{
		if (endian_swap)
		{
			b = [
				(data[i] & 0xFF00) >> 8 | (data[i] & 0x00FF) << 8,
				(data[i+1] & 0xFF00) >> 8 | (data[i+1] & 0x00FF) << 8,
				(data[i+2] & 0xFF00) >> 8 | (data[i+2] & 0x00FF) << 8
			];
		}
		else
		{
			b = [ data[i], data[i+1], data[i+2] ];
		}
		
		a = [
			(b[0] & 0xFC00) >> 10,
			(b[0] & 0x03F0) >> 4,
			(b[0] & 0x000F) << 2 | (b[1] & 0xC000) >> 14,
			(b[1] & 0x3F00) >> 8,
			(b[1] & 0x00FC) >> 2,
			(b[1] & 0x0003) << 4 | (b[2] & 0xF000) >> 12,
			(b[2] & 0x0FC0) >> 6,
			(b[2] & 0x003F)
		];
		
		for (j=0; j<8; j++)
		{
			output += BASE64_CHARS[a[j]];
		}
	}
	
	return output;
}

function int32array_to_base64(data, endian_swap)
{
	var i, data2 = new Int16Array(data.length * 2);
	for (i=0; i<data.length; i++)
	{
		data2[i*2] = (data[i] & 0x000000FF) << 8 | (data[i] & 0x0000FF00) >> 8;
		data2[i*2+1] = (data[i] & 0x00FF0000) >> 8 | (data[i] & 0xFF000000) >> 24;
	}
	return int16array_to_base64(data2, endian_swap);
}

// TODO: implement a cross-browser solution instead of atob()
function base64_to_int16array(encoded_data)
{
	var i, data = atob(encoded_data);
	
	var output = new Int16Array(data.length / 2);
	
	for (i=0; i<data.length/2; i++)
	{
		output[i] = data.charCodeAt(i*2+1) * 256 + data.charCodeAt(i*2);
	}
	
	return output;
}
