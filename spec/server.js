var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');
var mocha = require('mocha');

var app = require('../app.js');
var Developer = require('../db/Developer.js');
var Extension = require('../db/Extension.js');

describe('Server Tests', function() {
  afterEach(function(done) {
    // delete objects from db so they can be created for tests
    Developer.remove({ 'email': 'eugene@gmail.com' }).exec();
    Extension.remove({'name':'slack'}).exec();
    done();
  });

  describe('Routing: ', function() {
    beforeEach(function(done) {
      var ext = new Extension({'name':'slack','description':'dasdasdf','iconURL':'http://google.com/favicon.ico',commands:[]});
      ext.save();
      done();
    });

    it('Developer Signup', function(done) {
      request(app)
        .post('/developer')
        .send({
          'email':'eugene@gmail.com',
          'password':'asdfasdf'
        })
        .expect(201)
        .end(done);
    });

    it('Gets extensions', function(done) {
      request(app)
        .get('/extension')
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).to.equal(11)
        })
        .end(done);
    });

    it('Search extensions', function(done) {
      request(app)
        .get('/extension?name=sl')
        .expect(200)
        .expect(function(res) {
          expect(res.body.length).to.equal(1)
        })
        .end(done);
    });

    it('Voice command', function(done) {
      request(app)
        .post('/command')
        .send({
          transcript: "asdfasdf"
        })
        .expect(500)
        .expect(function(res) {
          expect(typeof res.body.length).to.equal('undefined')
        })
        .end(done);
    })
  });  // Account creation
});