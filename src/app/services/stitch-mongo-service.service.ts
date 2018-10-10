import { Injectable } from '@angular/core';
import { Stitch, RemoteMongoClient, AnonymousCredential, StitchAppClient, RemoteMongoDatabase} from 'mongodb-stitch-browser-sdk';

@Injectable({
  providedIn: 'root'
})
export class StitchMongoServiceService {

  client: StitchAppClient;
  db: RemoteMongoDatabase;

  constructor() { }

  initializeAppCliente(appID: string) {
    this.client = Stitch.initializeDefaultAppClient(appID);
  }

  getServiceClient(dbName: string) {
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(dbName);
  }

  find(collection: string) {
    return this.db.collection(collection).find({}, { limit: 100}).asArray();
  }

  insertMany(collection: string, docs: any) {
    this.db.collection(collection).insertMany(docs).then(results => {
      const { insertedIds } = results;
      console.log(insertedIds);
    });
  }
}
