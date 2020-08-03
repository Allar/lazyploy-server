/* eslint-disable @typescript-eslint/no-extra-semi */
import { Params, Id } from '@feathersjs/feathers';
import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application, BuildData } from '../../declarations';
import { NotFound, BadRequest } from '@feathersjs/errors';

export class Builds extends Service<BuildData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars

  app: Application

  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);

    this.app = app;
  }

  async update(id: Id, data: BuildData, params?: Params) : Promise<BuildData> {
    const existingBuild = await (this.app.service('builds') as Builds).find({
      query: {
        $limit: 1,
        buildid: id
      }
    });
    
    if (existingBuild == undefined) {
      throw new NotFound('ass not found');
    }

    return super.update(id, data, params);
  }

  async create (data: BuildData, params?: Params): Promise<BuildData | BuildData[]> {
    const { project, buildid, createdAt, updatedAt } = data;
    let { desc, status, platforms } = data;

    if (project == undefined) {
      throw new BadRequest('project field is required');
    }

    const regexpProject = /^[\w\ ]{2,}\b$/;
    if (!regexpProject.test(project)) {
      throw new BadRequest('project must be alphanumeric and at least two characters long');
    }


    desc = desc || 'No Description';
    status = status || 'Waiting for status update...';
    platforms = '';
    
    const buildData = {
      project,
      desc,
      status,
      platforms,
      buildid,
      createdAt,
      updatedAt
    };

    console.log('Created build: ' + project);

    return super.create(buildData, params);
  }
};
