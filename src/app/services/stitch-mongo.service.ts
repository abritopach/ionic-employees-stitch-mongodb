import { Injectable } from '@angular/core';
import { Stitch, RemoteMongoClient, AnonymousCredential, StitchAppClient, RemoteMongoDatabase,
   UserPasswordCredential } from 'mongodb-stitch-browser-sdk';

import { AuthenticationService } from './authentication.service';
import config from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class StitchMongoService {

  client: StitchAppClient = null;
  db: RemoteMongoDatabase = null;

  fakeEmployees = [
    {employee_name: 'Adrián Brito Pacheco', job_position: 'Project Manager', avatar: 'http://i.pravatar.cc/150?img=7',
     description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, eu auctor convallis ultrices volutpat himenaeos',
     owner_id: '5bee844f698a67224235d074', phone: '123456789', email: 'fakeemail@gmail.com', department: 'Technical',
    projects: [{name: 'Project Technical 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Technical 2', description: 'Description 2', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Marketing 1', description: 'Description 3', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''}], events: [
  {title: 'My Event 1', time: '5:00p - 1:00a', date: 'Monday, November 5, 2018', meeting_participants: [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'},
    {avatar: 'http://i.pravatar.cc/150?img=11'},
    {avatar: 'http://i.pravatar.cc/150?img=12'},
    {avatar: 'http://i.pravatar.cc/150?img=13'},
    {avatar: 'http://i.pravatar.cc/150?img=14'},
    {avatar: 'http://i.pravatar.cc/150?img=15'},
    {avatar: 'http://i.pravatar.cc/150?img=16'},
    {avatar: 'http://i.pravatar.cc/150?img=17'},
    {avatar: 'http://i.pravatar.cc/150?img=18'},
    {avatar: 'http://i.pravatar.cc/150?img=19'},
    {avatar: 'http://i.pravatar.cc/150?img=20'}
  ]},
  {title: 'My Event 2', time: '5:00p - 1:00a', date: 'Friday, December 14, 2018', meeting_participants: [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'},
    {avatar: 'http://i.pravatar.cc/150?img=11'}
    ]}]},
    {employee_name: 'José Antonio Pérez Florencia', job_position: 'Software Developer', avatar: 'http://i.pravatar.cc/150?img=2',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, eu auctor convallis ultrices volutpat himenaeos',
     owner_id: '5bee844f698a67224235d074', phone: '123456789', email: 'fakeemail@gmail.com', department: 'Technical',
    projects: [{name: 'Project Technical 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Technical 2', description: 'Description 2', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Technical 3', description: 'Description 3', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''}]},
    {employee_name: 'Patricia Acosta García', job_position: 'Marketing Account Manager', avatar: 'http://i.pravatar.cc/150?img=5',
     description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, eu auctor convallis ultrices volutpat himenaeos',
     owner_id: '5bee844f698a67224235d074', phone: '123456789', email: 'fakeemail@gmail.com', department: 'Marketing',
    projects: [{name: 'Project Marketing 1', description: 'Description 1', technologies: 'Video 360', thumbnail: ''}]},
    {employee_name: 'Ana Ruiz Pérez', job_position: 'Software Developer', avatar: 'http://i.pravatar.cc/150?img=9',
     description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, eu auctor convallis ultrices volutpat himenaeos',
     owner_id: '5bee844f698a67224235d074', phone: '123456789', email: 'fakeemail@gmail.com', department: 'Technical',
    projects: [{name: 'Project Technical 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''}]},
    {employee_name: 'Juan Olmos Gil', job_position: 'Software Developer', avatar: 'http://i.pravatar.cc/150?img=4',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, eu auctor convallis ultrices volutpat himenaeos',
     owner_id: '5bee844f698a67224235d074', phone: '123456789', email: 'fakeemail@gmail.com', department: 'Technical',
    projects: [{name: 'Project Technical 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Technical 2', description: 'Description 2', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    {name: 'Project Technical 3', description: 'Description 3', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''}]}
  ];

  constructor(private authService: AuthenticationService) { }

  initializeAppClient(appID: string) {
    this.client = Stitch.initializeDefaultAppClient(appID);
  }

  getServiceClient(dbName: string) {
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(dbName);
  }

  /*
  login(user) {
    const credential = new UserPasswordCredential(user.email, user.password);
    this.client.auth.loginWithCredential(credential).then(authedId => {
      console.log(authedId);
      console.log(`successfully logged in with id: ${authedId.id}`);
      this.authService.login(authedId.id);
  })
    .catch(err => console.error(`login failed with error: ${err}`));
  }
  */

  login(user) {

    // Anonymous login.
    let credential = new AnonymousCredential();
    if (user !== null) {
      credential = new UserPasswordCredential(user.email, user.password);
      console.log('Authenticated user logged');
    } else {
      console.log('Anonymous user logged');
    }
    return this.client.auth.loginWithCredential(credential);
  }

  find(collection: string, filter: any) {
    return this.db.collection(collection).find(filter, { limit: 100}).asArray();
  }

  aggregate(collection: string, field: string) {
    return this.db.collection(collection).aggregate([{$group: {
      _id: {$substr: [field, 0, 1]}, employees: {$push: { employee_name: '$employee_name', job_position: '$job_position',
      avatar: '$avatar', description: '$description', phone: '$phone', email: '$email', department: '$department', projects: '$projects'
    }}
    }}, { $sort: { _id: 1 } }]).asArray();
  }

  insertMany(collection: string, docs: any) {
    this.db.collection(collection).insertMany(docs).then(results => {
      const { insertedIds } = results;
      console.log(insertedIds);
    }).catch(err => {
      console.error(err);
    });
  }

  updateOne(collection: string, id, newEvent) {
    return this.db.collection(collection)
    .updateOne({user_id: id}, {$push: { events: newEvent }});
  }

  updateEvents(collection: string, id, title) {
    return this.db.collection(collection)
    .updateOne({user_id: id}, {$pull: { events: { title: title } }});
  }

  populateFakeEmployees() {
    this.insertMany(config.COLLECTION_KEY, this.fakeEmployees);
  }
}
