/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */
 
define(["jquery", "ejs"], function($, EJS)
{
	"use strict";

	var clockElement;

	// Auto-focus the input field
	$(document).ready(function()
	{
		$("#input-content").focus();

		clockElement = $("#clock");

		Clock.start();
	});

	/** 
	 * Clock manager
	 */
	var Clock = {

		/**
		 * Update the time
		 */
		setClock: function()
		{
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();

			if(hours.length < 9)
			{
				hours = "0" + hours;
			}

			if(minutes < 9)
			{
				minutes = "0" + minutes;
			}

			clockElement.html(hours + ":" + minutes);
		},

		/**
		 * Start the clock
		 */
		start: function()
		{
			var weekdays = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			];

			var months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			];

			var date = new Date();

			$("#date-field").html(months[date.getMonth()] + " " + date.getDate());
			$("#weekday").html(weekdays[date.getDay()]);

			setInterval(Clock.setClock, 60000);

			Clock.setClock();
		}
	}

	/**
	 * View handler
	 */
	var View = {

		/**
		 * Load and render a view
		 * @param String name
		 * @param Array data
		 * @param Boolean dontRender
		 * @return String
		 */
		load: function(name, data, dontRender)
		{
			if(!data)
			{
				var data = {};
			}
			
			var view = new EJS({
				url: 'static/views/' + name + '.ejs'
			});

			if(dontRender)
			{
				return view;
			}
			else
			{
				return view.render(data);
			}
		}
	}

	// Public methods
	return {
		View: View
	};
});