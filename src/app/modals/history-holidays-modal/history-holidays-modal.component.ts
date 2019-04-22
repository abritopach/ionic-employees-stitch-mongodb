import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, AlertController } from '@ionic/angular';
import { Holiday } from '../../models/holiday.model';
import { MoreOptionsPopoverComponent } from '../../popovers/more-options/more-options.popover';
import { RequestHolidaysModalComponent } from '../request-holidays-modal/request-holidays-modal.component';
import config from '../../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import { IziToastService } from '../../services/izi-toast.service';
import { request } from 'https';
import { RequestHolidays } from '../../models/request.holidays.model';

@Component({
  selector: 'app-history-holidays-modal',
  templateUrl: './history-holidays-modal.component.html',
  styleUrls: ['./history-holidays-modal.component.scss'],
})
export class HistoryHolidaysModalComponent implements OnInit {

  holidays: Holiday = null;
  rejectedRequests: any[] = [];
  pendingRequests: any[] = [];
  approvedRequests: any[] = [];
  title = '';
  requests = null;
  avatars = null;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private popoverCtrl: PopoverController,
              private storage: Storage, private stitchMongoService: StitchMongoService, private iziToast: IziToastService,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.title = this.navParams.data.modalProps.title;
    if (typeof this.navParams.data.modalProps.holidays !== 'undefined') {
      this.holidays = this.navParams.data.modalProps.holidays;
      this.rejectedRequests = this.holidays.taken.info.filter(h => h.status === 'rejected');
      this.pendingRequests = this.holidays.taken.info.filter(h => h.status === 'pending');
      this.approvedRequests = this.holidays.taken.info.filter(h => h.status === 'approved');
      console.log('pendingRequests', this.pendingRequests);
      console.log('approvedRequests', this.approvedRequests);
    }
    if (typeof this.navParams.data.modalProps.requests !== 'undefined') {
      this.getAvatars();
      console.log(this.navParams.data.modalProps.requests);
      this.requests = this.navParams.data.modalProps.requests;
    }
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(this.holidays);
  }

  onClickMoreOptions(event) {
    console.log('HistoryHolidaysModalComponent::onClickMoreOptions() | method called');
    console.log(event);
    this.presentOptionsPopover(event);
  }

  async presentModal(component, componentProps) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
      this.holidays = data;
      this.pendingRequests = this.holidays.taken.info.filter(h => h.status === 'pending');
      this.approvedRequests = this.holidays.taken.info.filter(h => h.status === 'approved');
    }
  }

  async presentOptionsPopover(event) {
    console.log('presentPopover', event);

    const componentProps = { popoverProps: { title: 'Options',
      options: [
        {name: 'Update', icon: 'create', function: 'updateHolidays'},
        {name: 'Delete', icon: 'close-circle-outline', function: 'deleteHolidays'}
      ],
      event: event
    }};

    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      if (data.option === 'updateHolidays') {
        const componentPropsModal = { modalProps: { title: 'Request time off', holidays: this.holidays,
         selectedHolidays: { meta: data.selectedHolidays}}};
        this.presentModal(RequestHolidaysModalComponent, componentPropsModal);
      }
      if (data.option === 'deleteHolidays') {
        this.deleteHolidays(data.selectedHolidays);
      }
    }

  }

  deleteHolidays(selectedHolidays) {
    console.log(selectedHolidays);

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);

        if (selectedHolidays.status === 'approved') {
          this.holidays.taken.days -= selectedHolidays.countDays;
          this.holidays.not_taken += selectedHolidays.countDays;
        }

        this.holidays.taken.info = this.holidays.taken.info.filter(h => h.id !== selectedHolidays.id);

        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$set: { holidays: this.holidays }})
        .then(docs => {
            console.log(docs);
            this.iziToast.success('Delete holidays', 'Holidays deleted successfully.');
            this.pendingRequests = this.holidays.taken.info.filter(h => h.status === 'pending');
            this.approvedRequests = this.holidays.taken.info.filter(h => h.status === 'approved');
        }).catch(err => {
            console.error(err);
        });
      }
    });

  }

  onClickEditRequest(req: RequestHolidays) {
    this.presentAlertPrompt(req);
  }

  async presentAlertPrompt(req: RequestHolidays) {
    console.log(req);
    console.log('userId', req.userId.toString());
    const alert = await this.alertCtrl.create({
      header: 'Confirm holiday request',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Reject',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');

            alert.onDidDismiss().then((alertData) => {
              req.holidaysDetail.status = 'rejected';
              req.holidaysDetail.managerComment = alertData.data.values.reason;
              this.updateRequest({user_id: req.userId, 'holidays.taken.info.id': req.holidaysDetail.id},
                {$set: { 'holidays.taken.info.$': req.holidaysDetail}
              }).then(docs => {
                console.log(docs);
                this.deleteRequest(req);
                this.requests = this.requests.filter(r => r.holidaysDetail.status === 'pending');
              }).catch(err => {
                  console.error(err);
              });
            });
          }
        }, {
          text: 'Accept',
          handler: () => {
            console.log('Confirm Ok');
            req.holidaysDetail.status = 'approved';
            this.updateRequest({user_id: req.userId, 'holidays.taken.info.id': req.holidaysDetail.id},
            {$set: { 'holidays.taken.info.$': req.holidaysDetail},
             $inc: { 'holidays.taken.days': req.holidaysDetail.countDays, 'holidays.not_taken': -req.holidaysDetail.countDays }
            }
            ).then(docs => {
              console.log(docs);
              this.deleteRequest(req);
              this.requests = this.requests.filter(r => r.holidaysDetail.status === 'pending');
            }).catch(err => {
                console.error(err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getAvatars() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {}).then(docs => {
      this.avatars = docs.map(doc => {
        const item = {user_id: doc['user_id'].toString(), avatar: doc['avatar']};
        return item;
      });
      console.log(this.avatars);
      this.requests.map(req => {
        req.avatar = this.getAvatarById(req.userId.toString()).avatar;
      });
    }).catch(err => {
        console.error(err);
    });
  }

  getAvatarById(id) {
    console.log('getAvatarById(id)', id);
    if (this.avatars !== null) {
      return this.avatars
      .filter(avatar => avatar.user_id === id)
      .pop();
    }
  }

  updateRequest(filter, action) {
    return this.stitchMongoService.update(config.COLLECTION_KEY, filter, action);
  }

  deleteRequest(req: RequestHolidays) {
    this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: req.userId},
      { $pull: { 'employees_holidays_requests': { id: req.id } } })
      .then(result => {
          console.log(result);
      }).catch(err => {
          console.error(err);
      });
  }

}
