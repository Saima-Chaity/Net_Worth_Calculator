let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server');

chai.use(chaiHttp);

describe('Calculate amount', () => {
   /*
  * Test the /api route
  */
  describe('/GET json data', () => {
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

		it('it should calculate total from data.json file and result can not be null', (done) => {
			chai.request(server)
				.get('/api')
				.end((err, res) => {
					res.body.data.assets.should.not.eql(null);
					res.body.data.liabilities.should.not.eql(null);
					res.body.data.netWorth.should.not.eql(null);
					done();
				});
		});
  });

  /*
  * Test the /api/calculate route
  */
  describe('/POST data', () => {
		it('it should return calulated value', (done) => {
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
				done();
			});
		});

		it('it should handle a invalid input', (done) => {
			let data = {
				updatedAmount: "",
				previousAmount: "e",
				type: "assets"
			}
			chai.request(server)
			.post('/api/calculate')
			.send(data)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.data.assets.should.not.eql(null);
				done();
			});
		});
  });

	/*
  * Test the /api/currencyconversion route
  */
	describe('/Calculate data after currency conversion' , () => {
		const data = {
			"currency": "CAD",
			"selectedCurrency": "EUR",
			"dataNeedsToUpdate": {
				"cashAndInvestments":[
					{
						"category":"Chequing",
						"amount":"2000.00"
					},
					{
						"category":"Saving for Taxes",
						"amount":undefined
					}
				],
				"longTermAssets":[
					{
						"category":"Other",
						"amount":null
					}
				],
				"shortTermLiabilities":[
					{
						"category":"Credit Card 1",
						"monthlyPayment": 200,
						"amount":"NaN"
					}
				],
				"longTermLiabilities":[
					{
						"category":"Investment Loan",
						"monthlyPayment": 700,
						"amount":"100.00"
					}
				]
			}
		}
		it('it should handle a invalid data in payload', (done) => {
			chai.request(server)
			.post('/api/currencyconversion')
			.send(data)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.data.liabilities.should.not.eql(null);
				done();
			});
		});

		it('it should calculate updated data', (done) => {
			chai.request(server)
			.post('/api/currencyconversion')
			.send(data)
			.end((err, res) => {
				res.body.data.assets.should.not.eql(null);
				res.body.data.liabilities.should.not.eql(null);
				res.body.data.netWorth.should.not.eql(null);
				done();
			});
		});
  });
});