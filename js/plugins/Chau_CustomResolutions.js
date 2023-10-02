
/*:
@author Chaucer
@plugindesc | Resolutions : Version - 2.5.0 | Allow the player to choose resolution size.
@help
===============================================================================
 Introduction :
===============================================================================

 This plugin allows the player to choose a resolution size, from a list of
 predefined resolutions, which can be defined in the plugin parameters.
 This plugin also has the option to disable screen stretching! This plugin
 saves the previously used resolution of the player, and will launch
 the game in the same resolution the player last used, it will also remember if
 the player was using full screen or not. This plugin does NOT resize menu's!
 This plugin was not meant for android/ios/web games! Use at your own risk!

 As of 2.1.0, this plugin allows the user the option flexible_resolutions,
 this parameter, when enabled will still allow you to define custom resolutions
 however, if the computer running the game has a resolution that does not
 use a standard aspect ratio ( for example, 1280x680 ), the screen will scale
 itself to fit the new aspect ratio, this parameter will only allow a minor
 amount of change to the resolution, if the difference in aspect ration is too
 large( for exmaple, a 4:3 game resolution in comparison to 16:9 screen size ).

===============================================================================
 Requirements :
===============================================================================

---------------------------------------
 None.
---------------------------------------

===============================================================================
 Instructions :
===============================================================================

---------------------------------------
 RPG Maker 1.4.X- :
---------------------------------------
  For anyone using rpg maker 1.4.X and lower, the plugin parameters will have
  to be implemented manually. Below is a list of the parameters, and how to
  modify them in 1.4.X and lower.


  parameter : resolutions
  ---------------------------------------
  details : please keep "[" at the very begining, and keep "]" at the very end,
  do not put anything before or after these symbols, to add new resolutions,
  just put a comma after the last resolution in the list, and follow this
  format "WIDTHxHEIGHT"( quotes ARE required ), replace WIDTH, and HEIGHT,
  with the width/height you want the resolution to be.
  ---------------------------------------
  example : ["544x416", "640x480", "816x624", "1280x720"]


  parameters : prevent_stretching, launch_in_fullscreen, flexible_resolutions
  ---------------------------------------
  details : set these values to "true" or "false"( no quotes ) only, using any
  other value will more than likely result in errors.
  ---------------------------------------
  example : false
  example : true


===============================================================================
 Terms Of Use :
===============================================================================

  This Plugin may be used commercially, or non commercially so long as credit
 is given, either in the games credit section, or in a text file alongside
 the game. This plugin may NOT be sold, or Plagiarized. This plugin may
 be extended upon, and shared freely.


===============================================================================
 Version History :
===============================================================================

 ● Version : 1.0.0
 ● Date : 01/01/2017
   ★ Release.

 ● Version : 2.0.0
 ● Date : 12/02/2018
   ★ Rewrote plugin and help file.
   ★ Instantly launch with last used resolution, deploeyed game only.
   ★ If just one resolution is defined, options will not show resolution param.
   ★ Users can define unlimited resolutions instead of just 5.
   ★ Plugin now changes resolution, and NOT screen size.
   ★ Prevent stretching is now optional.

 ● Version : 2.1.0
 ● Date : 12/02/2018
   ★ flexible_resolutions parameter added, see help file for more info.
   ★ Full screen on startup option added( credits to ally @rwm ).
   ✩ Fixed bug which prevented window from using newly defined resolutions.

 ● Version : 2.4.0
 ● Date : 12/02/2018
   ★ Plugin now instantly resizes screen on launch for 1.6.0, even undeployed!
   ✩ Fixed crash which occurs randomly when game launches in full screen.
   ✩ Can now exit full screen when the game was launched in full screen.
   ✩ Fixed bug when changing resolutions while in full screen.
   ✩ Fixed resizing issue when changing to full screen.

 ● Version : 2.5.0
 ● Date : 04/03/2018
   ★ Added prevent full screen toggle button.
   ★ Disabled Maximize button if prevent_stretching is enabled.
   ✩ Game now keeps resolution after minimize( credits to Plueschkatze @rmw ).

===============================================================================
 Contact Me :
===============================================================================

  If you have questions, about this plugin, or commissioning me, or have
 a bug to report, please feel free to contact me by any of the below
 methods.

 rmw : https://forums.rpgmakerweb.com/index.php?members/chaucer.44456
 patreon : https://www.patreon.com/chaucer91
 discord : chaucer#7538
 skypeId : chaucer1991
 gmail : chaucer91

 ()()
 (^.^)
 c(")(")

===============================================================================


@param resolutions
@desc The resolutions the game can run in( can be set in the options, WIDTHxHEIGHT ).
@default ["544x416","640x480","816x624"]
@type text[]

@param flexible_resolutions
@desc This parameter if enabled will allow the game to slightly alter defined resolutions based on the users screen.
@default true
@type boolean
@off Disabled
@on Enabled

@param prevent_stretching
@desc Should the game prevent the player from stretching the screen?
@default true
@type boolean
@off Disabled
@on Enabled

@param launch_in_fullscreen
@desc Should the game start in fullscreen?
@default false
@type boolean
@off Disabled
@on Enabled

@param disable_fullscreen_button
@desc Should the full screen button( F4 ) be disabled?
@default false
@type boolean
@off Disabled
@on Enabled

*/

