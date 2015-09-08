'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	InvCode = mongoose.model('InvCode'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, invCode;

/**
 * Inv code routes tests
 */
describe('Inv code CRUD tests', function() {
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

		// Save a user to the test db and create new Inv code
		user.save(function() {
			invCode = {
				name: 'Inv code Name'
			};

			done();
		});
	});

	it('should be able to save Inv code instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inv code
				agent.post('/inv-codes')
					.send(invCode)
					.expect(200)
					.end(function(invCodeSaveErr, invCodeSaveRes) {
						// Handle Inv code save error
						if (invCodeSaveErr) done(invCodeSaveErr);

						// Get a list of Inv codes
						agent.get('/inv-codes')
							.end(function(invCodesGetErr, invCodesGetRes) {
								// Handle Inv code save error
								if (invCodesGetErr) done(invCodesGetErr);

								// Get Inv codes list
								var invCodes = invCodesGetRes.body;

								// Set assertions
								(invCodes[0].user._id).should.equal(userId);
								(invCodes[0].name).should.match('Inv code Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Inv code instance if not logged in', function(done) {
		agent.post('/inv-codes')
			.send(invCode)
			.expect(401)
			.end(function(invCodeSaveErr, invCodeSaveRes) {
				// Call the assertion callback
				done(invCodeSaveErr);
			});
	});

	it('should not be able to save Inv code instance if no name is provided', function(done) {
		// Invalidate name field
		invCode.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inv code
				agent.post('/inv-codes')
					.send(invCode)
					.expect(400)
					.end(function(invCodeSaveErr, invCodeSaveRes) {
						// Set message assertion
						(invCodeSaveRes.body.message).should.match('Please fill Inv code name');
						
						// Handle Inv code save error
						done(invCodeSaveErr);
					});
			});
	});

	it('should be able to update Inv code instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inv code
				agent.post('/inv-codes')
					.send(invCode)
					.expect(200)
					.end(function(invCodeSaveErr, invCodeSaveRes) {
						// Handle Inv code save error
						if (invCodeSaveErr) done(invCodeSaveErr);

						// Update Inv code name
						invCode.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Inv code
						agent.put('/inv-codes/' + invCodeSaveRes.body._id)
							.send(invCode)
							.expect(200)
							.end(function(invCodeUpdateErr, invCodeUpdateRes) {
								// Handle Inv code update error
								if (invCodeUpdateErr) done(invCodeUpdateErr);

								// Set assertions
								(invCodeUpdateRes.body._id).should.equal(invCodeSaveRes.body._id);
								(invCodeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Inv codes if not signed in', function(done) {
		// Create new Inv code model instance
		var invCodeObj = new InvCode(invCode);

		// Save the Inv code
		invCodeObj.save(function() {
			// Request Inv codes
			request(app).get('/inv-codes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Inv code if not signed in', function(done) {
		// Create new Inv code model instance
		var invCodeObj = new InvCode(invCode);

		// Save the Inv code
		invCodeObj.save(function() {
			request(app).get('/inv-codes/' + invCodeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', invCode.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Inv code instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inv code
				agent.post('/inv-codes')
					.send(invCode)
					.expect(200)
					.end(function(invCodeSaveErr, invCodeSaveRes) {
						// Handle Inv code save error
						if (invCodeSaveErr) done(invCodeSaveErr);

						// Delete existing Inv code
						agent.delete('/inv-codes/' + invCodeSaveRes.body._id)
							.send(invCode)
							.expect(200)
							.end(function(invCodeDeleteErr, invCodeDeleteRes) {
								// Handle Inv code error error
								if (invCodeDeleteErr) done(invCodeDeleteErr);

								// Set assertions
								(invCodeDeleteRes.body._id).should.equal(invCodeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Inv code instance if not signed in', function(done) {
		// Set Inv code user 
		invCode.user = user;

		// Create new Inv code model instance
		var invCodeObj = new InvCode(invCode);

		// Save the Inv code
		invCodeObj.save(function() {
			// Try deleting Inv code
			request(app).delete('/inv-codes/' + invCodeObj._id)
			.expect(401)
			.end(function(invCodeDeleteErr, invCodeDeleteRes) {
				// Set message assertion
				(invCodeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Inv code error error
				done(invCodeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		InvCode.remove().exec();
		done();
	});
});