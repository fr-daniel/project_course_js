'use strict';

var express = require('express');
var router = express.Router();
var data = [ 
  {
    image: 'http://www.fiat.com.br/content/dam/fiat-brasil/desktop/produtos/modelos/358/versoes/358A4H0/178.png',
    brandModel: 'Fiat',
    year: 2017,
    plate: 'AAA-211',
    color: 'Red'
  },
  {
    image: 'http://www.fiat.com.br/content/dam/fiat-brasil/desktop/produtos/modelos/358/versoes/358A4H0/178.png',
    brandModel: 'Ford',
    year: 2017,
    plate: 'AAA-211',
    color: 'Red'
  }
];

router.get('/', function(req, res) {
  res.json(data);
});

router.post('/', function(req, res) {
  data.push({
    image: req.body.image,
    brandModel: req.body.brandModel,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color 
  });
  res.json({ message: 'success' });
});

module.exports = router;