//============================================================================
'use strict'
var Imported = Imported || new Object();
Imported['CHAU_Resolutions'] = true;
//============================================================================
var Chaucer = Chaucer || new Object();
Chaucer.resolutions = new Object();
//============================================================================

( function ( $ ) { //IIFE

  $ = $ || {};

//Create plugin information.
//============================================================================
  var regexp, desc;
  regexp = /Resolutions : Version - \d+\.\d+\.\d+/;
  for ( var i = 0; i < $plugins.length; i++ ) {
    desc = $plugins[i].description.match( regexp );
    if ( !desc ) continue;
    desc = desc[0];
    $.alias = new Object();
    $.name = desc.split(":")[0].trim();
    $.version = desc.split("-")[1].trim();
    $.params = Parse( $plugins[i].parameters );
    break;
  };

  $.is1_6_X = compareVersion( Utils.RPGMAKER_VERSION, '1.6.0' )
  if ( !compareVersion( Utils.RPGMAKER_VERSION, '1.5.0' ) )
  { // when the MV version is not 1.5.0 or higher.
    console.warn(
      $.name + ' was built to utilize the plugin manager in \n' +
      'RPG Maker Version - 1.5.0 and up. It may be difficult\n' +
      'to setup in older versions of the engine'
    );
  }

  //--------------------------------------------------------------------------
  function compareVersion( current, required )
  {
  //--------------------------------------------------------------------------
    var version = current.split( '.' );
    var requiredVersion = required.split( '.' );
    if ( version[0] < requiredVersion[0] ) return false;
    if ( version[1] < requiredVersion[1] ) return false;
    if ( version[2] < requiredVersion[2] ) return false;
    // everything checked out.
    return true;
  };

  //--------------------------------------------------------------------------
  function Parse( object )
  { // parse all data in an object
  //--------------------------------------------------------------------------
    try {
      object = JSON.parse( object );
     } catch (e) {
      object = object;
     } finally {
      if ( typeof object === 'object' ) {
        if ( Array.isArray( object ) ) {
          for ( var i = 0; i < object.length; i++ ) {
            object[i] = Parse( object[i] );
          };
        } else {
          for ( var key in object ) {
            object[key] = Parse( object[key] );
          }
        }
      }
     }
     return object;
  };
//============================================================================


//=============================================================================
// Graphics :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.G_switchFullScreen = Graphics._switchFullScreen;
//-----------------------------------------------------------------------------
  Graphics._switchFullScreen = function ()
  { // Alias of _switchFullScreen
//-----------------------------------------------------------------------------
    if ( !$.params.disable_fullscreen_button ) {
      console.log( !$.params.disable_fullscreen_button );
      $.enableStretch();
      if ( $.launchedInFullScreen ) { // when game was launched in full screen.
        ConfigManager.setFullscreen( false );
        game.on( 'restore', $.onCancelFullScreen );
        game.toggleFullscreen();
      } else {
        $.alias.G_switchFullScreen.call( this );
        ConfigManager.setFullscreen( this._isFullScreen() );
      }
    }
  };

//-----------------------------------------------------------------------------
  $.alias.G_cancelFullScreen = Graphics._cancelFullScreen;
//-----------------------------------------------------------------------------
  Graphics._cancelFullScreen = function ()
  { // Alias of _cancelFullScreen
//-----------------------------------------------------------------------------
    $.alias.G_cancelFullScreen.call( this );
    document.addEventListener(
      'webkitfullscreenchange', $.onCancelFullScreen, false
    );
    document.addEventListener(
      'mozfullscreenchange', $.onCancelFullScreen, false
    );
    document.addEventListener(
      'msfullscreenchange', $.onCancelFullScreen, false
    );
    document.addEventListener(
      'fullscreenchange', $.onCancelFullScreen, false
    );
  };

//=============================================================================
// ConfigManager :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.CM_p_makeData = ConfigManager.makeData;
//-----------------------------------------------------------------------------
  ConfigManager.makeData = function ()
  { // Alias of makeData
//-----------------------------------------------------------------------------
    var config = $.alias.CM_p_makeData.call( this );
    config.resolution = this.resolution;
    config.fullscreen = this.fullscreen;
    return config;

  };

//-----------------------------------------------------------------------------
  $.alias.CM_applyData = ConfigManager.applyData;
//-----------------------------------------------------------------------------
  ConfigManager.applyData = function ( config )
  { // Alias of applyData
//-----------------------------------------------------------------------------
    $.alias.CM_applyData.call( this, config );
    var resolutions = $.params.resolutions
    this.defineResolution( config );
    this.defineFullscreen( config );
    this.setResolution( config['resolution'] );
    this.setFullscreen( this.readFlag( config, 'fullscreen' ) );
  };

//=============================================================================
// Window_Options :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.WO_p_makeCommandList = Window_Options.prototype.makeCommandList;
//-----------------------------------------------------------------------------
  Window_Options.prototype.makeCommandList = function ()
  { // Alias of makeCommandList
//-----------------------------------------------------------------------------
    if ( $.params.resolutions.length > 1 )
    { // only add the resolution option if theres more than one resolution.
      this.makeResolutionOptions();
    };
    $.alias.WO_p_makeCommandList.call( this );
  };

//-----------------------------------------------------------------------------
  $.alias.WO_p_statusText = Window_Options.prototype.statusText;
//-----------------------------------------------------------------------------
  Window_Options.prototype.statusText = function ( index )
  { // Alias of statusText
//-----------------------------------------------------------------------------
    var symbol = this.commandSymbol( index );
    if ( symbol === 'resolution' )
    { // when symbol is resolution.
      return ConfigManager.resolution;
    } else
    { // if symbol is not resolution.
      return $.alias.WO_p_statusText.call( this, index );
    }
  };

//-----------------------------------------------------------------------------
  $.alias.WO_p_processOk = Window_Options.prototype.processOk;
//-----------------------------------------------------------------------------
  Window_Options.prototype.processOk = function ()
  { // Alias of processOk
//-----------------------------------------------------------------------------
    var index = this.index();
    var symbol = this.commandSymbol( index );
    if ( symbol === 'resolution' )
    { // when symbol is resolution.
      this.changeValue( symbol, 1 );
    } else
    { // when symbol is not resolution.
      $.alias.WO_p_processOk.call( this );
    }
  };

//-----------------------------------------------------------------------------
  $.alias.WO_p_cursorRight = Window_Options.prototype.cursorRight;
//-----------------------------------------------------------------------------
  Window_Options.prototype.cursorRight = function ( wrap )
  { // Alias of cursorRight
//-----------------------------------------------------------------------------
    var index = this.index();
    var symbol = this.commandSymbol( index );
    if ( symbol === 'resolution' )
    { // when symbol is resolution.
      this.changeValue( symbol, 1 );
    } else
    { // when symbol is not resolution.
      $.alias.WO_p_cursorRight.call( this, wrap );
    }
  };

//-----------------------------------------------------------------------------
  $.alias.WO_p_cursorLeft = Window_Options.prototype.cursorLeft;
//-----------------------------------------------------------------------------
  Window_Options.prototype.cursorLeft = function ( wrap )
  { // Alias of cursorLeft
//-----------------------------------------------------------------------------
    var index = this.index();
    var symbol = this.commandSymbol( index );
    if ( symbol === 'resolution' )
    { // when symbol is resolution.
      this.changeValue( symbol, -1 );
    } else
    { // when symbol is not resolution.
      $.alias.WO_p_cursorLeft.call( this, wrap );
    }
  };

//-----------------------------------------------------------------------------
  $.alias.WO_p_changeValue = Window_Options.prototype.changeValue;
//-----------------------------------------------------------------------------
  Window_Options.prototype.changeValue = function ( symbol, value )
  { // Alias of changeValue
//-----------------------------------------------------------------------------
    if ( symbol === 'resolution' )
    { // if symbol is resolution.
      var current = this.getConfigValue( symbol );
      var resolutions = Chaucer.resolutions.params.resolutions;
      var max = resolutions.length;
      var index = ( resolutions.indexOf( current ) + value ).mod( max );
      var resolution = resolutions[index];
      if ( resolution ) ConfigManager.setResolution( resolution );
      this.redrawItem(this.findSymbol(symbol));
      SoundManager.playCursor();
      this.updatePlacement();
    } else
    { // when symbol is not resolution.
      $.alias.WO_p_changeValue.call( this, symbol, value );
    }

  };

//=============================================================================
// CUSTOM :
//=============================================================================
  var game = require( "nw.gui" ).Window.get();
  var padding = new Point( 16, 39 );
  $.launchedInFullScreen = false;

//-----------------------------------------------------------------------------
  game.on( 'minimize', function()
  { // when screen is minimized.
//-----------------------------------------------------------------------------
    game.on( 'restore', $.onCancelFullScreen ); // set restore listener.
  }.bind( this ) );

//-----------------------------------------------------------------------------
  game.on( 'maximize', function()
  { // when screen is maximized.
//-----------------------------------------------------------------------------
    if ( $.params.prevent_stretching ) game.unmaximize(); // unmaximize.
  }.bind( this ) );

//-----------------------------------------------------------------------------
  $.onCancelFullScreen = function( error )
  { // prevent the screen from stretching.
//-----------------------------------------------------------------------------
    $.setResolution( ConfigManager.resolution );
    document.removeEventListener(
      'webkitfullscreenchange', $.onCancelFullScreen
    );
    document.removeEventListener(
      'mozfullscreenchange', $.onCancelFullScreen
    );
    document.removeEventListener(
      'msfullscreenchange', $.onCancelFullScreen
    );
    document.removeEventListener(
      'fullscreenchange', $.onCancelFullScreen
    );
    if ( $.launchedInFullScreen ) {
      $.launchedInFullScreen = false;
      game.removeListener(
        'restore', $.onCancelFullScreen
      );
    }
  };

//-----------------------------------------------------------------------------
  $.disableStretch = function( width, height )
  { // prevent the screen from stretching.
//-----------------------------------------------------------------------------
    var ox = padding.x, oy = 8;
    if ( !$.is1_6_X ) ox = 0, oy = 0;
    game.setMinimumSize( width + ox, height + oy );
    game.setMaximumSize( width + ox, height + oy );
  };

//-----------------------------------------------------------------------------
  $.enableStretch = function()
  { // allow the screen to stretch.
//-----------------------------------------------------------------------------
    if ( $.is1_6_X ) {
      game.setMinimumSize( null, null );
      game.setMaximumSize( null, null );
    } else {
      game.setMinimumSize( 0, 0 );
      game.setMaximumSize( screen.availWidth, screen.availHeight );
    }
  };


//-----------------------------------------------------------------------------
  $.setResolution = function( value )
  { // change resolution of the game.
//-----------------------------------------------------------------------------
    var resolution = value.split( 'x' ).map( Number );
    if ( $.params.flexible_resolutions ) $.fitToAspectRatio( resolution );
    SceneManager._screenWidth = resolution[0]
    Graphics.width = Graphics.boxWidth = resolution[0];
    SceneManager._screenHeight = resolution[0]
    Graphics.height = Graphics.boxHeight = resolution[1];
    $.resizeScreen( resolution[0], resolution[1] );
  };

//-----------------------------------------------------------------------------
  $.fitToAspectRatio = function( resolution )
  { // try to fit the resolution to the aspect ratio of the screen.
//-----------------------------------------------------------------------------
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    var properWidth = ( screenWidth /  screenHeight ) * resolution[1];
    var properHeight = ( screenHeight / screenWidth ) * resolution[0];
    var xDiff = Math.abs( properWidth - resolution[0] ) / properWidth;
    var yDiff = Math.abs( properHeight - resolution[1] ) / properHeight;
    // if the resolution is a different aspect ratio.
    if ( ( yDiff > 0 && yDiff <= 0.1 ) || ( xDiff > 0 && xDiff <= 0.1 ) ) {
      if ( xDiff % 0 === 0 ) {
        resolution[0] = Math.round( properWidth );
      } else if ( yDiff % 0 === 0 ) {
        resolution[1] = Math.round( properHeight );
      } else if ( xDiff < yDiff ) {
        resolution[0] = Math.round( properWidth );
      } else {
        resolution[1] = Math.round( properHeight );
      }
    }
  };
  //-----------------------------------------------------------------------------
    $.resizeScreen = function( width, height )
    { // resize the game screen.
  //-----------------------------------------------------------------------------
      $.enableStretch();
      if ( !game.isFullscreen ) { // when not full screen.
        game.resizeTo(
          width + padding.x,
          height + padding.y
        );
        $.centerScreen( width, height ); // center the screen.
        if ( $.params.prevent_stretching ) $.disableStretch( width, height );
      };
    };

  //-----------------------------------------------------------------------------
    $.centerScreen = function( width, height )
    { // resize the game screen.
  //-----------------------------------------------------------------------------
      $.enableStretch(); // allow the screen to stretch.
      if ( !game.isFullscreen )
      { // when the games not in full screen, resize the screen.
        width = Math.round( width / 2 );
        height = Math.round( height / 2 );
        var mWidth = Math.round( screen.availWidth / 2 );
        var mHeight = Math.round( screen.availHeight / 2 );
        game.moveTo( // recenter the screen.
          ( mWidth - Math.floor( padding.x / 2 ) ) - width,
          ( mHeight - ( Math.ceil( padding.y / 2 ) ) ) - height
        );
      }
    };

//=============================================================================
} )( Chaucer.resolutions );
//=============================================================================

