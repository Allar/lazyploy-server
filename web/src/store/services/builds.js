import feathersClient, {makeServicePlugin, BaseModel} from '../../feathers-client'
  
  class Build extends BaseModel {
    constructor(data, options) {
      super(data, options)
    }
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Build'
    // Define default properties here
    static instanceDefaults() {
      return {
        buildid: 0,
        project: 'n/a',
        desc: '',
        status: '',
        platforms: ''
      }
    }
  }
  const servicePath = 'builds'
  const servicePlugin = makeServicePlugin({
    Model: Build,
    service: feathersClient.service(servicePath),
    servicePath,
    idField: '_id',
    debug: true
  })
  
  // Setup the client-side Feathers hooks.
  feathersClient.service(servicePath).hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },
    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  })
  
  export default servicePlugin