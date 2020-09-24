const app = require('../src/app');

describe('App', () => {
  it('GET /email responds with 400 when body does not have key "emails"', () => {
    const testEmails = {
      e: [
        'nicktho@gmaik.com',
        'nick.tho+rpe@gmaik.com',
        'nick.thorpe@gmail.com',
        'nickthorpe@gmail.com',
        'te.st+spam@gmail.com',
        'test@gmail.com',
        'test@test.com'
      ]
    };

    return supertest(app)
      .get('/email')
      .set('Content-Type', 'application/json')
      .send(testEmails)
      .expect(400, { error: 'Body must include key "emails" whose corrisponding value is an array of strings' });
  });

  it('GET /email responds with 400 when no string is provided', () => {
    const testEmails = { emails: 12 };

    return supertest(app)
      .get('/email')
      .set('Content-Type', 'application/json')
      .send(testEmails)
      .expect(400, { error: 'Body must include key "emails" whose corrisponding value is an array of strings' });
  });


  it('GET /email responds with 200 containing correct integer', () => {
    const testEmails = {
      emails: [
        'nicktho@gmaik.com',
        'nick.tho+rpe@gmaik.com',
        'nick.thorpe@gmail.com',
        'nickthorpe@gmail.com',
        'te.st+spam@gmail.com',
        'test@gmail.com',
        'test@test.com'
      ]
    };

    return supertest(app)
      .get('/email')
      .set('Content-Type', 'application/json')
      .send(testEmails)
      .expect(200, { count: 5 });
  });
});