'use strict';

// Subcategories controller
angular.module('subcategories').controller('SubcategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subcategories',
	function($scope, $stateParams, $location, Authentication, Subcategories) {
		$scope.authentication = Authentication;

		// Create new Subcategory
		$scope.create = function() {
			// Create new Subcategory object
			var subcategory = new Subcategories ({
				name: this.name
			});

			// Redirect after save
			subcategory.$save(function(response) {
				$location.path('subcategories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subcategory
		$scope.remove = function(subcategory) {
			if ( subcategory ) { 
				subcategory.$remove();

				for (var i in $scope.subcategories) {
					if ($scope.subcategories [i] === subcategory) {
						$scope.subcategories.splice(i, 1);
					}
				}
			} else {
				$scope.subcategory.$remove(function() {
					$location.path('subcategories');
				});
			}
		};

		// Update existing Subcategory
		$scope.update = function() {
			var subcategory = $scope.subcategory;

			subcategory.$update(function() {
				$location.path('subcategories/' + subcategory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Subcategories
		$scope.find = function() {
			$scope.subcategories = Subcategories.query();
		};

		// Find existing Subcategory
		$scope.findOne = function() {
			$scope.subcategory = Subcategories.get({ 
				subcategoryId: $stateParams.subcategoryId
			});
		};
	}
]);