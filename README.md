Cylinder charts for RaphaelJS
==============
Create cylindric charts, with labels and callout.

Check **index.html** for more info on how to use it.

Demo also on: http://matteopiazza.org/stuff/code/raphaeljs_cylinder_chart


<script src="https://github.com/arcadeJHS/raphaeljs_cylinder_chart/blob/master/raphael-min.js"></script>
<script src="https://github.com/arcadeJHS/raphaeljs_cylinder_chart/blob/master/cylinder.js"></script>
<script>

	window.onload = function() {
	
		var options = {
			//height: 160,
			//width: 100,
			values: [0.1, 0.3, 0.1],
			points: [
				{value: 0.1, callout: "Label for chart segment 1", pointerOnTop: true},
				{value: 0.3, arrowBox: "XXX value", href:"http://www.google.com"},
				{value: 0.1, callout: "Label for chart segment 2", calloutPosition: 'top'}
			]
		};	

		var graph_1 = Cylinder.plot("graph_1", options);			
		
	};
			
</script>

<div style="position: relative;">
	<div id="graph_1" style="box-sizing: border-box; width: 380px; height: 160px;"></div>
</div>
