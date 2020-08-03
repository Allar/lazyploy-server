// Initializes the `builds` service on path `/builds`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Builds } from './builds.class';
import createModel from '../../models/builds.model';
import hooks from './builds.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'builds': Builds & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/builds', new Builds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('builds');

  service.hooks(hooks);
}
