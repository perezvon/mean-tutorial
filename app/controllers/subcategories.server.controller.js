'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subcategory = mongoose.model('Subcategory'),
	_ = require('lodash');

/**
 * Create a Subcategory
 */
exports.create = function(req, res) {
	var subcategory = new Subcategory(req.body);
	subcategory.user = req.user;

	subcategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * Show the current Subcategory
 */
exports.read = function(req, res) {
	res.jsonp(req.subcategory);
};

/**
 * Update a Subcategory
 */
exports.update = function(req, res) {
	var subcategory = req.subcategory ;

	subcategory = _.extend(subcategory , req.body);

	subcategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * Delete an Subcategory
 */
exports.delete = function(req, res) {
	var subcategory = req.subcategory ;

	subcategory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * List of Subcategories
 */
exports.list = function(req, res) { 
	Subcategory.find().sort('-created').populate('user', 'displayName').exec(function(err, subcategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategories);
		}
	});
};

/**
 * Subcategory middleware
 */
exports.subcategoryByID = function(req, res, next, id) { 
	Subcategory.findById(id).populate('user', 'displayName').exec(function(err, subcategory) {
		if (err) return next(err);
		if (! subcategory) return next(new Error('Failed to load Subcategory ' + id));
		req.subcategory = subcategory ;
		next();
	});
};

/**
 * Subcategory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.subcategory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
