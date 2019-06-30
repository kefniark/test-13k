export function getColor(hex) {
	return '#' + ('000000' + hex.toString(16)).substr(-6)
}
