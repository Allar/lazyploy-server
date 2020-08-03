import { Application as ExpressFeathers } from '@feathersjs/express';

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

export interface BuildData {
    buildid?: number;
    project: string;
    desc: string;
    status: string;
    platforms: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BuildUpload {
    buildid: number;
    originalFileName: string;
    fspath: string;
    serveDir: string;
    filename: string;
    platform: string;
    createdAt: Date;
    updatedAt: Date;
  }

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;
