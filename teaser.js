window.addEventListener('load', function() {
	function processDocument() {
		var nodes = document.getElementsByTagName('*');
		for ( var i = 0; i < nodes.length; i++ ) {
			processNode(nodes[i]);
		}
	}
	
	function processNode(node) {
		if ( node.dataset.showAfter ) {
			hide(node);
			scheduleAnimation(node);
		}
		
		if ( node.tagName === 'AUDIO' && node.dataset.playAfter ) {
			schedulePlay(node);
		}
	}
	
	function scheduleAnimation(node) {
		var delay = Number(node.dataset.showAfter) * 1000;
		var duration = node.dataset.fadeFor || 0;
		
		var animate = function() {
			// We only enable the transition right before showing the node, because setting opacity right before setting transition does not seem to have any effect before the transition has been activated, causing the initial hiding of the node to be animated as well.
			enableTransition(node, duration);
			show(node);
		};
		
		// For the same reason given above, we use JavaScript timeouts instead of CSS transition delays.
		window.setTimeout(animate, delay);
	}
	
	function enableTransition(node, duration) {
		['webkit', 'Moz', 'O'].map(function(prefix) {
			node.style[prefix + 'TransitionProperty'] = 'opacity';
			node.style[prefix + 'TransitionDuration'] = duration + 's';
		});
	}
	
	function show(node) {
		node.style.opacity = 1;
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
	
	processDocument();
});