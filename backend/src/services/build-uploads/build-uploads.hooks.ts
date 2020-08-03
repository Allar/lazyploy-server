import { HookContext } from '@feathersjs/feathers';
import { NotFound, BadRequest, GeneralError, Conflict } from '@feathersjs/errors';
import { Builds } from '../builds/builds.class';

const setTimestamp = (name: string) => {
  return async (context: HookContext) => {
    context.data[name] = new Date();

    return context;
  };
};

const conformBuildId = () => {
  return async (context: HookContext) => {
    if (context?.params?.query?.buildid !== undefined) {
      context.params.query.buildid = ~~context.params.query.buildid;
      if (context?.data !== undefined) {
        context.data.buildid = context.params.query.buildid;
      }
    }
  };
};

const validateBuildUpload = () => {
  return async (context: HookContext) => {
  
    context.data.platform = context.params.query?.platform;

    context.data.originalFileName = context.params.file.originalname;
    context.data.fspath = context.params.file.path;
    context.data.serveDir = context.params.file.destination.replace(/^(public\/)/,'');
    context.data.filename = context.params.file.filename;

    return context;
  };
};

export default {
  before: {
    all: [conformBuildId()],
    find: [],
    get: [],
    create: [setTimestamp('createdAt'), validateBuildUpload()],
    update: [setTimestamp('updatedAt')],
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
};
