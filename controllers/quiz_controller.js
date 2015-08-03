var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  console.log("quiz_controller.load quizId="+quizId);
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  var search = req.query.search;
  console.log("quiz_controller.index search="+search);
  if (search == null) {
	  models.Quiz.findAll().then(
		function(quizes) {
		  res.render('quizes/index', { quizes: quizes, search: ''});
		}
	  ).catch(function(error) { next(error);})
  }
  else {
	  //sustituimos ' ' por '%'
	  search = '%' + search.replace(' ','%') + '%';
	  console.log("quiz_controller.search="+search);
	  models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
		function(quizes) {
		  res.render('quizes/index', { quizes: quizes, search: req.query.search});
		}
	  ).catch(function(error) { next(error);})
  }
};

exports.search = function(req, res) {
  //parametro
  var search = '%'+req.query.search+'%';
  //sustituimos ' ' por '%'
  search = search.replace(' ','%');
  console.log("quiz_controller.search="+search);
  models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes});
    }
  ).catch(function(error) { next(error);})
}

// GET /quizes/:id
exports.show = function(req, res) {
  console.log("quiz_controller.show");
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  console.log("quiz_controller.answer quiz.pregunta="+req.quiz.pregunta);
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
