var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer',   quizController.answer);

/*get author*/
router.get('/author', function(req, res) {
  res.render('author', { name: 'Fernando López Peñalver' });
});

module.exports = router;