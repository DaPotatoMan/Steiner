// BASIC MODULES
window.require = require;
window.FileSystem = require("fs-extra");
window.Shell = require("electron").shell;
window.Remote = require('electron').remote;

// MINIFIER MODULES
window.CSSO = require("csso");
window.JSTerser = require("terser");
window.HTMLTerser = require('html-minifier-terser');