const print = console.log

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

const expo = (x) => { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
    var channelA = colorChannelA*amountToMix;
    var channelB = colorChannelB*(1-amountToMix);
    return parseInt(channelA+channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMix(hexB, hexA, amountToMix){
	let conv = (hex) => {
		if (hex.includes("#")) {
			hex = hex.substring(1)
		}

		let r = parseInt(hex[0]+hex[1], 16)
		let g = parseInt(hex[2]+hex[3], 16)
		let b = parseInt(hex[4]+hex[5], 16)

		return [r, g, b]
	}
	let rgbA = conv(hexA)
	let rgbB = conv(hexB)

    var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);

    return "rgb("+r+","+g+","+b+")";
}

Array.prototype.remove = function (index) {
    if (index > -1 && index < this.length-1) {
    	var return_value = this.splice(index, 1)
    	return return_value
    }
}

var buttons = []

function make_button(btn_name, btn_link) {
	let img = new Image()
	img.src = `../../shoutout_assets/m_${btn_name}.png`

	var button = {
		name: btn_name,
		link: btn_link,
		sym: img,
		x: 0,
		y: 0,
		i_a: 0,
		add_a: 0,
		h_timer: 0,
		v_timer: 0
	}

	buttons.push(button)
	return button
}

// document.getElementById("notif").onclick = e => {
//   window.open()
// }