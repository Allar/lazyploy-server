import assert from 'assert';
import app from '../../src/app';

describe('\'upload-build\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload-build');

    assert.ok(service, 'Registered the service');
  });
});
