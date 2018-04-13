/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */

var Log = (function()
{
	"use strict";

	/**
	 * Change the logging level
	 * 0 = disabled
	 * 1 = errors
	 * 2 = warning
	 * 3 = all
	 */
	var loggingLevel = 3;

	/**
	 * Log a notice
	 * @param String message
	 */
	var notice = function(message)
	{
		if(loggingLevel >= 3)
		{
			console.log("[Notice] " + message);
		}
	};

	/**
	 * Log a warning
	 * @param String message
	 */
	var warning = function(message)
	{
		if(loggingLevel >= 2)
		{
			console.log("[Warning] " + message);
		}
	};

	/**
	 * Log a error
	 * @param String message
	 */
	var error = function(message)
	{
		if(loggingLevel >= 1)
		{
			console.log("[Error] " + message);
		}
	};

	// Public methods
	return {
		notice: notice,
		warning: warning,
		error: error
	}

}());