let flexContainer = document.getElementsByClassName('flex-container')[0];
let flexItem = document.getElementsByClassName('flex-item');

document.querySelectorAll('input[type=checkbox]').forEach((item) => {
	item.onchange = () => {
		if(item.checked) {
			document.getElementsByClassName(item.value)[0].style.display = "";
		}
		else {
			document.getElementsByClassName(item.value)[0].style.display = "none";
		}
	}
});

document.querySelectorAll("input[type=radio][name='flex-direction']").forEach((item) => {
	item.onchange = () => {
		flexContainer.style.flexDirection = item.value;
	}
});

document.querySelectorAll("input[type=radio][name='flex-wrap']").forEach((item) => {
	item.onchange = () => {
		flexContainer.style.flexWrap = item.value;
	}
});

document.querySelectorAll("input[type=radio][name='justify-content']").forEach((item) => {
	item.onchange = () => {
		flexContainer.style.justifyContent = item.value;
	}
});

document.querySelectorAll("input[type=radio][name='align-content']").forEach((item) => {
	item.onchange = () => {
		flexContainer.style.alignContent = item.value;
	}
});

document.querySelectorAll("input[type=radio][name='align-items']").forEach((item) => {
	item.onchange = () => {
		flexContainer.style.alignItems = item.value;
	}
});

let selectList = document.querySelector("select[name='select-list']");
let ip_alignSelf = document.querySelectorAll("input[type='radio'][name='align-self']");

ip_alignSelf.forEach((item) => {
	item.onchange = () => {
		let itemChoose = document.getElementsByClassName(selectList.value)[0];
		itemChoose.style.alignSelf = item.value;
	}
});

selectList.onchange = () => {
	ip_alignSelf.forEach((i) => (i.checked = false));
	let itemChoose = document.getElementsByClassName(selectList.value)[0];
	let temp = itemChoose.style.alignSelf;
	let ipRadio = document.querySelector("input[type='radio'][name='align-self'][value='" + temp + "']");
	if (ipRadio) {
		ipRadio.checked = true;
	}
}
