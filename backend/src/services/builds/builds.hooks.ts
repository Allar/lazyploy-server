import { HookContext } from '@feathersjs/feathers';
import { NotFound } from '@feathersjs/errors';

const setTimestamp = (name: string) => {
  return async (context: HookContext) => {
    context.data[name] = new Date();

    return context;
  };
};

const setBuildId = () => {
  return async (context: HookContext) => {

    const latestbuild = await context.app.service('builds').find({
      query: {
        $limit: 1,
        $sort: {
          createdAt: -1
        }
      }
    });

    let mostRecentBuildId = 0;
    mostRecentBuildId = latestbuild?.data[0]?.buildid ?? 0;
    context.data.buildid = mostRecentBuildId + 1;

    return context;
  };
};

const prepareBuildUpdateViaBuildId = () => {
  return async (context: HookContext) => {
    const existingbuild = await context.app.service('builds').find({
      query: {
        $limit: 1,
        buildid: +(context.id ?? 0)
      }
    });

    if (existingbuild?.data[0] == undefined) {
      throw new NotFound('build not found');
    }

    const newBuild = context.data;

    context.data = existingbuild.data[0];
    context.data.status = newBuild.status;    

    context.id = existingbuild.data[0]._id;
    return context;
  };
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [setTimestamp('createdAt'), setBuildId()],
    update: [prepareBuildUpdateViaBuildId(), setTimestamp('updatedAt')],
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
