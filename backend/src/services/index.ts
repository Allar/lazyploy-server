import { Application } from '../declarations';
import builds from './builds/builds.service';
import buildUploads from './build-uploads/build-uploads.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(builds);
  app.configure(buildUploads);
}
