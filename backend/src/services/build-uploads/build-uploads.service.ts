// Initializes the `buildUploads` service on path `/buildUploads`
import { ServiceAddons, Paginated } from '@feathersjs/feathers';
import { Application, BuildData, BuildUpload } from '../../declarations';
import { BuildUploads } from './build-uploads.class';
import createModel from '../../models/build-uploads.model';
import hooks from './build-uploads.hooks';
import mkdirp from 'mkdirp';

import multer from 'multer';
import { NotFound, GeneralError, BadRequest, Conflict, FeathersError } from '@feathersjs/errors';
import { Builds } from '../builds/builds.class';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mkdirp(`public/builds/${_req?.feathers?.buildid}`).then(_made => cb(null, `public/builds/${_req?.feathers?.buildid}`)).catch(err => { throw new GeneralError(`could not make build folder: ${err}`);});
  }, // where the files are being stored
  filename: (_req, file, cb) => cb(null, `${_req?.feathers?.buildid}_${_req?.feathers?.platform}_${file.originalname}`) // getting the file name
});
const upload = multer({
  storage
});

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'buildUploads': BuildUploads & ServiceAddons<any>;
  }
}

function throwError(res: any, err: FeathersError) {
  res.statusCode = err.code;
  res.json(err);
}

function determineIfBuildDataIsPaginated(toBeDetermined: BuildData[] | Paginated<BuildData>): toBeDetermined is Paginated<BuildData> {
  if(toBeDetermined as Paginated<BuildData> !== undefined){
    return true;
  }
  return false;
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true // allowing us to store multiple instances of the model, in the same request
  };

  app.use('/buildUploads',
    async (req, _res, next) => { 
      if (req.method != 'POST') {
        next();
        return;
      }

      if (req.query?.buildid == undefined) {
        throwError(_res, new NotFound('buildid is missing'));
        return;
      }

      const buildid = ~~req.query.buildid;
  
      if (buildid == 0) {
        throw new BadRequest('invalid build id');
      }
    
      switch (req.query?.platform) {
      case 'Windows':
      case 'WindowsServer':
      case 'Linux':
      case 'LinuxServer':
      case 'OSX':
        break;
      default:
        throwError(_res, new BadRequest('invalid platform'));
        return;        
      }

      if (req.feathers == undefined) {
        throwError(_res, new GeneralError('feathers undefined'));
        return;
      }

      req.feathers.buildid = buildid;
      req.feathers.platform = req.query.platform;

      const buildRecord = await (app.service('builds') as Builds).find({
        query: {
          $limit: 1,
          buildid: buildid
        }
      });

      let buildRecordData = [];
      if (determineIfBuildDataIsPaginated(buildRecord)) {
        buildRecordData = buildRecord.data;
      } else {
        buildRecordData = buildRecord;
      }

      if (buildRecordData?.[0] == undefined) {
        throwError(_res, new NotFound('build not found'));
        return;
      }
  
      if (buildRecordData[0].buildid != buildid) {
        throwError(_res, new GeneralError('found build record has mismatched build id'));
        return;
      }

      const existingBuildUploads = await (app.service('buildUploads') as BuildUploads).find({
        query: {
          buildid: buildid,
          platform: req.feathers.platform
        }
      });
  
      if ((existingBuildUploads as Paginated<BuildUpload>)?.data?.[0] !== undefined) {
        throwError(_res, new Conflict('build upload for this build id and platform already exists'));
        return;
      }
      next();
    },
    upload.single('file'), (req, _res, next) => {
      const { method } = req;
      if (method === 'POST' || method === 'PATCH') {

        if (req.feathers == undefined) {
          throw new Error('feathers is undefined');
        }
        req.feathers.file = req.file; // transfer the received files to feathers
      }
      next();
    }, new BuildUploads(options, app));


  // Get our initialized service so that we can register hooks
  const service = app.service('buildUploads');
  service.hooks(hooks);
}
