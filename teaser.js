window.addEventListener('load', function() {
	function processDocument() {
		var nodes = document.getElementsByTagName('*');
		for ( var i = 0; i < nodes.length; i++ ) {
			processNode(nodes[i]);
		}
	}
	
	function processNode(node) {
		if ( node.dataset.delayFor ) {
			hide(node);
			scheduleShow(node);
		}
		
		if ( node.tagName === 'AUDIO' && node.dataset.playAfter ) {
			schedulePlay(node);
		}
	}
	
	function scheduleShow(node) {
		var delay = showDelay(node);
		var fadeDuration = node.dataset.fadeInFor || 0;
		
		var animate = function() {
			// Style changes don't seem to take effect immediately, so we delay setting transitions until we know that the node has been hidden.
			enableTransition(node, fadeDuration);
			show(node);
			scheduleHide(node);
		};
		
		// For the same reason given above, we use JavaScript timeouts instead of CSS transition delays.
		window.setTimeout(animate, delay);
	}
	
	function scheduleHide(node) {
		var delay = hideDelay(node);
		var fadeDuration = node.dataset.fadeOutFor || 0;
		
		if ( delay !== Infinity ) {
			var animate = function() {
				// Style changes don't seem to take effect immediately, so we delay setting transitions until we know that the node has been hidden.
				enableTransition(node, fadeDuration);
				hide(node);
			}
			window.setTimeout(animate, delay);
		}
	}
	
	function enableTransition(node, fadeDuration) {
		['webkit', 'Moz', 'O'].map(function(prefix) {
			node.style[prefix + 'TransitionProperty'] = 'opacity';
			node.style[prefix + 'TransitionDuration'] = fadeDuration + 's';
		});
	}
	
	function show(node) {
		node.style.opacity = 0.999;
	}
	
	function hide(node) {
		node.style.opacity = 0;
	}
	
	function schedulePlay(node) {
		var delay = Number(node.dataset.playAfter) * 1000;
		var play = function() {
			node.play();
		}
		window.setTimeout(play, delay);
	}
	
	// The time in milliseconds when the node should be shown, taking into account (possibly nested) data-show-following values.
	function showDelay(node) {
		var delay = Number(node.dataset.delayFor) * 1000;
		
		var otherNodeId = node.dataset.showAfter;
		if ( otherNodeId ) {
			var otherNode = document.getElementById(otherNodeId);
			if ( otherNode ) {
				delay += showDelay(otherNode);
			} else {
				throw new Error('Node cannot be shown following non-existing node with ID "' + otherNodeId + '.');
			}
		}
		
		return delay;
	}
	
	// The time in milliseconds when the node should be hidden, counting from the time it was shown.
	function hideDelay(node) {
		if ( 'showFor' in node.dataset ) {
			return Number(node.dataset.showFor) * 1000;
		} else {
			return Infinity;
		}
	}
	
	processDocument();
});