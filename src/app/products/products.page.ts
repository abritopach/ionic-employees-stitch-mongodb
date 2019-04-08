import { Component, OnInit } from '@angular/core';

import { StitchMongoService } from '../services/stitch-mongo.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  constructor(private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
  }

  loadDefaultImg(event) {
    event.target.src = '/assets/images/thumb-not-available.png';
  }

}
