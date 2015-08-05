var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res) {
	console.log("statistics_controller.index");
	var stats = {
		quiz_count:	0,
		comm_count: 0,
		quiz_comm_avg: 0,
		quiz_within_count: 0,
		quiz_without_count: 0
	};

	models.Quiz.count().then(function(count) {
		stats.quiz_count = count;
		models.Comment.count().then(function(count) {
			stats.comm_count = count;
			stats.quiz_comm_avg = stats.quiz_count==0 ? 0 : (stats.comm_count/stats.quiz_count).toFixed(2);
      
			models.Quiz.count({include: [{ model: models.Comment, required:true }], distinct: true}).then(function(count) {
				stats.quiz_within_count = count;
				stats.quiz_without_count = stats.quiz_count - count;
				res.render('statistics/index', {stats: stats, errors: []});
			}).catch(function(error){next(error)});
		}).catch(function(error){next(error)});
	}).catch(function(error){next(error)});
};
