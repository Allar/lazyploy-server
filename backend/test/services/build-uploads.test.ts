import assert from 'assert';
import app from '../../src/app';

describe('\'buildUploads\' service', () => {
  it('registered the service', () => {
    const service = app.service('buildUploads');

    assert.ok(service, 'Registered the service');
  });
});
