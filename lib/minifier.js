import * as Compiler from "./compilers.js";

class Minifier {
    static async Compress(path) {
        let root_path = path;
        let options = JSON.parse(localStorage.getItem("STEINER_COMPRESS_OPTIONS"));

        // COPY FOLDER
        if(!options.overwriteProject) {
            Minifier.UI.Progress("COPYING_DIR");

            let dest_path = root_path + "-steined";
            await FileSystem.copy(root_path, dest_path);
            root_path = dest_path;
        }

        // CREATE FILE LIST
        await Minifier.UI.Progress("SCANNING_FILES");
        let file_list = await Minifier.ScanFiles(root_path);

        // COMPILE
        try {

            if(options.HTML.enabled) {
                await Minifier.UI.Progress("COMPRESSING_HTML");
                await Compiler.HTML.Run(file_list.html, options.HTML);
            }
            
            if(options.CSS.enabled) {
                await Minifier.UI.Progress("COMPRESSING_CSS");
                await Compiler.CSS.Run(file_list.css, options.CSS);
            }

            if(options.JS.enabled) {
                await Minifier.UI.Progress("COMPRESSING_JS");
                await Compiler.JS.Run(file_list.js, options.JS);
            }
        
            await Minifier.UI.Progress("FINISHED", "done");
        }

        catch(err) {
            await Minifier.UI.Progress("FINISHED", "error");
            FileSystem.writeFile("error.log", err);
            Shell.openItem("error.log");
        }
    }

    static async ScanFiles(root) {
        let fs = window.FileSystem;
        let dir_tree = {
            "html": [],
            "xml": [],
            "css": [],
            "scss": [],
            "mjs": [],
            "js": []
        };

        let filter = (file) => {
            let supported_types = ["html", "xml", "css", "js", "mjs"];
            let file_ext = file.substr(file.indexOf(".") + 1);

            if(supported_types.includes(file_ext)) {
                let ext = supported_types[supported_types.indexOf(file_ext)];
                dir_tree[ext].push(file);
            }
        }

        let recurse = (path) => {
            let file_list = fs.readdirSync(path);

            file_list.forEach(file => {
                let file_path = path + "/" + file;
                let file_isDir = fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory();

                if(file_isDir) recurse(file_path);
                else filter(file_path);
            });
        }

        recurse(root);

        let refined_dir_tree = {
            "html": dir_tree.html.concat(dir_tree.xml),
            "css": dir_tree.css.concat(dir_tree.scss),
            "js": dir_tree.js.concat(dir_tree.mjs)
        }

        return refined_dir_tree;
    }

    static UI = {
        Init: function() {
            let project_path = document.getElementById("project-path");
            let submit_button = document.getElementById("submit-button");

            project_path.addEventListener("click", Minifier.UI.ChooseDir);
            submit_button.addEventListener("click", () => {
                let path = project_path.value;

                // CHECK IF PATH EXISTS
                if(!FileSystem.existsSync(path)) {
                    alert("Folder does not exists");
                    window.location.href = "#project-info";
                    return;
                }
                else {
                    window.location.href = "#project-progress";
                    Minifier.Compress(path);
                }
            });
        },

        ChooseDir: async function() {
            let project_path = this;

            let {dialog} = window.Remote;
            let path = await dialog.showOpenDialog({
                properties: ['openDirectory']
            });

            if(!path.canceled) {
                let root_path = path.filePaths[0];
                project_path.value = root_path;
            }
        },

        Progress: async function(name, state) {
            let process = document.getElementById("PROCESS_" + name);
            let runningProcess = document.querySelector("#project-progress p.running");

            if(runningProcess) runningProcess.className = (state == "error" ? "error" : "done");
            process.className = state || "running";

            // SLEEP
            return new Promise(resolve => setTimeout(() => resolve('resolved'), 1000));
        }
    }
}

window.addEventListener("load", Minifier.UI.Init);