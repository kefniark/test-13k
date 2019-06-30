import { tween, time, onAfterUpdate, delta, onUpdate } from 'micro-fatina'
import { createSprite } from './sprite'
import { getColor } from './helpers'

var PI = Math.PI,
	PI2 = PI * 2
var el = document.querySelector('#canvas')
var c = el.getContext('2d')
c.width = 1280
c.height = 720
c.mozImageSmoothingEnabled = false
c.imageSmoothingEnabled = false

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

	c.font = '14px Arial'
	c.fillStyle = 'black'
	c.fillText(x + ':' + y, posx, posy - 30)
}

var getId = (x, y) => (y - 1) * 5 + x - 1

var data = []
for (var x = 1; x < 6; x++) {
	for (var y = 1; y < 20; y++) {
		data[getId(x, y)] = Math.floor(Math.random() * 0x1000000)
	}
}

var render = (xOffset, yOffset, r) => {
	c.resetTransform()
	c.clearRect(0, 0, 1280, 720)
	c.rotate((r * PI) / 180)
	for (var x = 1; x < 6; x++) {
		for (var y = 1; y < 20; y++) {
			var yDiff = Math.floor(y / 2)
			if (y % 2 == 0) {
				drawPoly(x, y, 150 * x - 100 + xOffset, 86 * yDiff + 20 + yOffset, 50, getColor(data[getId(x, y)]))

				var i = 150 * x - 100 + xOffset
				var j = 86 * yDiff + 20 + yOffset
				c.translate(i, j)
				c.rotate((30 * PI) / 180)
				c.drawImage(sprite2.canvas, -32, -32, 64, 64)
				c.rotate(-(30 * PI) / 180)
				c.translate(-i, -j)
			} else {
				drawPoly(x, y, 150 * x - 25 + xOffset, 43 + 86 * yDiff + 20 + yOffset, 50, getColor(data[getId(x, y)]))

				var i = 150 * x - 25 + xOffset
				var j = 43 + 86 * yDiff + 20 + yOffset
				c.translate(i, j)
				c.rotate((30 * PI) / 180)
				c.drawImage(sprite.canvas, -32, -32, 64, 64)
				c.rotate(-(30 * PI) / 180)
				c.translate(-i, -j)
			}
		}
	}
}

window.onresize = resize
resize()

var obj = { x: -2000, y: 150 }
tween(obj, { x: -150, y: 100 }, 1.5)

// create a sprite with different layers
var sprite = createSprite(
	[
		// color 1 : 4x4
		['FF00', 1],
		// color 2 : 8x8
		['FF0AF0F0FFFFF0F0', 2],
		// color 3 : 16x16
		['8A0020805DDEA040478FF0F0FF4FF0F0FF2FF0F0FF3FF0BCA7465020AC86F0F0', 4],
		// color 4 : 32x32
		[
			'00000000000000000000000000000000406080A0C000000000000000000000008A0020805DDEA040478FF0F0FF4FF0F0FF2FF0F0FF3FF0BCA7465020AC86F0F000000000000000000000000000000000000000000000000000000000000000008A0020805DDEA040478FF0F0FF4FF0F0FF2FF0F0FF3FF0BCA7465020AC86F0F0',
			8,
		],
	],
	// color palette
	[0xfcfcfc, 0x0051a8, 0x87cdff, 0xfff39e]
)

var sprite2 = createSprite(
	[['662d', 1], ['3b541ec48969266ada8eb3d62c7591cb9443f085427d8b681927f86e792a6aca', 4]],
	[0xfcfcfc, 0x0051a8, 0x87cdff]
)

// render
onAfterUpdate(() => render(obj.x, obj.y, -30 + 5 * Math.sin(time * 0.001)))

var cooldown = 2
onUpdate(() => {
	cooldown -= delta * 0.001
	if (cooldown >= 0) return
	cooldown += 2

	// change hexagons
	var params = {}
	for (var x = 1; x < 6; x++) {
		for (var y = 1; y < 16; y++) {
			params[getId(x, y)] = Math.floor(Math.random() * 0x1000000)
		}
	}

	var t = tween(data, params, 0.5)
	t.type = 'color'

	// tween sprite color
	var t = tween(
		sprite.palette,
		{
			0: Math.floor(Math.random() * 0x1000000),
			1: Math.floor(Math.random() * 0x1000000),
			2: Math.floor(Math.random() * 0x1000000),
			3: Math.floor(Math.random() * 0x1000000),
		},
		1.5
	)
	t.type = 'color'
	t.onUpdated.push(() => (sprite.dirty = true))
})
