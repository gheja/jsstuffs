clamp = function(a, b, c)
{
	return Math.min(Math.max(a, b), c);
}

clamp_and_round_uint8 = function(a)
{
	return clamp(a | 0, 0, 255);
}

clamp_and_round_int16 = function(a)
{
	return clamp(a | 0, -32768, 32767);
}
