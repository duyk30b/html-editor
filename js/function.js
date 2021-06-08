let root = document.querySelector(':root');

let render = new Render({ HTML: [], CSS: [], JS: [] }, document.getElementById('preview'));
render.pushDataMirror('HTML', new HTMLMirror(document.getElementsByClassName('HTMLPanel')[0]));
render.pushDataMirror('CSS', new CSSMirror(document.getElementsByClassName('CSSPanel')[0]));
render.pushDataMirror('JS', new JSMirror(document.getElementsByClassName('JSPanel')[0]));

let rotate = 0,
	indexActive = 0;

let activeNavPanel = (type, index) => {
	indexActive = index;
	let listNav = document.querySelectorAll('.itemNav[data-type="' + type + '"]');
	let listPanel = document.querySelectorAll('.itemPanel[data-type="' + type + '"]');
	let itemArea = document.getElementById(type + 'Area');

	for (let i = 0; i < listNav.length; i++) {
		listNav[i].classList.remove('active');
		listPanel[i].classList.remove('active');
	}

	listNav[index].classList.add('active');
	listPanel[index].classList.add('active');
	itemArea.classList.add('active');

	resizeArea();
	setBtnNavDelHide(type);
};

let setBtnNavDelHide = (type) => {
	let list_btnNavDel = document.querySelectorAll('.btnNavDel[data-type="' + type + '"]');
	let count = list_btnNavDel.length;
	if (count == 1) {
		list_btnNavDel[0].classList.add('hide');
	}
	if (count > 1) {
		list_btnNavDel[0].classList.remove('hide');
	}
};

let resizeArea = () => {
	let itemArea_Active = document.querySelectorAll('.itemArea.active'),
		itemArea_notActive = document.querySelectorAll('.itemArea:not(.active)'),
		count_Active = itemArea_Active.length;

	let setGridEditBox = (areas, cols, rows) => {
		let editBox = document.getElementById('editBox');
		editBox.style.gridTemplateAreas = areas;
		editBox.style.gridTemplateColumns = cols;
		editBox.style.gridTemplateRows = rows;
	};
	if (count_Active == 3) {
		root.style.setProperty('--preview-width', '350px');
		let listRotate = {
			0: ["'HTML CSS''HTML JS'", '1fr 1fr', '1fr 1fr'],
			1: ["'HTML CSS''JS CSS'", '1fr 1fr', '1fr 1fr'],
			2: ["'HTML CSS''JS JS'", '1fr 1fr', '1fr 1fr'],
			3: ["'HTML HTML''CSS JS'", '1fr 1fr', '1fr 1fr'],
			4: ["'HTML JS''CSS JS'", '1fr 1fr', '1fr 1fr'],
			5: ["'HTML CSS JS'", '1fr 1fr 1fr', '1fr'],
			6: ["'HTML''CSS''JS'", '1fr', '1fr 1fr 1fr'],
		};
		setGridEditBox(listRotate[rotate % 7][0], listRotate[rotate % 7][1], listRotate[rotate % 7][2]);
	} else if (count_Active == 2) {
		let type_notActive = itemArea_notActive[0].dataset.type;
		let h = { HTML: '1fr', CSS: '1fr', JS: '1fr' };
		h[type_notActive] = '2.8rem';
		if (rotate % 2 == 0) {
			setGridEditBox("'HTML''CSS''JS'", '1fr', h['HTML'] + ' ' + h['CSS'] + ' ' + h['JS']);
		} else {
			let str = "'HTML CSS JS'".replace(type_notActive, '') + "'" + type_notActive + ' ' + type_notActive + "'";
			setGridEditBox(str, '1fr 1fr', '1fr 2.8rem');
		}
	} else if (count_Active == 1) {
		root.style.setProperty('--preview-width', '50%');
		let type_Active = itemArea_Active[0].dataset.type;
		let h = { HTML: '2.8rem', CSS: '2.8rem', JS: '2.8rem' };
		h[type_Active] = '1fr';
		setGridEditBox("'HTML''CSS''JS'", '1fr', h['HTML'] + ' ' + h['CSS'] + ' ' + h['JS']);
	} else {
		setGridEditBox("'HTML''CSS''JS'", '1fr', '2.8rem 2.8rem 2.8rem');
	}
};

let click_add_CSSPanel = (btn) => {
	let listCSSNav = document.getElementsByClassName('CSSNav');
	let index = listCSSNav.length;

	let parentCSSNav = document.querySelector('.navController[data-type="CSS"]');
	let newCSSNav = document.createElement('div');
	parentCSSNav.insertBefore(newCSSNav, btn);
	newCSSNav.outerHTML = `<div class="CSSNav itemNav active" onclick="click_itemNav(this)" data-type="CSS">
								<div>style.css</div>
								<div class="btnNavDel" onclick="click_btnNavDel(this)" data-type="CSS">x</div>
							</div>`;

	let parentCSSPanel = document.querySelector('.navPanel[data-type="CSS"]');
	let newCSSPanel = document.createElement('div');
	parentCSSPanel.appendChild(newCSSPanel);
	newCSSPanel.outerHTML = `<div class="CSSPanel itemPanel active" data-type="CSS"></div>`;

	activeNavPanel('CSS', index);
	let newMirror = new CSSMirror(document.getElementsByClassName('CSSPanel')[index]);
	render.pushDataMirror('CSS', newMirror);
};

