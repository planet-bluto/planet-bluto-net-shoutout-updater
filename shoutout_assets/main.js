// { LIST OF THINGS TO DO }
// [ ] Fix very glaring scaling issues
// [ ] Decide what goes on each page
// [ ] Header title on the main page maybe...

const MainCanvas = document.getElementById("main")
var ctx = MainCanvas.getContext('2d')

const BKG = "#151515"
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
var CENT_X = 0
var CENT_Y = 0
var frame = 0
var g_a = 0
var mouse = {
	x: 0,
	y: 0,
	link: null
}

var fuck_elon_popup_open = false

// var buttons = [
// 	make_button("games", "https://planet-bluto.itch.io/"),
// // 	make_button("videos", "https://www.youtube.com/@PlanetBluto"),
// 	make_button("music", "https://soundcloud.com/planet_bluto"),
// // 	make_button("art", "https://planet-bluto.notion.site/8e6e4f399d0248b8a030a548620c0c29?v=5ceb3e34a3fb49348e6399a394cf6ad7"),
// 	make_button("coding", "https://github.com/planet-bluto"),
// // 	make_button("rivals", "https://planet-bluto.notion.site/Rivals-of-Aether-Workshop-ee3535b34b6c40acb018e324cf484b81"),
// 	make_button("discord", "https://discord.gg/qURpZp5KwJ"),
// 	make_button("twitter", "https://twitter.com/PlanetBlutonium"),
// 	make_button("que", "fuck_elon"),
// 	make_button("twitch", "https://twitch.tv/planet_bluto/"),
// ]
var star_buffer = []

