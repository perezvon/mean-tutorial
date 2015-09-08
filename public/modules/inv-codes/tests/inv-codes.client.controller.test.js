'use strict';

(function() {
	// Inv codes Controller Spec
	describe('Inv codes Controller Tests', function() {
		// Initialize global variables
		var InvCodesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Inv codes controller.
			InvCodesController = $controller('InvCodesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Inv code object fetched from XHR', inject(function(InvCodes) {
			// Create sample Inv code using the Inv codes service
			var sampleInvCode = new InvCodes({
				name: 'New Inv code'
			});

			// Create a sample Inv codes array that includes the new Inv code
			var sampleInvCodes = [sampleInvCode];

			// Set GET response
			$httpBackend.expectGET('inv-codes').respond(sampleInvCodes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.invCodes).toEqualData(sampleInvCodes);
		}));

		it('$scope.findOne() should create an array with one Inv code object fetched from XHR using a invCodeId URL parameter', inject(function(InvCodes) {
			// Define a sample Inv code object
			var sampleInvCode = new InvCodes({
				name: 'New Inv code'
			});

			// Set the URL parameter
			$stateParams.invCodeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/inv-codes\/([0-9a-fA-F]{24})$/).respond(sampleInvCode);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.invCode).toEqualData(sampleInvCode);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(InvCodes) {
			// Create a sample Inv code object
			var sampleInvCodePostData = new InvCodes({
				name: 'New Inv code'
			});

			// Create a sample Inv code response
			var sampleInvCodeResponse = new InvCodes({
				_id: '525cf20451979dea2c000001',
				name: 'New Inv code'
			});

			// Fixture mock form input values
			scope.name = 'New Inv code';

			// Set POST response
			$httpBackend.expectPOST('inv-codes', sampleInvCodePostData).respond(sampleInvCodeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Inv code was created
			expect($location.path()).toBe('/inv-codes/' + sampleInvCodeResponse._id);
		}));

		it('$scope.update() should update a valid Inv code', inject(function(InvCodes) {
			// Define a sample Inv code put data
			var sampleInvCodePutData = new InvCodes({
				_id: '525cf20451979dea2c000001',
				name: 'New Inv code'
			});

			// Mock Inv code in scope
			scope.invCode = sampleInvCodePutData;

			// Set PUT response
			$httpBackend.expectPUT(/inv-codes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/inv-codes/' + sampleInvCodePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid invCodeId and remove the Inv code from the scope', inject(function(InvCodes) {
			// Create new Inv code object
			var sampleInvCode = new InvCodes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Inv codes array and include the Inv code
			scope.invCodes = [sampleInvCode];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/inv-codes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInvCode);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.invCodes.length).toBe(0);
		}));
	});
}());