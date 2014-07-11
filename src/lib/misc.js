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
  * Rounds then clamps a given value to fit in a signed 16 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int16 = function(value)
{
	return clamp(value | 0, -32768, 32767);
}
