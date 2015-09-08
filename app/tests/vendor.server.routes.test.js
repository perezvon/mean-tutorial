'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vendor = mongoose.model('Vendor'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vendor;

/**
 * Vendor routes tests
 */
describe('Vendor CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Vendor
		user.save(function() {
			vendor = {
				name: 'Vendor Name'
			};

			done();
		});
	});

	it('should be able to save Vendor instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vendor
				agent.post('/vendors')
					.send(vendor)
					.expect(200)
					.end(function(vendorSaveErr, vendorSaveRes) {
						// Handle Vendor save error
						if (vendorSaveErr) done(vendorSaveErr);

						// Get a list of Vendors
						agent.get('/vendors')
							.end(function(vendorsGetErr, vendorsGetRes) {
								// Handle Vendor save error
								if (vendorsGetErr) done(vendorsGetErr);

								// Get Vendors list
								var vendors = vendorsGetRes.body;

								// Set assertions
								(vendors[0].user._id).should.equal(userId);
								(vendors[0].name).should.match('Vendor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vendor instance if not logged in', function(done) {
		agent.post('/vendors')
			.send(vendor)
			.expect(401)
			.end(function(vendorSaveErr, vendorSaveRes) {
				// Call the assertion callback
				done(vendorSaveErr);
			});
	});

	it('should not be able to save Vendor instance if no name is provided', function(done) {
		// Invalidate name field
		vendor.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vendor
				agent.post('/vendors')
					.send(vendor)
					.expect(400)
					.end(function(vendorSaveErr, vendorSaveRes) {
						// Set message assertion
						(vendorSaveRes.body.message).should.match('Please fill Vendor name');
						
						// Handle Vendor save error
						done(vendorSaveErr);
					});
			});
	});

	it('should be able to update Vendor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vendor
				agent.post('/vendors')
					.send(vendor)
					.expect(200)
					.end(function(vendorSaveErr, vendorSaveRes) {
						// Handle Vendor save error
						if (vendorSaveErr) done(vendorSaveErr);

						// Update Vendor name
						vendor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vendor
						agent.put('/vendors/' + vendorSaveRes.body._id)
							.send(vendor)
							.expect(200)
							.end(function(vendorUpdateErr, vendorUpdateRes) {
								// Handle Vendor update error
								if (vendorUpdateErr) done(vendorUpdateErr);

								// Set assertions
								(vendorUpdateRes.body._id).should.equal(vendorSaveRes.body._id);
								(vendorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vendors if not signed in', function(done) {
		// Create new Vendor model instance
		var vendorObj = new Vendor(vendor);

		// Save the Vendor
		vendorObj.save(function() {
			// Request Vendors
			request(app).get('/vendors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vendor if not signed in', function(done) {
		// Create new Vendor model instance
		var vendorObj = new Vendor(vendor);

		// Save the Vendor
		vendorObj.save(function() {
			request(app).get('/vendors/' + vendorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vendor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vendor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vendor
				agent.post('/vendors')
					.send(vendor)
					.expect(200)
					.end(function(vendorSaveErr, vendorSaveRes) {
						// Handle Vendor save error
						if (vendorSaveErr) done(vendorSaveErr);

						// Delete existing Vendor
						agent.delete('/vendors/' + vendorSaveRes.body._id)
							.send(vendor)
							.expect(200)
							.end(function(vendorDeleteErr, vendorDeleteRes) {
								// Handle Vendor error error
								if (vendorDeleteErr) done(vendorDeleteErr);

								// Set assertions
								(vendorDeleteRes.body._id).should.equal(vendorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vendor instance if not signed in', function(done) {
		// Set Vendor user 
		vendor.user = user;

		// Create new Vendor model instance
		var vendorObj = new Vendor(vendor);

		// Save the Vendor
		vendorObj.save(function() {
			// Try deleting Vendor
			request(app).delete('/vendors/' + vendorObj._id)
			.expect(401)
			.end(function(vendorDeleteErr, vendorDeleteRes) {
				// Set message assertion
				(vendorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vendor error error
				done(vendorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Vendor.remove().exec();
		done();
	});
});