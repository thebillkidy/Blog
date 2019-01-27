/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */

var Sound;

define(["jquery"], function($)
{
	"use strict";

	// Default to 80%
	if(!localStorage.volume)
	{
		localStorage.volume = 80;
	}

	var volume = localStorage.volume;
	var isPlaying = false;
	var isLowering = false;
	var lastSound = false;

	var volumeElement, barElement, circleElement, voiceBarElement, visualizerCanvas;

	$(document).ready(function()
	{
		// Define values
		volume = localStorage.volume;
		volumeElement = $("#voice-volume");
		barElement = $("#voice-bar-fill");
		circleElement = $("#voice-bar-circle");
		voiceBarElement = $("#voice-bar");
		visualizerCanvas = document.querySelector("#visualizer-canvas").getContext("2d");

		// Handle clicks on volume bar
		voiceBarElement.on('click', function(e)
		{
			setVolume(Math.round((e.offsetX / 140) * 100));
		});

		// Handle dragging on circle
		voiceBarElement.on('mousedown', function()
		{
			voiceBarElement.on('mouseup', function(e)
			{
				voiceBarElement.unbind('mousemove');
				voiceBarElement.unbind('mouseup');

				if(e.offsetX <= 140)
				{
					setVolume(Math.round((e.offsetX / 140) * 100));
				}
				else
				{
					setVolume(100);
				}
			});
		});

		setVolume(volume);

		Visualizer.start();
	});

	/**
	 * Set the volume level
	 * @param Int level
	 */
	var setVolume = function(level)
	{
		localStorage.volume = level;
		volume = level;

		volumeElement.html(volume);
		barElement.css({width:volume + "%"});
	};

	/**
	 * Get the volume level
	 * @return Int
	 */
	var getVolume = function()
	{
		return volume;
	};

	/**
	 * Play an audio file
	 * @param String file
	 * @param Boolean text2speech
	 */
	var play = function(file, text2speech)
	{
		if(isPlaying)
		{
			lastSound.pause();
		}

		if(text2speech)
		{
			Log.notice("Text 2 speech: " + file);
			file = "text2speech.php?text=" + encodeURIComponent(file);
		}
		else
		{
			Log.notice("Playing " + file);
		}

		var sound = lastSound = new Audio(file);

		sound.play();

		sound.addEventListener("canplay", function()
		{
			isPlaying = true;
		});
		
		sound.addEventListener("ended", function()
		{
			isPlaying = false;
			isLowering = true;
		});

		sound.volume = volume / 100;
	};

	/** 
	 * (Fake) FFT visualizer
	 */
	var Visualizer = {

		bars: [],

		/**
		 * Start visualizing 
		 */
		start: function()
		{
			setInterval(Visualizer.render, 100);

			for(var i = 0; i < 30; i++)
			{
				Visualizer.bars[i] = 0;
			}
		},

		/**
		 * Render a fake visualizer
		 */
		render: function()
		{
			if(isPlaying)
			{
				visualizerCanvas.fillStyle = "rgba(0,0,0,0.3)";
				visualizerCanvas.fillRect(0, 0, 211, 116);

				visualizerCanvas.fillStyle = "rgb(49,162,194)";
				
				var height;

				for(var i in Visualizer.bars)
				{
					if(Visualizer.bars[i] < 0)
					{
						Visualizer.bars[i] = Math.floor(Math.random() * volume/2) + 5;
					}
					else if(Visualizer.bars[i] > 100)
					{
						Visualizer.bars[i] = Visualizer.bars[i] - Math.floor(Math.random() * volume/2);
					}
					else
					{
						Visualizer.bars[i] = Visualizer.bars[i] + (Math.floor(Math.random() * volume/2) - Math.floor(Math.random() * volume/2));
					}

					visualizerCanvas.fillRect( i * 7 + 1, 116 - Visualizer.bars[i], 4, Visualizer.bars[i]);
				}
			}
			else if(isLowering)
			{
				visualizerCanvas.fillStyle = "rgba(0,0,0,0.3)";
				visualizerCanvas.fillRect(0, 0, 211, 116);

				visualizerCanvas.fillStyle = "rgb(49,162,194)";
				
				var height;

				isLowering = false;

				for(var i in Visualizer.bars)
				{
					if(Visualizer.bars[i] > 0)
					{
						isLowering = true;

						Visualizer.bars[i] = Visualizer.bars[i] - Math.floor(Math.random() * 20);

						visualizerCanvas.fillRect( i * 7 + 1, 116 - Visualizer.bars[i], 4, Visualizer.bars[i]);
					}
				}

				if(!isLowering)
				{
					visualizerCanvas.fillStyle = "rgba(0,0,0,1)";
					visualizerCanvas.fillRect(0, 0, 211, 116);
				}
			}
		}
	};

	// Public methods
	Sound = {
		play: play,
		setVolume: setVolume,
		getVolume: getVolume
	}
});