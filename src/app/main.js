import { tween, time, onAfterUpdate, delta, onUpdate } from 'micro-fatina'

var PI = Math.PI,
	PI2 = PI * 2
var el = document.querySelector('#canvas')
var c = el.getContext('2d')
c.width = 1280
c.height = 720

function resize() {
	var s = el.style
	var r = window.innerWidth / window.innerHeight
	if (r <= 1280 / 720) {
		s.width = '100vw'
		s.height = '56.25vw'
		s.marginTop = '-28.125vw'
		s.marginLeft = '0vw'
		s.top = '50vh'
		s.left = '0vh'
	} else {
		s.width = '177vh'
		s.height = '100vh'
		s.marginTop = '0vh'
		s.marginLeft = '-88.5vh'
		s.top = '0vw'
		s.left = '50vw'
	}
}

function drawPoly(x, y, posx, posy, size, color) {
	c.beginPath()
	c.moveTo(posx + size * Math.cos(0), posy + size * Math.sin(0))

	for (var side = 0; side < 7; side++) {
		c.lineTo(posx + size * Math.cos((side * PI2) / 6), posy + size * Math.sin((side * PI2) / 6))
	}

	c.fillStyle = color
	c.fill()

	c.font = '18px Arial'
	c.fillStyle = 'white'
	c.fillText(x + ':' + y, posx - 15, posy + 5)
}

var getId = (x, y) => (y - 1) * 5 + x - 1
var getColor = hex => '#' + ('000000' + hex.toString(16)).substr(-6)

var data = []
for (var x = 1; x < 6; x++) {
	for (var y = 1; y < 16; y++) {
		data[getId(x, y)] = Math.floor(Math.random() * 0x1000000)
	}
}

var render = (xOffset, yOffset, r) => {
	c.resetTransform()
	c.clearRect(0, 0, 1280, 720)
	c.rotate((r * PI) / 180)
	for (var x = 1; x < 6; x++) {
		for (var y = 1; y < 16; y++) {
			var yDiff = Math.floor(y / 2)
			if (y % 2 == 0) {
				drawPoly(x, y, 150 * x - 100 + xOffset, 86 * yDiff + 20 + yOffset, 50, getColor(data[getId(x, y)]))
			} else {
				drawPoly(x, y, 150 * x - 25 + xOffset, 43 + 86 * yDiff + 20 + yOffset, 50, getColor(data[getId(x, y)]))
			}
		}
	}
}

window.onresize = resize
resize()

var obj = { x: -2000, y: 150 }
tween(obj, { x: -150, y: 100 }, 1.5)

onAfterUpdate(() => render(obj.x, obj.y, -30 + 5 * Math.sin(time * 0.001)))

var cooldown = 2
onUpdate(() => {
	cooldown -= delta * 0.001
	if (cooldown >= 0) return
	cooldown += 2

	var params = {}
	for (var x = 1; x < 6; x++) {
		for (var y = 1; y < 16; y++) {
			params[getId(x, y)] = Math.floor(Math.random() * 0x1000000)
		}
	}

	var t = tween(data, params, 0.5)
	t.type = 'color'
})
