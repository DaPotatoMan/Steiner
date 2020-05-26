export class HTML {
    static Run(file_list, options) {
        delete options.enabled;
        return HTML.Compile(file_list, options);
    }

    static async Compile(file_list, options) {
        let fs = window.FileSystem;
        let htmlTerser = window.HTMLTerser;
        let terser_options = Object.assign({
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,

            useShortDoctype: true,
            collapseWhitespace: true,

            removeComments: true,
            removeEmptyElements: true,
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
        }, options);

        file_list.forEach(file => {
            let code = fs.readFileSync(file, "utf8");
            let result = htmlTerser.minify(code, terser_options);

            fs.writeFile(file, result);
        });
    }
}

export class CSS {
    static Run(file_list, options) {
        delete options.enabled;
        return CSS.Compile(file_list, options);
    }

    static async Compile(file_list, options) {
        let fs = window.FileSystem;
        let csso = window.CSSO;
        let csso_options = Object.assign({
            comments: false,
        }, options);

        file_list.forEach(file => {
            let code = fs.readFileSync(file, "utf8");
            let result = csso.minify(code, csso_options).css;

            fs.writeFile(file, result);
        });
    }
}

export class JS {
    static Run(file_list, options) {
        delete options.enabled;
        return JS.Compile(file_list, options);
    }

    static async CreateNameCache(file_list, options) {
        let fs = window.FileSystem;
        let terser = window.JSTerser;
        
        let js_code = {};
        for(let i=0; i<file_list.length; i++) {
            js_code["file" + i + 1] = await fs.readFile(file_list[i], "utf8");
        }

        terser.minify(js_code, options);
        return options.nameCache;
    }

    static async Compile(file_list, options) {
        let fs = window.FileSystem;
        let terser = window.JSTerser;
        let terser_options = Object.assign({
            compress: {
                drop_console: true,
                booleans_as_integers: true,
            },

            mangle: {
                properties: true, 
                toplevel: true
            },
            
            nameCache: {},
            warnings: true
        }, options);

        terser_options.nameCache = await JS.CreateNameCache(file_list, terser_options);

        file_list.forEach(file => {
            let code = fs.readFileSync(file, "utf8");
            let result = terser.minify(code, terser_options);

            if(result.code != "") fs.writeFile(file, result.code);
            if(result.error) throw result.error + "\n" + file;
            if(result.warnings) console.log(result.warnings);
        });
    }
}