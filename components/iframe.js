let random_name = 'ranDCT12f3SDsa';

let consoleElement = document.createElement('div');
consoleElement.classList.add(random_name);
document.body.appendChild(consoleElement);

let console_head = document.createElement('div');
console_head.classList.add(random_name + '-head');
console_head.innerHTML = "<span>Console Log</span><button onclick='hide_Console()'>-</button>";

let console_body = document.createElement('pre');
console_body.classList.add(random_name + '-body');

let console_foot = document.createElement('div');
console_foot.classList.add(random_name + '-foot');
console_foot.innerHTML = '<span>typeof </span>';

let console_debugText = document.createElement('span');
console_debugText.classList.add(random_name + '-console_debugText');
console_debugText.contentEditable = 'true';
console_foot.appendChild(console_debugText);

let console_debugValue = document.createElement('span');
console_foot.appendChild(console_debugValue);

consoleElement.appendChild(console_head);
consoleElement.appendChild(console_body);
consoleElement.appendChild(console_foot);

let scrollState = false;
console_body.onmousedown = () => (scrollState = true);
console_body.onmouseup = () => (scrollState = false);

if (!console) console = {};
console.log = function () {
	for (let i = 0; i < arguments.length; i++) {
		let arg = arguments[i];
		let type = typeof arg;
		if (typeof arg === 'object' && typeof JSON === 'object' && typeof JSON.stringify === 'function') {
			if (arg instanceof Element) {
				arg = arg.outerHTML;
			} else {
				arg = JSON.stringify(arg, null, 4);
			}
		}
		let span = document.createElement('span');
		span.classList.add(random_name + '-' + type);
		span.innerText = arg;
		console_body.appendChild(span);

		let space = document.createElement('span');
		space.innerHTML = '&ensp;';
		console_body.appendChild(space);
	}
	let br = document.createElement('br');
	console_body.appendChild(br);

	if (!scrollState && console_body.scrollHeight - console_body.scrollTop < 400) {
		console_body.scrollTop = console_body.scrollHeight;
	}
};

console.error = (message) => {
	let p = document.createElement('p');
	p.classList.add(random_name + '-error');
	p.innerText = message;
	console_body.appendChild(p);
};

let copyObjectElement = (root) => {
	let result = {};
	if (!(root instanceof Element)) return result;
	for (const key in root) {
		if (!root[key]) {
			result[key] = undefined;
		} else if (typeof root[key] == 'object') {
			result[key] = {};
		} else if (typeof root[key] == 'function') {
			result[key] = root[key];
		} else {
			result[key] = root[key];
		}
	}
	return result;
};

console.debug = (debug) => {
	console_body.innerHTML = '';
	if (debug instanceof Element) {
		debug = copyObjectElement(debug);
	}
	console.log(debug);
};

window.onerror = (msg, url, line, column, err) => {
	console.error(err);
	console.error('\t  url : ' + url);
	console.error('\t  at  : Line - ' + line + ', Column - ' + column);
	//console.error(err.stack);
};

let reloadDebug = (debug) => {
    let debugValue;
    if(typeof debug == "object"){
        debugValue = debug;
        console.debug(debug);
    }
    else if(typeof debug == "function"){
        debugValue = "function(){ ... }";
        console.debug(debug);
    }
    else {
        debugValue = typeof debug;
		console.debug(debug);
    }
    console_debugValue.innerText = debugValue;
}

let hide_Console = () => {
	console_body.classList.toggle('hide');
};
