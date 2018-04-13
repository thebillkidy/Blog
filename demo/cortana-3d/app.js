/** 
 * Project Servant
 * @author Jesper Lindström
 * @see https://github.com/raxezdev/servant
 */

// Basic configuration
require.config({
	baseUrl: "lib",
	paths: {
		app: "../app"
	}
});

// List of core files
var files = [
	"app/log",
	"app/config",
	"app/ui",
	"app/chat",
	"app/sound"
];

// Load all the files
require(files, function()
{
	if(localStorage.username)
	{
		Config.set("username", localStorage.username);
	}
	else
	{
		localStorage.username = "Stranger";
		Config.set("username", "Stranger");
	}

	Config.set("servant", "Mr Harrold");

	// Config.set("chatServer", "http://127.0.0.1:8000/");
	Config.set("chatServer", "http://" + window.location.hostname + ":8000/");
});