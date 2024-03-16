import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

const app = import('../app'); // Import your Express app

const expect = chai.expect;
chai.use(chaiHttp);

describe('User Routes', () => {
  describe('POST /register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').equals('User registered successfully');
          done();
        });
    });
  });
});



describe('Login API', () => {
  it('should return a JWT token when logging in with valid credentials', (done) => {
    chai.request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('accessToken');
        done();
      });
  });

  it('should return an error message when logging in with invalid credentials', (done) => {
    chai.request(app)
      .post('/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('User not found');
        done();
      });
  });
});


describe('Comments API', () => {
  it('should create a new comment', (done) => {
    chai.request(app)
      .post('/comments/add')
      .send({
        profile: 'testuser', 
        comment: 'Test comment'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.body).to.equal('Test comment');
        done();
      });
  });

  it('should retrieve all comments', (done) => {
    chai.request(app)
      .get('/comments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('comments');
        expect(res.body.comments).to.be.an('array');
        done();
      });
  });
});


describe('Favorite API', () => {
  let commentId; // Will store the ID of the comment created in the previous test case

  before((done) => {
    // Create a new comment for testing
    chai.request(app)
      .post('/comments/add')
      .send({
        profile: 'testuser', // Replace with existing user profile
        comment: 'Test comment' // Replace with the comment you want to add
      })
      .end((err, res) => {
        commentId = res.body.comment._id;
        done();
      });
  });

  it('should favorite a comment', (done) => {
    chai.request(app)
      .post('/favorite')
      .send({ comment: { id: commentId } }) // Pass the ID of the comment created in the before hook
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.favorites).to.equal(1); // Assuming the initial value is 0
        done();
      });
  });

  it('should unfavorite a comment', (done) => {
    chai.request(app)
      .post('/unfavorite')
      .send({ comment: { id: commentId } }) // Pass the ID of the comment created in the before hook
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.favorites).to.equal(0); // Assuming the initial value is 1
        done();
      });
  });
});