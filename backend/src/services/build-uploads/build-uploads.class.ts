import { Params } from '@feathersjs/feathers';
import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application, BuildUpload } from '../../declarations';
import { BadRequest } from '@feathersjs/errors';

export class BuildUploads extends Service<BuildUpload> {

  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);

    this.app = app;
  }

  async create (data: BuildUpload, params?: Params): Promise<BuildUpload | BuildUpload[]> {
    const { buildid, originalFileName, fspath, serveDir, platform, filename, createdAt, updatedAt } = data;
    
    const buildData = {
      buildid,
      originalFileName,
      fspath,
      serveDir,
      filename,
      platform,
      createdAt,
      updatedAt
    };

    return super.create(buildData, params);
  }
};
