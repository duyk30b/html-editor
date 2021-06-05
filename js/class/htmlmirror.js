class HTMLMirror {
    constructor(element) {
        this.editor = CodeMirror(element, {
            lineNumbers: true,
            lineWrapping: false,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            lineWiseCopyCut: true,
            mode: "htmlmixed",
            extraKeys: { "Ctrl-Space": "autocomplete" },
            autoCloseBrackets: true,
            matchBrackets: true,
            
            autoCloseTags: true,
            matchTags: { bothTags: true },
 
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        });
        this.editor.setSize("100%", "100%");
        emmetCodeMirror(this.editor);

        this.init();
    }

    init(){
        this.dataMyHint = [];
        this.registerMyHint();
        this.setEventBlur();
        this.setEventComplete();
    }

    setCursorTop(cm){
        cm.setSelection({
            'line': cm.firstLine(),
            'ch': 0,
            'sticky': null
        }, {
            'line': cm.firstLine(),
            'ch': 0,
            'sticky': null
        },
            { scroll: false }
        );
    }

    getValue() {
        return this.editor.getValue();
    }
    setValue(str) {
        this.editor.setValue(str);
        this.setCursorTop(this.editor);
        this.dataMyHint = this.getHintAnyword();
    }

    getHintAnyword() {
        let arr = [];
        let awHTML = CodeMirror.hint.anyword(this.editor);
        if (awHTML !== undefined) {
            awHTML["list"].forEach(function (h) {
                if (arr.indexOf(h) == -1)
                    arr.push(h);
            })
        }
        return arr;
    }

    setEventBlur(){
        let self = this;
        this.editor.on("blur", function (cm, event) {
            self.setCursorTop(cm);
            self.dataMyHint = self.getHintAnyword();
        });
    }

    setEventComplete(){
        this.editor.on("keyup", function (cm, event) {
            if (cm.state.completionActive) { }
            else if ([188, 191].includes(event.keyCode)) {
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
            }
        });
    }

    registerMyHint(){
        let self = this;
        CodeMirror.registerHelper('hint', 'myHint', function (editor) {
            var cur = editor.getCursor();
            var curLine = editor.getLine(cur.line);
            var start = cur.ch;
            var end = start;
            while (end < curLine.length && /[\w$]/.test(curLine.charAt(end))) ++end;
            while (start && /[\w$]/.test(curLine.charAt(start - 1))) --start;
            var curWord = start !== end && curLine.slice(start, end);
            //duyCode start !
            let strPatt = "";
            if(curWord != false){
                var curCharArr = curWord.split('');
                curCharArr.forEach(function (item, index) {
                    strPatt = strPatt + ".*" + item;
                })
            }
            var regex = new RegExp(strPatt, 'i');
            // var regex = new RegExp('^' + curWord, 'i');
            return {
                list: (!curWord ? [] : self.dataMyHint.filter(function (item) {
                    return item.match(regex);
                })).sort(),
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            }
        });
    }
}