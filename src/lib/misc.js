/**
  * Clamps a given value between lower and upper limits.
  *
  * @nosideeffects
  * @param {number} a the value to be clamped
  * @param {number} b the lower limit
  * @param {number} c the upper limit
  */
clamp = function(a, b, c)
{
	return Math.min(Math.max(a, b), c);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 8 bit integer.
  *
  * @nosideeffects
  * @param {number} a the value to be clamped
  */
clamp_and_round_uint8 = function(a)
{
	return clamp(a | 0, 0, 255);
}

/**
  * Rounds then clamps a given value to fit in a signed 16 bit integer.
  *
  * @nosideeffects
  * @param {number} a the value to be clamped
  */
clamp_and_round_int16 = function(a)
{
	return clamp(a | 0, -32768, 32767);
}
