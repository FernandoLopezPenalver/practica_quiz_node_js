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
  console.log("quiz_controller.index search="+req.query.search);
  var search;
  var consulta = {};
  if (req.query.search) {
	  search = (req.query.search || '').replace(" ", "%");
	  consulta = { where: ["lower(pregunta) like lower(?)", '%'+search+'%'], order: 'pregunta ASC' };
  }
  models.Quiz.findAll(consulta)
	.then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes, errors: [], search: req.query.search || '' });
	}).catch(function(error) { next(error); });
};

// GET /quizes/:id
exports.show = function(req, res) {
  console.log("quiz_controller.show");
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  console.log("quiz_controller.answer quiz.pregunta="+req.quiz.pregunta);
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer', 
    { quiz: req.quiz, 
      respuesta: resultado, 
      errors: []
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  console.log("quiz_controller.new");
  var quiz = models.Quiz.build(
    {pregunta: "", respuesta: ""}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	console.log("quiz_controller.create");
	var quiz = models.Quiz.build( req.body.quiz );

	quiz.validate().then( function(err) {
		if (err){
			res.render('quizes/new',{ quiz: quiz, errors: err.errors });
		} else {
			// save: guarda en DB campos pregunta y respuesta de quiz
			quiz
				.save({ fields: ["pregunta", "respuesta", "tematica"] })
				.then(function() {
					res.redirect('/quizes');
				}); // res.redirect: Redirección HTTP a lista de preguntas
		}
	}).catch(function(error){next(error)});
  
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  console.log("quiz_controller.edit");
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  console.log("quiz_controller.update");
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};
