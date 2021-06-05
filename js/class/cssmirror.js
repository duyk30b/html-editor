class CSSMirror {
    constructor(element) {
        this.editor = CodeMirror(element, {
            lineNumbers: true,
            lineWrapping: false,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            lineWiseCopyCut: true,
            mode: "css",
            extraKeys: { "Ctrl-Space": "autocomplete" },
            autoCloseBrackets: true,
            matchBrackets: true,

            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
            lint: true,
        });
        this.editor.setSize("100%", "100%");

        this.dataHints = ["haha", "doccc"];
        this.setShowHint();
        this.randomID = "";
    }

    getValue() {
        return this.editor.getValue();
    }
    setValue(str) {
        this.editor.setValue(str);
    }

    setShowHint() {
        this.editor.on("keyup", function (cm, event) {
            if ([16, 17, 18].includes(event.keyCode)) {
                cm.closeHint();
            }
            // else if (cm.state.completionActive){
            //     cm.closeHint();
            // }
            else if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 190) {
                // cm.showHint({ hint: CodeMirror.hint.javascript, completeSingle: false });
                let getHintCSS = (e) => {
                    let hints = CodeMirror.hint.myHint(e);
                    let css = CodeMirror.hint.css(e);
                    let aw = CodeMirror.hint.anyword(e);
                    if (css != undefined) {
                        css.list.forEach(function (h) {
                            if (hints.list.indexOf(h) == -1)
                                hints.list.push(h);
                        })
                    }
                    if (aw != undefined) {
                        aw.list.forEach(function (h) {
                            if (hints.list.indexOf(h) == -1)
                                hints.list.push(h);
                        })
                    }
                    hints.list.sort((a,b)=>a.length-b.length);

                    if (hints) {
                        fixCursor(e, hints);
                    }
                    return hints;
                }
                let fixCursor = (cm, hints) => {
                    CodeMirror.on(hints, "pick", function (word) {
                        if (word.charAt(word.length - 1) == ')') {
                            cm.execCommand("goCharLeft");
                        }
                        let cur = cm.getCursor();
                        let curLine = cm.getLine(cur.line);
                        if ([')', '"', "'"].includes(curLine.charAt(cur.ch))) {
                            cm.execCommand("goCharRight");
                        }
                    });
                }
                cm.showHint({ hint: getHintCSS, completeSingle: false });
            }
        });
    }
}