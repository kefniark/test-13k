import { getColor } from './helpers'
import { onUpdate } from 'micro-fatina'

export function createSprite(data, palette = [0xffffff]) {
	var layers = []

	var canvas = document.createElement('canvas')
	canvas.width = 32
	canvas.height = 32
	var ctx = canvas.getContext('2d')
	ctx.mozImageSmoothingEnabled = false
	ctx.imageSmoothingEnabled = false

	for (var entry of data) {
		var str = entry[0]
		var size = entry[1]
		var sub = _createSubSprite(ctx, str, size)
		layers.push(sub)
	}

	var sprite = {
		canvas,
		ctx,
		palette,
		layers,
		dirty: true,
		render: function() {
			if (!this.dirty) return
			this.dirty = false
			var i = 0
			this.ctx.clearRect(0, 0, 32, 32)
			for (var layer of this.layers) {
				layer.render(this.palette[i] || palette[0])
				i += 1
			}
		},
	}

	onUpdate(() => sprite.render())

	return sprite
}

function _createSubSprite(ctx, str, size = 2) {
	var index = 0
	var y = 0
	var data = []

	while (str.length > index) {
		var val = parseInt(str.slice(index, index + 4), 16, 10)
		for (var i = 0; i < 16; i++) {
			if (val & Math.pow(2, i)) {
				data[y * 16 + i] = 1
			}
		}
		y += 1
		index += 4
	}

	var sprite = {
		ctx,
		data,
		size,
		render: function(color) {
			for (var index in this.data) {
				if (!this.data[index]) continue
				var block = Math.floor(index / 16)
				var inside = index % 16
				var x = (block % this.size) * 4 + (inside % 4)
				var y = Math.floor(block / this.size) * 4 + Math.floor(inside / 4)
				this.ctx.fillStyle = getColor(color)
				var subSize = 1
				if (this.size == 4) subSize = 2
				if (this.size == 2) subSize = 4
				if (this.size == 1) subSize = 8
				this.ctx.fillRect(x * subSize, y * subSize, subSize, subSize)
			}
		},
	}

	return sprite
}
