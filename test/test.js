const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('/Users/sharath/Downloads/Task 8.2HD/server.js');
const ioClient = require('socket.io-client');

const should = chai.should();
chai.use(chaiHttp);

describe('CourseSelectionApp', () => {
    describe('/POST submit', () => {
        it('it should POST a course selection', (done) => {
            const course = { unit: 'SIT725' };
            chai.request(server)
                .post('/submit')
                .send(course)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Form submitted successfully');
                    done();
                });
        });

        it('it should not POST a course selection without unit field', (done) => {
            const course = {};
            chai.request(server)
                .post('/submit')
                .send(course)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET health', () => {
        it('should check if the server is up', (done) => {
            chai.request(server)
                .get('/health')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    done();
                });
        });
    });

    // Testing socket connection
    describe('Socket.io', () => {
        it('should communicate', (done) => {
            const client = ioClient.connect('http://localhost:3000', {
                'reconnection delay': 0,
                'reopen delay': 0,
                'force new connection': true
            });

            client.on('connect', () => {
                console.log('connected to server');
            });

            client.on('serverMessage', (msg) => {
                msg.should.equal('Connected to the server via WebSocket.');
                client.disconnect();
                done();
            });

            client.on('disconnect', () => {
                console.log('disconnected from server');
            });
        });
    });
});
