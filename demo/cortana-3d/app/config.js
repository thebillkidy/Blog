/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */

var Config = (function()
{
	"use strict";
	
	var data = {};

	/**
	 * Set a config item
	 * @param String key
	 * @param String value
	 */
	var set = function(key, value)
	{
		data[key] = value;
	};

	/**
	 * Get a config item
	 * @param String key
	 * @return String
	 */
	var get = function(key)
	{
		if(typeof data[key] != "undefined")
		{
			return data[key];
		}
		else
		{
			return false;
		}
	}

	// Public methods
	return {
		set: set,
		get: get
	}

}());