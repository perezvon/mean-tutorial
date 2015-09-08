'use strict';

// Inv codes controller
angular.module('inv-codes').controller('InvCodesController', ['$scope', '$stateParams', '$location', 'Authentication', 'InvCodes',
	function($scope, $stateParams, $location, Authentication, InvCodes) {
		$scope.authentication = Authentication;

		// Create new Inv code
		$scope.create = function() {
			// Create new Inv code object
			var invCode = new InvCodes ({
				name: this.name
			});

			// Redirect after save
			invCode.$save(function(response) {
				$location.path('inv-codes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Inv code
		$scope.remove = function(invCode) {
			if ( invCode ) { 
				invCode.$remove();

				for (var i in $scope.invCodes) {
					if ($scope.invCodes [i] === invCode) {
						$scope.invCodes.splice(i, 1);
					}
				}
			} else {
				$scope.invCode.$remove(function() {
					$location.path('inv-codes');
				});
			}
		};

		// Update existing Inv code
		$scope.update = function() {
			var invCode = $scope.invCode;

			invCode.$update(function() {
				$location.path('inv-codes/' + invCode._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Inv codes
		$scope.find = function() {
			$scope.invCodes = InvCodes.query();
		};

		// Find existing Inv code
		$scope.findOne = function() {
			$scope.invCode = InvCodes.get({ 
				invCodeId: $stateParams.invCodeId
			});
		};
	}
]);