import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ModalController } from '@ionic/angular';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import config from '../../config/config';

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.scss'],
})
export class ChartModalComponent implements OnInit {

  @ViewChild('doughnutCanvas', { read: ElementRef, static: true }) doughnutCanvas: ElementRef;

  doughnutChart: any;
  data: any[] = [];
  labels: any[] = [];
  employeesCount = 0;

  constructor(private modalCtrl: ModalController, private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
    this.fetchEmployeesCountByDepartment();
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  createDoughnutChart() {
    console.log(this.doughnutCanvas);

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#D32F2F',
            '#E64A19',
            '#FFC107',
            '#388E3C',
            '#448AFF',
          ],
          label: 'Dataset 1'
        }],
        labels: this.labels
      },
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Departments'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });

  }

  createLineChart() {
     /*
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [
            {
                label: 'Values',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.data,
                spanGaps: false,
            }
        ]
      }
    });
    */
  }

  fetchEmployeesCountByDepartment() {
    this.stitchMongoService.employeesCountByDepartment(config.COLLECTION_KEY, '$department').then(docs => {
        console.log('docs', docs);
        docs.map(doc => {
          this.data.push(doc['count']);
          this.employeesCount += doc['count'];
          this.labels.push(doc['_id']);
          this.createDoughnutChart();
        });
    }).catch(err => {
        console.error(err);
    });
  }

}
