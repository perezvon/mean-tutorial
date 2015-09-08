'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subcategory = mongoose.model('Subcategory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subcategory;

/**
 * Subcategory routes tests
 */
describe('Subcategory CRUD tests', function() {
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

		// Save a user to the test db and create new Subcategory
		user.save(function() {
			subcategory = {
				name: 'Subcategory Name'
			};

			done();
		});
	});

	it('should be able to save Subcategory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subcategory
				agent.post('/subcategories')
					.send(subcategory)
					.expect(200)
					.end(function(subcategorySaveErr, subcategorySaveRes) {
						// Handle Subcategory save error
						if (subcategorySaveErr) done(subcategorySaveErr);

						// Get a list of Subcategories
						agent.get('/subcategories')
							.end(function(subcategoriesGetErr, subcategoriesGetRes) {
								// Handle Subcategory save error
								if (subcategoriesGetErr) done(subcategoriesGetErr);

								// Get Subcategories list
								var subcategories = subcategoriesGetRes.body;

								// Set assertions
								(subcategories[0].user._id).should.equal(userId);
								(subcategories[0].name).should.match('Subcategory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subcategory instance if not logged in', function(done) {
		agent.post('/subcategories')
			.send(subcategory)
			.expect(401)
			.end(function(subcategorySaveErr, subcategorySaveRes) {
				// Call the assertion callback
				done(subcategorySaveErr);
			});
	});

	it('should not be able to save Subcategory instance if no name is provided', function(done) {
		// Invalidate name field
		subcategory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subcategory
				agent.post('/subcategories')
					.send(subcategory)
					.expect(400)
					.end(function(subcategorySaveErr, subcategorySaveRes) {
						// Set message assertion
						(subcategorySaveRes.body.message).should.match('Please fill Subcategory name');
						
						// Handle Subcategory save error
						done(subcategorySaveErr);
					});
			});
	});

	it('should be able to update Subcategory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subcategory
				agent.post('/subcategories')
					.send(subcategory)
					.expect(200)
					.end(function(subcategorySaveErr, subcategorySaveRes) {
						// Handle Subcategory save error
						if (subcategorySaveErr) done(subcategorySaveErr);

						// Update Subcategory name
						subcategory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subcategory
						agent.put('/subcategories/' + subcategorySaveRes.body._id)
							.send(subcategory)
							.expect(200)
							.end(function(subcategoryUpdateErr, subcategoryUpdateRes) {
								// Handle Subcategory update error
								if (subcategoryUpdateErr) done(subcategoryUpdateErr);

								// Set assertions
								(subcategoryUpdateRes.body._id).should.equal(subcategorySaveRes.body._id);
								(subcategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Subcategories if not signed in', function(done) {
		// Create new Subcategory model instance
		var subcategoryObj = new Subcategory(subcategory);

		// Save the Subcategory
		subcategoryObj.save(function() {
			// Request Subcategories
			request(app).get('/subcategories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Subcategory if not signed in', function(done) {
		// Create new Subcategory model instance
		var subcategoryObj = new Subcategory(subcategory);

		// Save the Subcategory
		subcategoryObj.save(function() {
			request(app).get('/subcategories/' + subcategoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', subcategory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Subcategory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subcategory
				agent.post('/subcategories')
					.send(subcategory)
					.expect(200)
					.end(function(subcategorySaveErr, subcategorySaveRes) {
						// Handle Subcategory save error
						if (subcategorySaveErr) done(subcategorySaveErr);

						// Delete existing Subcategory
						agent.delete('/subcategories/' + subcategorySaveRes.body._id)
							.send(subcategory)
							.expect(200)
							.end(function(subcategoryDeleteErr, subcategoryDeleteRes) {
								// Handle Subcategory error error
								if (subcategoryDeleteErr) done(subcategoryDeleteErr);

								// Set assertions
								(subcategoryDeleteRes.body._id).should.equal(subcategorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Subcategory instance if not signed in', function(done) {
		// Set Subcategory user 
		subcategory.user = user;

		// Create new Subcategory model instance
		var subcategoryObj = new Subcategory(subcategory);

		// Save the Subcategory
		subcategoryObj.save(function() {
			// Try deleting Subcategory
			request(app).delete('/subcategories/' + subcategoryObj._id)
			.expect(401)
			.end(function(subcategoryDeleteErr, subcategoryDeleteRes) {
				// Set message assertion
				(subcategoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Subcategory error error
				done(subcategoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Subcategory.remove().exec();
		done();
	});
});