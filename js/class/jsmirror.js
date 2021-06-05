class JSMirror {
	constructor(element) {
		this.editor = CodeMirror(element, {
			lineNumbers: true,
			lineWrapping: false,
			tabSize: 4,
			indentUnit: 4,
			indentWithTabs: true,
			lineWiseCopyCut: true,
			mode: 'javascript',
			extraKeys: { 'Ctrl-Space': 'autocomplete' },
			autoCloseBrackets: true,
			matchBrackets: true,

			foldGutter: true,
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
		});
		this.editor.setSize('100%', '100%');
		this.setShowHint();
	}

	getValue() {
		return this.editor.getValue();
	}
	setValue(str) {
		this.editor.setValue(str);
	}

	setShowHint() {
		this.editor.on('keyup', function (cm, event) {
			if ([16, 17, 18].includes(event.keyCode)) {
				cm.closeHint();
			}
			// else if (cm.state.completionActive){
			//     cm.closeHint();
			// }
			else if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 190) {
				// cm.showHint({ hint: CodeMirror.hint.javascript, completeSingle: false });
				let getHintJS = (e) => {
					let hints = CodeMirror.hint.myHint(e);
					let js = CodeMirror.hint.javascript(e);
					let aw = CodeMirror.hint.anyword(e);
					if (js != undefined) {
						js.list.forEach(function (h) {
							if (hints.list.indexOf(h) == -1) hints.list.push(h);
						});
					}
					if (aw != undefined) {
						aw.list.forEach(function (h) {
							if (hints.list.indexOf(h) == -1) hints.list.push(h);
						});
					}
					hints.list.sort((a, b) => a.length - b.length);

					if (hints) {
						fixCursor(e, hints);
					}
					return hints;
				};
				let fixCursor = (cm, hints) => {
					CodeMirror.on(hints, 'pick', function (word) {
						if (word.charAt(word.length - 1) == ')') {
							cm.execCommand('goCharLeft');
						}
						let cur = cm.getCursor();
						let curLine = cm.getLine(cur.line);
						if ([')', '"', "'"].includes(curLine.charAt(cur.ch))) {
							cm.execCommand('goCharRight');
						}
					});
				};
				cm.showHint({ hint: getHintJS, completeSingle: false });
			}
		});
	}

	sendHintText() {
        let editor = this.editor; //lấy cái editor đầu tiên
		let cur = editor.getCursor(); //lấy con trỏ chuột
		//vị trí chuột: cur.line: vị trí dòng, cur.ch: vị trí chữ,
		let curLine = editor.getLine(cur.line); //lấy cả dòng chữ ở trỏ chuột
		let curColumn = cur.ch;

		//Giả sử: mouse - mà chuột ở giữa chữ 'u' và 's'
		//-> Chữ cần gợi ý là 'mou', nhưng chữ cần thay thế là 'mouse
		//-> Object cần gợi ý: VD: document.getElement('d'). -> sau khi nhấn chấm là lấy đoạn gợi ý

		let debug_start, debug_end;
		for (debug_start = curColumn; debug_start >= 0; debug_start--) {
			let c = curLine.charAt(debug_start - 1);
			let pattern = /[\w\.\"\'\[\]]/;
			let test = pattern.test(c);
			if (!test) break;
		}
		for (debug_end = curColumn; debug_end < curLine.length; debug_end++) {
			let c = curLine.charAt(debug_end);
			let pattern = /[\w\"\'\[\]]/;
			let test = pattern.test(c);
			if (!test) break;
		}
		let debug_word = "";
		if (debug_start != debug_end) {
			debug_word = curLine.slice(debug_start, debug_end);
		}

		return debug_word;
	}
}
