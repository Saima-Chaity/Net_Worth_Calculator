const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var fetch = require('node-fetch');
let server = require('../server');
const testData = require('./testData.json');

chai.use(chaiHttp);

describe('Calculate amount', () => {
   /*
  * Test the /api route
  */
  describe('Get data from json file and calculate initial total', () => {
		it('it should get data.json file', (done) => {
			chai.request(server)
				.get('/api')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');
					res.body.should.have.property('data');
					res.body.data.should.have.property('assets');
					res.body.data.should.have.property('liabilities');
					res.body.data.should.have.property('netWorth');
					done();
				});
		});
  });

  /*
  * Test the /api/calculate route
  */
  describe('Post data for edited row', () => {
		it('it should return calulated value for type assets', (done) => {
			let data = {
				updatedAmount: "1000",
				previousAmount: "500",
				type: "assets"
			}
			chai.request(server)
			.post('/api/calculate')
			.send(data)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.data.assets.should.not.eql(null);
				res.body.data.liabilities.should.not.eql(null);
				res.body.data.netWorth.should.not.eql(null);
				done();
			});
		});

		it('it should handle a invalid input and result should not be null', (done) => {
			let data = {
				updatedAmount: "",
				previousAmount: "e",
				type: "liability"
			}
			chai.request(server)
			.post('/api/calculate')
			.send(data)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.data.assets.should.not.eql(null);
				res.body.data.liabilities.should.not.eql(null);
				res.body.data.netWorth.should.not.eql(null);
				done();
			});
		});
  });

	/*
  * Test the /api/currencyconversion route
  */
	describe('Calculate data after currency conversion' , () => {
		const data = {
			"currency": "CAD",
			"selectedCurrency": "EUR",
			"dataNeedsToUpdate": testData,
		}
		
		it('it should call conversion API', async () => {
			const callResponse = await fetch(`https://api.exchangeratesapi.io/latest?base=${data.currency}`, {
				method:'get',
			})
			const response = await callResponse.json()
			expect(response).to.haveOwnPropertyDescriptor("rates")
		});
		
		it('result should not be null', (done) => {
			chai.request(server)
			.post('/api/currencyconversion')
			.send(data)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.data.assets.should.not.eql(null);
				res.body.data.liabilities.should.not.eql(null);
				res.body.data.netWorth.should.not.eql(null);
				res.body.data.updatedRows.should.be.a('object')
				done();
			});
		});
  });
});