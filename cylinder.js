Cylinder = (function() {
	
	function _c(t, o) {
		this.target = document.getElementById(t);
		this.width = o.width || this.target.offsetWidth;
		this.height = (o.height || this.target.offsetHeight);
		this.chartWidth = this.width/3;
		this.e = {radius_H: this.chartWidth/2, radius_V: 15, x: this.chartWidth/2};	// generic ellypse	
		this.chartHeight = this.height - 2*this.e.radius_V;							// 2D rectangular area available for plotting		
		this.colors = {
			container: {stroke: '#BDD7EE', 'stroke-width': 1},
			segment: [
				{fill: '#BDD7EE', stroke: '#BDD7EE', 'stroke-width': 1},
				{fill: '#5B9BD5', stroke: '#BDD7EE', 'stroke-width': 1},
				{fill: '#1F4E79', stroke: '#BDD7EE', 'stroke-width': 1}				
			],
			noStroke: {'stroke-width': 0}
		};
		
		// box		
		this.paper = Raphael(this.target, this.width, this.height);		
		this.paper.setViewBox(0, 0, this.width, this.height, true);
		
		// chart segments
		this.segments = this.drawSegments(o.points);
		
		// container (empty last segment)
		this.paper.path(["M", 0, this.e.radius_V, "L", 0, this.height-this.e.radius_V]).attr(this.colors.container);
		this.paper.path(["M", this.chartWidth, this.e.radius_V, "L", this.chartWidth, this.height-this.e.radius_V]).attr(this.colors.container);
		this.paper.ellipse(this.e.x, this.e.radius_V, this.e.radius_H, this.e.radius_V).attr(this.colors.container);	
		
		return this;
	}
	_c.prototype = {
		setSegment: function(point, hook_y) {
			var height, y;
			point.height = height = this.chartHeight * parseFloat(point.value);
			point.y = y = hook_y - height;
			return {height: height, y: y};
		},
		drawSegments: function(points) {
			var base_y = this.height - this.e.radius_V,
				i, n, s, segment, bottom_ellypse, top_ellypse, point, href,
				segments = [];
			for (i = 0, n = points.length; i < n; i++) {				
				point = points[i];
				s = this.setSegment(point, base_y);
				segment = this.paper.rect(0, 0, this.chartWidth, 0).attr(this.colors.segment[i]);							
				bottom_ellypse = this.paper.ellipse(this.e.x, base_y, this.e.radius_H, this.e.radius_V).attr(this.colors.segment[i]).attr(this.colors.noStroke);
				top_ellypse = this.paper.ellipse(this.e.x, base_y-s.height, this.e.radius_H, this.e.radius_V).attr(this.colors.segment[i]);
				
				// set link on shape
				if (point.href) {
					href = point.href;
					segment.click(function(){ window.location = href; }).attr({'cursor': 'pointer'});					
					bottom_ellypse.click(function(){ window.location = href; }).attr({'cursor': 'pointer'});					
					top_ellypse.click(function(){ window.location = href; }).attr({'cursor': 'pointer'});
				}
				
				// set labels (arrow or callout)
				if (point.callout) {
					this.callout( point, this.chartWidth, (point.calloutPosition == 'top' ? 2*this.e.radius_V : s.y) );
				}
				if (point.arrowBox) {
					this.arrowBox(point, this.chartWidth+5, s.y);
				}
				
				segments.push(segment.attr(s));
				base_y = segment.attr('y');
			}
			
			return segments;
		},
		arrowBox: function(segment, x, y) {
			// draw text
			var pad = 5,
				txt = this.paper.text(x+3*pad, y, segment.arrowBox).attr({fill: "#fff", font: "12px sans-serif", 'text-anchor': 'start'}),
				bb = txt.getBBox();

			// draw "arrow" box
			var arrow = this.paper.path([
				"M", (x + 2*pad), (y-2*pad),
				"L", (x), (y),
				"L", (x + 2*pad), (y+2*pad),
				"h", (bb.width+2*pad),
				"V", (y-2*pad),
				"Z"
			]).attr({fill: "#5B9BD5", 'stroke-width': 0});
			
			if (segment.href) {
				arrow.click(function(){ window.location = segment.href; }).attr({'cursor': 'pointer'});
				txt.click(function(){ window.location = segment.href; }).attr({'cursor': 'pointer'});
			}

			// text to front
			txt.toFront();			
		},
		callout: function(segment, x, y) {
			var pad = 40,
				txt = this.wrap( this.paper.text(x+pad, y, segment.callout).attr({fill: "#5B9BD5", font: "12px sans-serif", 'text-anchor': 'start'}).attr({'text-anchor': 'start'}) );
				bb = txt.getBBox();		
			
			var path = !!segment.pointerOnTop 
				? ["M", bb.x-5, bb.y, "V", bb.y2, "M", bb.x-5, bb.y, "L", x, segment.y+segment.height/2] 
				: ["M", bb.x-5, bb.y, "V", bb.y2, "L", x, segment.y+segment.height/2];			
			this.paper.path(path).attr({stroke: "#5B9BD5", 'stroke-width': 1});
		},
		wrap: function(t) {
			var words = t.attr('text').split(" "),
				maxWidth = this.width - t.attr('x'),
				tmp = "", w;

			while (words.length > 0) {
				w = words.shift();				
				tmp += w + " ";
				t.attr("text", tmp);
				if (t.getBBox().width > maxWidth) {
					tmp = tmp.replace(w, "\n");
					words.unshift(w);
				}
			}
			t.attr("text", tmp);
			return t;
		}
	};
	
	return {
		plot: function(target, options) {
			return new _c(target, options);
		}
	};
	
}());