class UI {
    static Init() {
        const options = document.getElementById("compress_options");
        options.addEventListener("change", () => UI.HandleOptions(options));

        // CREATE BACKUP
        UI.HandleOptions(options);
    }

    static CreateOptionsDB(options) {
        let data = {
            "HTML": {
                enabled: options.compress_html.checked,

                minifyJS: options.html_minifyJS.checked,
                minifyCSS: options.html_minifyCSS.checked,
                minifyURLs: options.html_minifyURLs.checked,
                useShortDoctype: options.html_useShortDoctype.checked,
                collapseWhitespace: options.html_collapseWhitespace.checked,
                removeComments: options.html_removeComments.checked,
                removeEmptyElements: options.html_removeEmptyElements.checked,
                removeEmptyAttributes: options.html_removeEmptyAttributes.checked,
                removeAttributeQuotes: options.html_removeAttributeQuotes.checked,
                removeRedundantAttributes: options.html_removeRedundantAttributes.checked,
                removeScriptTypeAttributes: options.html_removeScriptTypeAttributes.checked,
                removeStyleLinkTypeAttributes: options.html_removeStyleLinkTypeAttributes.checked,
            },

            "CSS": {
                enabled: options.compress_css.checked,
                comments: options.css_keepComments.checked
            },

            "JS": {
                enabled: options.compress_js.checked,

                compress: {
                    drop_console: options.js_dropConsole.checked,
                    booleans_as_integers: options.js_booleansAsIntegers.checked,
                },
                mangle: {
                    properties: options.js_mangleProperties.checked,
                    toplevel: options.js_mangleTopLevel.checked,
                }
            },

            "overwriteProject": options.overwrite_project.checked
        }

        return data;
    }

    static HandleOptions(options_form) {
        let options = UI.CreateOptionsDB(options_form);
        
        // SAVE COMPRESS OPTIONS
        localStorage.setItem("STEINER_COMPRESS_OPTIONS", JSON.stringify(options));
    }
}

UI.Init();