//=============================================================================
// ConfigManager :
//=============================================================================

//-----------------------------------------------------------------------------
ConfigManager.defineResolution = function ( config )
{ // define resolution of the object provided.
//-----------------------------------------------------------------------------
  var resolutions = Chaucer.resolutions.params.resolutions;
  if ( resolutions.indexOf( config.resolution ) < 0 )
  { // when objects resolution does not match any known resolution.
    config.resolution = resolutions[0];
  }
};

//-----------------------------------------------------------------------------
ConfigManager.defineFullscreen = function ( config )
{ // define fullscreen of the object provided.
//-----------------------------------------------------------------------------
  var params = Chaucer.resolutions.params;
  this.setLaunchedInFullScreen();
  if ( config.fullscreen === undefined )
  { // define full screen based on launch params.
    config.fullscreen = params.launch_in_fullscreen;
  }
  // if ( config.fullscreen ) Graphics._switchFullScreen();
};

//-----------------------------------------------------------------------------
ConfigManager.setLaunchedInFullScreen = function ()
{ // set the launchedInFullScreen value.
//-----------------------------------------------------------------------------
  if ( $gameTemp && !$gameTemp.isPlaytest() || Chaucer.resolutions.is1_6_X )
  { // when this is a deploeyed game, or is 1.6.0 or higher.
    var fs = require( 'fs' );
    var file = DataManager.getPackageDirectory();
    var json = JSON.parse( fs.readFileSync( file, 'utf8' ) );
    Chaucer.resolutions.launchedInFullScreen = json.window.fullscreen;
  }

};

