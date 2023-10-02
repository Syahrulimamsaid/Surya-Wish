// MOON_Load_Game.js
//=============================================================================

/*:
 * @plugindesc Adds a load command to the status menu.
 * @author Anton Uklein
 * *
 * @help This plugin does not provide plugin commands.
 * 
 */


(function() {

	
	Window_MenuCommand.prototype.addLoadCommand = function() {
		if (this.needsCommand('load')) {
			//var enabled = this.isSaveEnabled();
			this.addCommand("Load", 'load', true);
		}
	};

	Scene_Menu.prototype.commandLoad = function() {
		SceneManager.push(Scene_Load);
	};

	Scene_Menu.prototype.createCommandWindow = function() {
		this._commandWindow = new Window_MenuCommand(0, 0);
		this._commandWindow.setHandler('item',      this.commandItem.bind(this));
		this._commandWindow.setHandler('skill',     this.onPersonalOk.bind(this));
		this._commandWindow.setHandler('equip',     this.onPersonalOk.bind(this));
		this._commandWindow.setHandler('status',    this.onPersonalOk.bind(this));
		this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
		this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
		this._commandWindow.setHandler('save',      this.commandSave.bind(this));
		this._commandWindow.setHandler('load',      this.commandLoad.bind(this));
		this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
		this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
		this.addWindow(this._commandWindow);
	};

	Window_MenuCommand.prototype.makeCommandList = function() {
		this.addMainCommands();
		this.addFormationCommand();
		this.addOriginalCommands();
		this.addOptionsCommand();
		this.addSaveCommand();
		this.addLoadCommand();
		this.addGameEndCommand();
	};


})();