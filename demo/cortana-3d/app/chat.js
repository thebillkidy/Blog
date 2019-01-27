/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */
 
define(["jquery", "app/ui"], function($, UI)
{
	"use strict";
	
	var input, chat, chatArea, load, actionState = false;

	// Obtain an instance of the input field element
	$(document).ready(function()
	{
		$("#input-author").html(Config.get("username") + ">");

		input = $("#input-content");
		chat = $("#chat-messages");
		chatArea = $("#chat");
		load = $("#load");

		actionState = "auth";

		send({name: Config.get("username")});
	});

	// Key press handler
	$(document).on('keydown', function(e)
	{
		// Listen for 'enter'
		if(e.keyCode == 13)
		{
			e.preventDefault();
			sendMessage();
		}
	});

	/**
	 * Remove unintentional HTML code from the message
	 * @param message
	 * @return String
	 */
	var tidyHTML = function(message)
	{
		return message.replace(/<(\/)?[a-z]*(\/)?>/ig, "");
	}

	/**
	 * Send a message to the servant
	 */
	var sendMessage = function()
	{
		var content = input.val();
		content = tidyHTML(content);

		var view = UI.View.load("normal", {
			author: Config.get("username"),
			message: content
		})

		chat.append(view);
		chatArea[0].scrollTop = chatArea[0].scrollHeight;

		input.val("");

		send({message: content});
	};

	/**
	 * Process the chat message
	 */
	var processMessage = function(data)
	{
		load.hide();

		actionState = data.action;

		// Text 2 speech
		if(data.speech)
		{
			Sound.play(data.speech, true);
		}

		// Regular chat message
		if(data.message)
		{
			var chatMessage = UI.View.load("normal", {
				author: Config.get("servant"),
				message: data.message
			})

			chat.append(chatMessage);

			chatArea[0].scrollTop = chatArea[0].scrollHeight;
		}

		// Support additional views
		if(data.view)
		{
			var extraView = UI.View.load(data.view, data.viewData);

			chat.append(extraView);
			chatArea[0].scrollTop = chatArea[0].scrollHeight;
		}

		// Support client side javascript
		if(data.js)
		{
			eval(data.js);
		}
	};

	/**
	 * Display a connection error
	 */
	var connectionError = function()
	{
		load.hide();

		Sound.play("The server is offline", true);

		var chatMessage = UI.View.load("normal", {
			author: "Error",
			message: "<span style='color:red;'>The server is offline</span>"
		})

		chat.append(chatMessage);
	};

	/**
	 * Send a chat message to the server
	 * @param String data
	 */
	var send = function(data)
	{
		load.show();

		if(!data)
		{
			var data = {};
		}

		data.action = actionState;

		Log.notice("Sending data:");
		console.log(data);

		$.ajax({
			type: "POST",
			url: Config.get("chatServer"),
			data: data,
			success: processMessage,
			error: connectionError
		});
	};
});