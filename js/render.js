class Render {
	constructor(dataMirror, preview) {
		this.dataMirror = dataMirror;
		this.popup = null;
		this.preview = preview;
		this.init();
	}

	init() {
		this.getDebugText = 'undefined';
		this.iframe_js_string = '';
		fetch('components/iframe.js')
			.then((response) => response.text())
			.then((text) => {
				this.iframe_js_string = text;
				this.reloadPreview();
				this.reloadScriptDebug();
			});
	}

	pushDataMirror(type, newMirror) {
		let self = this;
		this.dataMirror[type].push(newMirror);
		if (type == 'CSS') {
			let random = Math.random().toString(36).substr(2, 10);
			self.addStyle(random);
			newMirror.randomID = random;
			newMirror.editor.on('change', function (cm, event) {
				self.updateStyle(random, newMirror.getValue());
				//self.reloadPreview();
			});
		} else {
			newMirror.editor.on('change', function (cm, event) {
				self.reloadPreview();
			});
		}
	}

	spliceDataMirror(type, index) {
		if (this.dataMirror[type][index].getValue() !== '') {
			if (confirm('Are you sure remove this editor!') == false) {
				return false;
			}
		}
		if ((type = 'CSS')) {
			let id = this.dataMirror[type][index].randomID;
			this.removeStyle(id);
		} else {
			this.reloadPreview();
		}
		this.dataMirror[type].splice(index, 1);
		return true;
	}

	checkHasValue() {
		for (let key in this.dataMirror) {
			for (let i = 0; i < this.dataMirror[key].length; i++) {
				if (this.dataMirror[key][i].getValue() != '') {
					return true;
				}
			}
		}
		return false;
	}

	demoCode() {
		let textCode = {};
		textCode['HTML'] = `<!DOCTYPE html>
			<html lang="en"> 
				<head>
					<meta charset="UTF-8">
					<meta name="description" content="The HTML5 Herald">
					<meta name="author" content="Developer">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Document</title>
					<link rel="stylesheet" href="">
					<style></style>
				</head>
				<body>
					<h4 class="timeLoad">What's happening??</h4>
					<h2>Have a lucky day !</h2>
					<div class="demoClass">Your function results:</div>
					<p id="demoID">Are your Javascript broken ?</p>
					<script src=""></script>
				</body>
			</html>
		`;
		textCode['CSS'] = `h4 { 
				text-align: right;
				font-style: italic;
			}
			h2 {
				text-align: center;
				color: red;
			}
			#demoID {
				text-align: center;
			}
		`;
		textCode['JS'] = `let getElement = document.getElementsByClassName("timeLoad")[0];
			let getTime = () => {
				return new Date().toLocaleTimeString() + " - " + new Date().getMilliseconds();
			}
			let count = 0;
			console.log(getElement);
			console.log({name: "John", age: 45, address: "NewYork"});
			setInterval(()=>{
				getElement.innerHTML = "This reload at: " + getTime();
				count++;
				console.log("Let's go:",count,true);
			},1000);
		`;

		for (let key in this.dataMirror) {
			this.dataMirror[key][0].setValue(textCode[key]);
		}
	}

	clearCode() {
		for (let key in this.dataMirror) {
			for (let i = 0; i < this.dataMirror[key].length; i++) {
				this.dataMirror[key][i].setValue('');
			}
		}
	}

	openPopup() {
		this.popup = window.open('', '', 'width=1000,height=600');
		let cssNode = document.createElement('style');
		let jsNode = document.createElement('script');
		cssNode.innerHTML = 'iframe{width:100%;height:100%;border:0}';
		jsNode.innerHTML = 'window.onbeforeunload=(e)=>{window.opener.messageFromChildWindow("popup closed")}';
		this.popup.document.head.append(cssNode);
		this.popup.document.head.append(jsNode);

		this.reloadPreview();
	}

	closePopup() {
		this.popup.close();
		this.popup = null;

		this.reloadPreview();
	}

	formatCode() {
		let fc = (cm) => {
			cm.setSelection(
				{
					line: cm.firstLine(),
					ch: 0,
					sticky: null,
				},
				{
					line: cm.lastLine(),
					ch: 0,
					sticky: null,
				},
				{ scroll: false }
			);
			cm.indentSelection('smart');
			cm.setSelection(
				{
					line: cm.firstLine(),
					ch: 0,
					sticky: null,
				},
				{
					line: cm.firstLine(),
					ch: 0,
					sticky: null,
				},
				{ scroll: false }
			);
		};

		for (let key in this.dataMirror) {
			for (let i = 0; i < this.dataMirror[key].length; i++) {
				fc(this.dataMirror[key][i].editor);
			}
		}
	}

	reloadPreview() {
		this.getDebugText = 'undefined';
		let bodyFrame = null;
		if (this.popup != null) {
			bodyFrame = this.popup.document.body;
		} else {
			bodyFrame = this.preview;
		}
		bodyFrame.innerHTML = '';
		let iframeNode = document.createElement('iframe');
		bodyFrame.appendChild(iframeNode);
		let myFrame = bodyFrame.getElementsByTagName('iframe')[0];
		this.writeWindow(myFrame.contentWindow);
	}

	writeWindow(w) {
		w.document.open();
		w.document.write(this.dataMirror['HTML'][0].getValue());
		w.document.close();

		let cssBase = document.createElement('link');
		cssBase.rel = 'stylesheet';
		cssBase.type = 'text/css';
		cssBase.href = 'components/iframe.css';
		w.document.head.appendChild(cssBase);

		let jsBase = document.createElement('script');
		jsBase.type = 'text/javascript';
		let jsBase_string = this.iframe_js_string;
		jsBase.innerHTML = jsBase_string;
		w.document.head.appendChild(jsBase);

		this.dataMirror['CSS'].forEach(function (item, index) {
			let cssNode = document.createElement('style');
			cssNode.id = item.randomID;
			cssNode.innerHTML = item.getValue();
			w.document.head.appendChild(cssNode);
		});

		this.dataMirror['JS'].forEach(function (item, index) {
			let jsNode = document.createElement('script');
			jsNode.innerHTML = item.getValue();
			w.document.body.appendChild(jsNode);
		});
	}

	getDocument() {
		let iframe = null;
		if (this.popup != null) {
			let documentPopup = this.popup.document;
			iframe = documentPopup.getElementsByTagName('iframe')[0];
		} else {
			iframe = document.getElementsByTagName('iframe')[0];
		}
		let dcm = iframe.contentDocument || iframe.contentWindow.document;
		return dcm;
	}

	addStyle(id) {
		let dcm = this.getDocument();
		let cssNode = dcm.createElement('style');
		cssNode.id = id;
		dcm.head.appendChild(cssNode);
	}
	updateStyle(id, content) {
		let dcm = this.getDocument();
		let style = dcm.getElementById(id);
		style.innerHTML = content;
	}
	removeStyle(id) {
		let dcm = this.getDocument();
		let style = dcm.getElementById(id);
		style.remove();
	}

	reloadScriptDebug() {
		let dcm = this.getDocument();
		let scriptDebug = dcm.getElementById('script-debug');
		if (scriptDebug) {
			scriptDebug.remove();
		}

		let jsDebug = document.createElement('script');
		jsDebug.type = 'text/javascript';
		jsDebug.id = 'script-debug';
		let jsDebug_string = `
			console_debugText.innerText = \`${this.getDebugText}\`;
			if (typeof ${this.getDebugText} !== 'undefined') {
				reloadDebug(${this.getDebugText});
			} else {
				console_debugValue.innerText = "undefined";
			}
		`;
		jsDebug.innerHTML = jsDebug_string;
		dcm.head.appendChild(jsDebug);
	}
}
