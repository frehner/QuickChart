(function() {
	var app = angular.module('playingApp', []);

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}];

	var svgwidth = 500;
	var svgheight = 500;
	var barheight = 15;

	var drawGraphFunc = function(scope, element, attrs){
				
		var svg = d3.select(element[0])
					.append("svg")
					.attr("width", svgwidth)
					.attr("height", svgheight);

		var group = svg.selectAll("g")
						.data(items)
						.enter()
						.append("g")
						.attr("transform", function(d,i){
							return "translate(0, "+i*(barheight+5)+")";
						});

		group.append("rect")
				.attr("width", function(d){
					return d.number;
				})
				.attr("height", barheight)
				.attr("fill", "steelblue");
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
		};
	});

	//this should draw it the first time
	app.directive('drawingDiv', function(){
		return {
			restrict:'E', 
			link: drawGraphFunc
		};
	});


})();
