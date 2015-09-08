'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inv code Schema
 */
var InvCodeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Inv code name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('InvCode', InvCodeSchema);