function clear() {
	ctx.fillStyle = BKG
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function randi(max) {
  return Math.floor(Math.random() * max);
}

for (let i = 0; i < 400; i++) {
	star_buffer.push({
		start_x: randi(WIDTH*2)-(WIDTH/2),
		start_y: randi(HEIGHT*2)-(HEIGHT/2),
		amp: randi(50) + 50,
		x: 0,
		y: 0,
	})
}

function update() {
  requestAnimationFrame(update)
  
	WIDTH = window.innerWidth
	HEIGHT = window.innerHeight
	MainCanvas.width = WIDTH
	MainCanvas.height = HEIGHT
	clear()
	let s = 10
	// obj.x = (Math.cos(frame/s)*r) - (Math.cos(frame/s)*r)/2
	// obj.y = (Math.sin(frame/s)*r) - (Math.sin(frame/s)*r)/2
	frame++

	star_buffer.forEach((star, i) => {
		let r = 6
		ctx.fillStyle = '#353535'
		ctx.beginPath()
		ctx.ellipse(star.start_x+star.x, star.start_y+star.y, r, r, 0, 0, 2 * Math.PI)
		ctx.fill()
		star.x = Math.cos(frame/200)*150
		star.y = Math.sin(frame/200)*150
	})

	g_a = -18+(frame/15)
	buttons.forEach((button, i, arr) => {
		let size = arr.length
		let a = g_a*(Math.PI/180)
		let a_2 = (g_a+(360/(size*2)))*(Math.PI/180)
		button.x = ((HEIGHT/2)-40 - 80)*(Math.cos(a+((2 * Math.PI)/size)*i))+WIDTH/2
		button.y = ((HEIGHT/2)-40 - 80)*(Math.sin(a+((2 * Math.PI)/size)*i))+HEIGHT/2
		let a_2_x = ((HEIGHT/2)-40 - 80)*(Math.cos(a_2+((2 * Math.PI)/size)*i))+WIDTH/2
		let a_2_y = ((HEIGHT/2)-40 - 80)*(Math.sin(a_2+((2 * Math.PI)/size)*i))+HEIGHT/2

		ctx.lineWidth = 8

		let base_r = 70
		let s_r = 20

		button.hovering = ((Math.sqrt( (mouse.x - button.x)**2 + (mouse.y - button.y)**2 ) < base_r) && (fuck_elon_popup_open == false))
		if (button.hovering) {
			if (button.h_timer < 0) { button.h_timer = 0 }
			button.h_timer++
			if (button.h_timer == 1) { mouse.link = button.link; print(mouse.link) }
			button.v_timer += 0.03
		} else {
			if (button.h_timer > 0) { button.h_timer = 0 }
			button.h_timer--
			if (button.h_timer == -1) { mouse.link = null; print("no...") }
			if (button.v_timer > 0.1) {
				button.v_timer /= 1.1
			} else {
				button.v_timer = 0
			}
		}

		let v = expo(clamp(button.v_timer, 0, 1))
		let r = base_r + v*15

		ctx.drawImage(button.sym, button.x-r, button.y-r, r*2, r*2)
		
		var PALETTE = {
		  DROP_SHADOW: "#00177D",
		  DROP_SHADOW_L: "#0A89FF",
		  INNER_CIRC: "#0A89FF",
		  INNER_CIRC_L: "#98DCFF",
		  RING: "#024aca",
		  RING_L: "#5BA8FF"
		}
		
		if (button.name == "que") {
		  PALETTE = {
  		  DROP_SHADOW: "#f68f37",
  		  DROP_SHADOW_L: "#ffbb31",
  		  INNER_CIRC: "#ffe737",
  		  INNER_CIRC_L: "#eeffa9",
  		  RING: "#ffbb31",
  		  RING_L: "#ffe737"
  		}
		}

		ctx.beginPath()
		ctx.ellipse(button.x-(ctx.lineWidth/2), button.y+(ctx.lineWidth/2), r, r, 0, 0, 2 * Math.PI)
		ctx.strokeStyle = colorMix(PALETTE.DROP_SHADOW, PALETTE.DROP_SHADOW_L, v)
		ctx.stroke()

		let o_x = (Math.cos(button.i_a)*r)+button.x
		let o_y = (Math.sin(button.i_a)*r)+button.y
		ctx.beginPath()
		ctx.ellipse(o_x-(ctx.lineWidth/2), o_y+(ctx.lineWidth/2), s_r, s_r, 0, 0, 2 * Math.PI)
		ctx.strokeStyle = colorMix(PALETTE.DROP_SHADOW, PALETTE.DROP_SHADOW_L, v)
		ctx.stroke()

		let o_x_2 = (Math.cos(button.i_a+Math.PI)*r)+button.x
		let o_y_2 = (Math.sin(button.i_a+Math.PI)*r)+button.y
		ctx.beginPath()
		ctx.ellipse(o_x_2-(ctx.lineWidth/2), o_y_2+(ctx.lineWidth/2), s_r, s_r, 0, 0, 2 * Math.PI)
		ctx.strokeStyle = colorMix(PALETTE.DROP_SHADOW, PALETTE.DROP_SHADOW_L, v)
		ctx.stroke()

		ctx.beginPath()
		ctx.ellipse(button.x, button.y, r, r, 0, 0, 2 * Math.PI)
		ctx.strokeStyle = colorMix(PALETTE.RING, PALETTE.RING_L, v)
		ctx.stroke()

		ctx.beginPath()
		ctx.ellipse(o_x, o_y, s_r, s_r, 0, 0, 2 * Math.PI)
		ctx.strokeStyle = colorMix(PALETTE.RING, PALETTE.RING_L, v)
		ctx.fillStyle = colorMix(PALETTE.INNER_CIRC, PALETTE.INNER_CIRC_L, v)
		ctx.fill()
		ctx.stroke()

		ctx.beginPath()
		ctx.ellipse(o_x_2, o_y_2, s_r, s_r, 0, 0, 2 * Math.PI)
		ctx.fillStyle = colorMix(PALETTE.INNER_CIRC, PALETTE.INNER_CIRC_L, v)
		ctx.fill()
		ctx.strokeStyle = colorMix(PALETTE.RING, PALETTE.RING_L, v)
		ctx.stroke()

		ctx.lineWidth = 2
		ctx.textBaseline = "middle"
		ctx.textAlign = "center"
		ctx.font = '48px comic sans ms'
		ctx.strokeStyle = "#ffffff00"
		ctx.strokeText(button.name, button.x, button.y)

		ctx.beginPath()
		ctx.ellipse(a_2_x, a_2_y, 12, 12, 0, 0, 2 * Math.PI)
		ctx.fillStyle = "#0A89FF"
		ctx.fill()
		ctx.lineWidth = 8
		ctx.strokeStyle = "#024ACA"
		ctx.stroke()

		if (button.hovering) {
		  let speed_up = 0.005
			if ((button.add_a + speed_up) < 0.09) {
			  button.add_a += speed_up
			} else {
			  button.add_a = 0.09
			}
		} else {
			if (button.add_a > 0.01) {
			  button.add_a /= 1.05
			} else {
			  button.add_a = 0
			}
		}
		button.i_a += (0.01 + button.add_a)
	})
}

// function makeLink(name, link) {
// 	document.getElementById(`fuck-you-elon-button-${name}`).onclick = e => {
// 		e.preventDefault()
// 		window.open(link, "_blank")
// 	}
// }

// makeLink("tumblr", "https://planet-bluto.tumblr.com/")
// makeLink("newgrounds", "https://blutonium.newgrounds.com/")
// makeLink("bluesky", "https://bsky.app/profile/planet-bluto.neocities.org")
// makeLink("cohost", "https://cohost.org/PlanetBluto")

MainCanvas.onmousemove = (e) => {
	mouse.x = e.x
	mouse.y = e.y
}

MainCanvas.onmousedown = (e) => {
	if (fuck_elon_popup_open == false && mouse.link != null) {
	  if (mouse.link == "fuck_elon") {
	    fuck_elon_popup_open = true

	    var fuck_elon_popup_elem = document.getElementById("fuck-you-elon-popup")
	    fuck_elon_popup_elem.setAttribute("opened", true)
	  } else {
	    window.open(mouse.link, "blank_")
	  }
	}
}

// document.getElementById("fuck-you-elon-backdrop").onclick = e => {
// 	e.preventDefault()

// 	fuck_elon_popup_open = false

// 	var fuck_elon_popup_elem = document.getElementById("fuck-you-elon-popup")
// 	fuck_elon_popup_elem.setAttribute("opened", false)
// }

// setInterval(update, 17)
update()