//-----------------------------------------------------------------------------
ConfigManager.setResolution = function ( value )
{ // set the resolution.
//-----------------------------------------------------------------------------
  Chaucer.resolutions.setResolution( value );
  this.resolution = value;
  this.save();
  if ( $dataMap ) $gamePlayer.center( $gamePlayer.x, $gamePlayer.y );
  if ( SceneManager._scene && SceneManager._scene._windowLayer )
  { // resize the window layer.
    SceneManager._scene._windowLayer.width = Graphics.width;
    SceneManager._scene._windowLayer.height = Graphics.height;
  }
  if ( $gameTemp && !$gameTemp.isPlaytest() || Chaucer.resolutions.is1_6_X )
  { // when this is a deploeyed game.
    DataManager.saveToPackageJson();
  }
};

//-----------------------------------------------------------------------------
ConfigManager.setFullscreen = function ( bool )
{ // set the full screen value.
//-----------------------------------------------------------------------------
  this.fullscreen = bool;
  this.save();
  if ( $gameTemp && !$gameTemp.isPlaytest()|| Chaucer.resolutions.is1_6_X )
  { // when this is a deploeyed game.
    DataManager.saveToPackageJson();
  }
};

//=============================================================================
// DataManager :
//=============================================================================

//-----------------------------------------------------------------------------
DataManager.saveToPackageJson = function ()
{ // save the screen info to package.json file.
//-----------------------------------------------------------------------------
  var fs = require( 'fs' );
  var file = this.getPackageDirectory();
  var json = JSON.parse( fs.readFileSync( file, 'utf8' ) );
  if ( json ) { // when we successfully read the json file.
    if ( ConfigManager.resolution ) {
      var resolution = ConfigManager.resolution.split( 'x' ).map( Number );
      json.window.width = resolution[0];
      json.window.height = resolution[1];
    }
    json.window["fullscreen"] = ConfigManager.fullscreen;
    var data = JSON.stringify( json );
    fs.writeFileSync( file, data );
  }
};

//-----------------------------------------------------------------------------
DataManager.getPackageDirectory = function ()
{ // return the directory for the package.json file.
//-----------------------------------------------------------------------------
  var path = require( 'path' );
  var file = 'package.json';
  if ( Chaucer.resolutions.is1_6_X )
  { // if the version is 1.6.0 or higher.
    return path.join( path.dirname( process.mainModule.filename ), file );
  } else
  { // if the version is less than 1.6.0.
    return path.dirname( process.mainModule.filename ).replace( 'www', file );
  }
};

//=============================================================================
// Window_Options :
//=============================================================================

//-----------------------------------------------------------------------------
Window_Options.prototype.makeResolutionOptions = function ()
{ // create option fo resolutions.
//-----------------------------------------------------------------------------
  this.addCommand( 'Resolution', 'resolution' );
};
