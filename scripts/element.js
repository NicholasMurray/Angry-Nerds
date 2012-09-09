// element.js

function element(id) {
	if (document.getElementById == null) {
		if (document.all == null) {
			if (document.layers == null) {
				return null;
			}
			return document.layers[id];
		}
		return document.all[id];
	}
	return document.getElementById(id);
}
  