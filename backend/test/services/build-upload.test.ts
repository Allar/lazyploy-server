import assert from 'assert';
import app from '../../src/app';

describe('\'build-upload\' service', () => {
  it('registered the service', () => {
    const service = app.service('build-upload');

    assert.ok(service, 'Registered the service');
  });
});
