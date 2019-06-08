const request = require('supertest');
const app = require('./app')


//testing all the possible cases
describe('Test the get method', () => {
    test('It should response the with the status code 405 ', (done) => {
        request(app).get('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(405);
            done();
        });
    });
});


describe('Test the /inbound/sms when the all parameter sent and are correct', () => {
    test('It should response the with the status code 200 and it should respond with inbound sms ok', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"16052299352",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({ message: 'inbound sms ok' });
            done();
        });
    });
});


describe('Test the /inbound/sms when the "to" phone number is not sent as a parameter', () => {
    test('It should response the with the status code 200 and it should be responded with error: "to is missing"', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "to is missing"});
            done();
        });
    });
});


describe('Test the /inbound/sms when the "to" phone number sent is invalid', () => {
    test('It should response the with the status code 200 and it should be responded with error:to is invalid', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"16055555555555555552299352",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "to is invalid"});
            done();
        });
    });
});

describe('Test the /inbound/sms when the "from" is not sent', () => {
    test('It should response the with the status code 200 and it should be responded with error:from is missing', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            to:"16052299352",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "from is missing"});
            done();
        });
    });
});

describe('Test the /inbound/sms when the "from" phone number is not valid', () => {
    test('It should response the with the status code 200 and it should be responded with error: "from is invalid"', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343",
            to:"16052299352",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "from is invalid"});
            done();
        });
    });
});

describe('Test the /inbound/sms when the "msg" text is missing from the parameter sent', () => {
    test('It should response the with the status code 200 and it should be responded with error: msg is missing', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"16052299352"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "msg is missing"});
            done();
        });
    });
});

describe('Test the /inbound/sms when the "msg" text is invalid or very big in size', () => {
    test('It should response the with the status code 200 and it should be responded with error: "msg is invalid"', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"16052299352",
            text:""
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "msg is invalid"});
            done();
        });
    });
});
describe('Test the /inbound/sms when the "msg" text is invalid or very big in size', () => {
    test('It should response the with the status code 200 and it should be responded with error: "msg is invalid"', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"16052299352",
            text:"ith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be respondedith the status code 200 and it should be responded"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "msg is invalid"});
            done();
        });
    });
});

describe('Test the /inbound/sms when the "to" phone number is not the number from the authorization account', () => {
    test('It should response the with the status code 200 and it should be responded with error:to paramter not found', (done) => {
        request(app).post('/inbound/sms')
        .set('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6cjIiLCJwYXNzd29yZCI6IjU0UDJFT0tRNDciLCJpYXQiOjE1NTk5NzcxNjd9.5J_doInM69UF5QLB5Mj6acIM6fPwhNdt5mM5mHq8Uqc')
        .set('Content-Type','application/json')
        .send({
            from:"343456789",
            to:"111605229352",
            text:"hello"
        }) 
        .then((response) => {
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({error: "to parameter not found"});
            done();
        });
    });
});
