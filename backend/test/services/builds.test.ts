import assert from 'assert';
import app from '../../src/app';

describe('\'builds\' service', () => {
  it('registered the service', () => {
    const service = app.service('builds');

    assert.ok(service, 'Registered the service');
  });
});
