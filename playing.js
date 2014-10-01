(function() {
	var app = angular.module('playingApp', []);

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}];

	var graphTypes = [{'type':'Horizontal Bar Chart'}, {'type':'Vertical Bar Chart'}];

	var svgwidth = 500;
	var svgheight = 500;
	var barheight = 45;

	var topGraphType = 1;

	var drawGraphFunc = function(newItems){

		var drawContainer = d3.select("drawing-div");

		drawContainer.selectAll("*")
						.remove();

		var svg = drawContainer.append("svg")
								.attr("width", svgwidth)
								.attr("height", svgheight);

		
		switch (topGraphType) {
			case 2:
				//vertical bar chart

				var scale = d3.scale.linear()
							.domain([0, d3.max(newItems, function(d){
								return d.number;
							})])
							.range([svgwidth,0]);

				var group = svg.selectAll("g")
								.data(newItems)
								.enter()
								.append("g")
								.attr("transform", function(d,i) {
									return "translate("+i*(barheight+5)+", 0)";
								});

				group.append("rect")
						.transition()
						.delay(function(d,i){
							return (i+1)*500;
						})
						.duration(1000)
						.attr("y", function(d){
							return scale(d.number);
						})
						.attr("height", function(d){
							return svgheight - scale(d.number);
						})
						.attr("width", barheight)
						.attr("fill", "steelblue");

				group.append("text")
						.attr("x", barheight/2)
						.attr("y", 5)
						.attr("dx", ".35em")
						.text(function(d){
							return d.label;
						});
				break;

			default:
				//horizontal bar chart

				var scale = d3.scale.linear()
							.domain([0, d3.max(newItems, function(d){
								return d.number;
							})])
							.range([0,svgwidth]);

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
				break;
		}
		
	};

	app.controller('ItemsController', function($scope){
		//vars
		$scope.allItems = items;
		$scope.allGraphTypes = graphTypes;
		$scope.item = {};
		$scope.graphType = 1;

		//functions
		$scope.addItem = function(){
			$scope.allItems.push($scope.item);

			//clear the form
			$scope.item = {};

			//make the form pristine so that the css doesn't apply anymore
			$scope.addItemForm.$setPristine();
		};

		$scope.removeItem = function(itemIndex) {
			$scope.allItems.splice(itemIndex, 1);
		};

		$scope.setGraphType = function(newGraphTypeNumber) {
			$scope.graphType = newGraphTypeNumber;
		};

		$scope.activeGraphType = function(checkGraphType) {
			return $scope.graphType == checkGraphType;
		};

		//watchers on vars
		$scope.$watchCollection('allItems', drawGraphFunc);
		$scope.$watch('graphType', function() {
			topGraphType = $scope.graphType;
			drawGraphFunc($scope.allItems);
		});
	});

	//this should draw it the first time with default data
	app.directive('drawingDiv', function(){
		return {
			restrict:'E',
			link: drawGraphFunc(items)
		};
	});


})();
