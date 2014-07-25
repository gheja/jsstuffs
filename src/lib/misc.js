/**
  * Miscellaneous helpers
  *
  * @module misc
  */

/**
  * Clamps a given value between lower and upper limits.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  * @param {number} lower_limit the lower limit
  * @param {number} upper_limit the upper limit
  */
clamp = function(value, lower_limit, upper_limit)
{
	return Math.min(Math.max(value, lower_limit), upper_limit);
}

/**
  * Rounds then clamps a given value to fit in a signed 6 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int6 = function(value)
{
	return clamp(value | 0, -32, 31);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 6 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint6 = function(value)
{
	return clamp(value | 0, 0, 63);
}

/**
  * Rounds then clamps a given value to fit in a signed 8 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int8 = function(value)
{
	return clamp(value | 0, -128, 127);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 8 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint8 = function(value)
{
	return clamp(value | 0, 0, 255);
}

/**
  * Rounds then clamps a given value to fit in a signed 12 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int12 = function(value)
{
	return clamp(value | 0, -2048, 2047);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 12 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint12 = function(value)
{
	return clamp(value | 0, 0, 4095);
}

/**
  * Rounds then clamps a given value to fit in a signed 16 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int16 = function(value)
{
	return clamp(value | 0, -32768, 32767);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 16 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint16 = function(value)
{
	return clamp(value | 0, 0, 65535);
}

/**
  * Rounds then clamps a given value to fit in a signed 24 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int24 = function(value)
{
	return clamp(value | 0, -8388608, 8388607);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 24 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint24 = function(value)
{
	return clamp(value | 0, 0, 16777215);
}

/**
  * Rounds then clamps a given value to fit in a signed 32 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int32 = function(value)
{
	/*
	  Note: the bitwise OR operator ("|") is working on 32 bit integers
	  therefore rounding values outside the 32 bits is not working, falling back
	  to Math.round().
	*/
	
	return clamp(Math.round(value), -2147483648, 2147483647);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 32 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint32 = function(value)
{
	/*
	  Note: the bitwise OR operator ("|") is working on 32 bit integers
	  therefore rounding values outside the 32 bits is not working, falling back
	  to Math.round().
	*/
	return clamp(Math.round(value), 0, 4294967295);
}

/**
  * Copies an object recursively - this is NOT a proper cloning technique! And
  * also this is slow.
  *
  * @nosideeffects
  * @param {Object} obj the object to be copied
  * @returns {Object}
  */
function deep_copy_object(obj)
{
	return JSON.parse(JSON.stringify(obj));
}
