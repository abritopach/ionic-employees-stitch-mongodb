import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import config from '../config/config';
import { ObjectId } from 'bson';
import { StitchMongoService } from '../services/stitch-mongo.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  favorites = [];

  constructor(private storage: Storage, private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          console.log(result);
          if (result.length !== 0) {
            if (typeof result[0]['favorites'] !== 'undefined') {
              this.favorites = result[0]['favorites'];
            }
          }
        });
      }
    });
  }

  deleteFavorite(favorite) {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
        { $pull: { 'favorites': { _id: favorite._id } } })
        .then(result => {
            console.log(result);
            this.favorites = this.favorites.filter(f => f._id !== favorite._id);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

}
