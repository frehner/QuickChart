(function() {
	var app = angular.module('playingApp', []);

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}];

	var svgwidth = 500;
	var svgheight = 500;
	var barheight = 45;

	var drawGraphFunc = function(newItems){

		var scale = d3.scale.linear()
							.domain([0, d3.max(newItems, function(d){
								return d.number;
							})])
							.range([0,svgwidth]);
				
		var drawContainer = d3.select("drawing-div")

		drawContainer.selectAll("*")
						.remove();

		var svg = drawContainer.append("svg")
								.attr("width", svgwidth)
								.attr("height", svgheight);

		var group = svg.selectAll("g")
						.data(newItems)
						.enter()
						.append("g")
						.attr("transform", function(d,i){
							return "translate(0, "+i*(barheight+5)+")";
						});

		group.append("rect")
				.transition()
				.delay(function(d, i){
					return (i+1)*500;
				})
				.duration(1000)
				.attr("height", barheight)
				.attr("fill", "steelblue")
				.attr("width", function(d){
					return scale(d.number);
				});

		group.append("text")
				.attr("x", function(d){
					return 5;
				})
				.attr("y", barheight/2)
				.attr("dy", ".35em")
				.text(function(d){
					return d.label;
				});
	};

	app.controller('ItemsController', function($scope){
		$scope.allItems = items;
		$scope.item = {};

		$scope.addItem = function(){
			$scope.allItems.push($scope.item);

			//clear the form
			$scope.item = {};

			//make the form pristine so that the css doesn't apply anymore
			$scope.addItemForm.$setPristine();

			drawGraphFunc($scope.allItems);
		};
	});

	//this should draw it the first time with default data
	app.directive('drawingDiv', function(){
		return {
			restrict:'E', 
			link: drawGraphFunc(items)
		};
	});


})();
