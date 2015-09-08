'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	InvCode = mongoose.model('InvCode'),
	_ = require('lodash');

/**
 * Create a Inv code
 */
exports.create = function(req, res) {
	var invCode = new InvCode(req.body);
	invCode.user = req.user;

	invCode.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invCode);
		}
	});
};

/**
 * Show the current Inv code
 */
exports.read = function(req, res) {
	res.jsonp(req.invCode);
};

/**
 * Update a Inv code
 */
exports.update = function(req, res) {
	var invCode = req.invCode ;

	invCode = _.extend(invCode , req.body);

	invCode.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invCode);
		}
	});
};

/**
 * Delete an Inv code
 */
exports.delete = function(req, res) {
	var invCode = req.invCode ;

	invCode.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invCode);
		}
	});
};

/**
 * List of Inv codes
 */
exports.list = function(req, res) { 
	InvCode.find().sort('-created').populate('user', 'displayName').exec(function(err, invCodes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invCodes);
		}
	});
};

/**
 * Inv code middleware
 */
exports.invCodeByID = function(req, res, next, id) { 
	InvCode.findById(id).populate('user', 'displayName').exec(function(err, invCode) {
		if (err) return next(err);
		if (! invCode) return next(new Error('Failed to load Inv code ' + id));
		req.invCode = invCode ;
		next();
	});
};

/**
 * Inv code authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.invCode.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