let click_add_JSPanel = (btn) => {
	let listJSNav = document.getElementsByClassName('JSNav');
	let index = listJSNav.length;

	let parentJSNav = document.querySelector('.navController[data-type="JS"]');
	let newJSNav = document.createElement('div');
	parentJSNav.insertBefore(newJSNav, btn);
	newJSNav.outerHTML = `<div class="JSNav itemNav active" onclick="click_itemNav(this)" data-type="JS">
								<div>function.js</div>
								<div class="btnNavDel" onclick="click_btnNavDel(this)" data-type="JS">x</div>
							</div>`;

	let parentJSPanel = document.querySelector('.navPanel[data-type="JS"]');
	let newJSPanel = document.createElement('div');
	parentJSPanel.appendChild(newJSPanel);
	newJSPanel.outerHTML = `<div class="JSPanel itemPanel active" onmouseup="click_JSPanel(this)" data-type="JS"></div>`;

	activeNavPanel('JS', index);
	let newMirror = new JSMirror(document.getElementsByClassName('JSPanel')[index]);
	render.pushDataMirror('JS', newMirror);
};

let click_itemNav = (elm) => {
	let type = elm.dataset.type;
	let list = document.querySelectorAll(`.itemNav[data-type="${type}"]`);
	let index = Array.prototype.indexOf.call(list, elm); //Array.from(list).indexOf(elm);
	activeNavPanel(type, index);
};

let click_btnNavDel = (elm) => {
	let e = window.event;
	let type = elm.dataset.type;
	let list = document.querySelectorAll(`.btnNavDel[data-type="${type}"]`);
	let index = Array.from(list).indexOf(elm); //Array.prototype.indexOf.call(list, elm);

	if (render.spliceDataMirror(type, index) == true) {
		let listNav = document.getElementsByClassName(type + 'Nav');
		let listPanel = document.getElementsByClassName(type + 'Panel');
		listNav[index].remove();
		listPanel[index].remove();
		activeNavPanel(type, indexActive - 1);
	}
	e.stopPropagation();
};

let click_hide_itemArea = (id) => {
	let itemArea = document.getElementById(id);
	itemArea.classList.toggle('active');
	resizeArea();
};

//---------------------Header - Button Click---------------------
let click_ClearCode = () => {
	if (render.checkHasValue() == true) {
		if (confirm('Are you sure remove all editor!') == false) {
			return;
		}
	}
	render.clearCode();
};
let click_DemoCode = () => {
	if (render.checkHasValue() == true) {
		if (confirm('Are you sure remove all editor!') == false) {
			return;
		}
	}
	['HTML', 'CSS', 'JS'].forEach((item) => {
		let listNav = document.querySelectorAll('.itemNav[data-type="' + item + '"]');
		let listPanel = document.querySelectorAll('.itemPanel[data-type="' + item + '"]');
		for (let i = 1; i < listNav.length; i++) {
			listNav[i].remove();
			listPanel[i].remove();
		}
		activeNavPanel(item, 0);
	});
	render.demoCode();
	render.formatCode();
};
let click_FormatCode = () => {
	render.formatCode();
};
let click_Rotate = () => {
	rotate++;
	resizeArea();
};
let click_Popup = () => {
	document.body.classList.toggle('hasPopup');
	if (render.popup == null) {
		render.openPopup();
	} else {
		render.closePopup();
	}
};
//---------------------Header - Button Click---------------------

//---------------------JSPanel - Get Debug Text---------------------
let click_JSPanel = (elm) => {
	let list = document.querySelectorAll(`.itemPanel[data-type="JS"]`);
	let index = Array.from(list).indexOf(elm); //Array.prototype.indexOf.call(list, elm);
	let debugText = render.dataMirror['JS'][index].editor.getSelection();
	if (!debugText) return;
	if ([';','{','[',':',',',].includes(debugText.slice(-1))) {
		debugText = debugText.slice(0,-1);
	}
	if (!checkRegexDebug(debugText)) {
		debugText = "'error'"
	};
	render.getDebugText = debugText;
	render.reloadScriptDebug();
};
let checkRegexDebug = (debugText) => {
	let excuteJS = (
		'var const let class new super this ' +
		'for while do in of break continue ' +
		'if else switch case ' +
		'function return ' +
		'try catch finally ' +
		'null default' +
		'debugger delete export extends import instanceof throw typeof void with yield '
	).split(' ');
	if (excuteJS.includes(debugText)) return false;
	if (/[\n;]/.test(debugText)) return false;
	if ((debugText.match(/\[/g) || []).length != (debugText.match(/\]/g) || []).length) return false;
	if ((debugText.match(/{/g) || []).length != (debugText.match(/}/g) || []).length) return false;
	if ((debugText.match(/\'/g) || []).length % 2 != 0) return false;
	if ((debugText.match(/\"/g) || []).length % 2 != 0) return false;
	return true;
};
//---------------------JSPanel - Get Debug Text---------------------

messageFromChildWindow = (msg) => {
	if (msg === 'popup closed') {
		document.body.classList.remove('hasPopup');
		render.closePopup();
	}
};
window.onbeforeunload = function () {
	if (render.popup != null) render.popup.close();
};

let first_run = () => {
	click_hide_itemArea('CSSArea');
	click_hide_itemArea('JSArea');
};
first_run();
