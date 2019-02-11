import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { CourseService } from '../../../providers/course/course.service';
import { CourseService } from '../../../services/Course.provider';
import { Course } from '../../../class/Course';
import { BookingsService } from '../../../services/Booking.provider';
import { Booking } from '../../../class/Booking';
import { SubjectsService } from '../../../services/Subject.provider';
import { Subject } from '../../../class/Subject';

/**
 * Generated class for the AdminStatisticsDistributionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-statistics-distribution',
  templateUrl: 'admin-statistics-distribution.html',
})
export class AdminStatisticsDistributionPage {

  toDate: any;
  fromDate: any;
  selectedYear: string;
  courses: Course[];
  subjects: Subject[];
  selectedCourse: string;
  bookings: Array<Booking>;
  labels: string[] = [];
  data: number[] = [];
  pos: number = 0;
  posData: number = 0;
  inc: number;

  public doughnutChartType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private courseService: CourseService,
    private bookingsService: BookingsService,
    private subjectsService: SubjectsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminStatisticsDistributionPage');
    this.bookings = new Array<Booking>();
    this.loadAllCourses();
    //this.loadAllBookings();
    this.loadAllSubjects();
  }

  loadAllCourses() {
    this.courseService.findAllCoursesList().subscribe(data => {
      this.courses = data.body;
      console.log(this.courses);
      // console.log(this.selectedCourse);
    }, error => {
      console.log(error);
    });
  }

  loadAllBookings() {
    this.bookingsService.findAllBookingsDistributionList(this.toDate, this.fromDate).subscribe(data => {
      this.bookings = data.body;
      console.log(this.bookings);
    }, error => {
      console.log(error);
    });

  }

  loadAllSubjects() {
    this.subjectsService.findAllSubjectsList().subscribe(data => {
      this.subjects = data.body;
      console.log(this.subjects);
    }, error => {
      console.log(error);
    });

  }

  generateChart() {

    // this.data.length=0;
    // this.labels.length=0;
    //this.data = this.data.filter(el => !this.data.splice(el));
    //this.labels = this.labels.filter(el => !this.labels.splice(el));

    if (this.selectedCourse == "all" && this.selectedYear == "all") {
      console.log("got here selected course all selected year all");
      this.bookingsService.findAllBookingsDistributionList(this.fromDate, this.toDate).subscribe(data => {
        this.bookings = data.body;
        console.log(this.bookings);
        this.filterBookings();
      }, error => {
        console.log(error);
      });
    }

    if (this.selectedCourse == "all" && this.selectedYear != "all") {
      console.log("got here all courses and a selected year");
      this.bookingsService.findAllBookingsAllCoursesSelectedYear(this.fromDate, this.toDate, this.selectedYear).subscribe(data => {
        this.bookings = data.body;
        console.log(this.bookings);
        this.filterBookings();
      }, error => {
        console.log(error);
      });
    }

    if (this.selectedCourse != "all" && this.selectedYear != "all") {
      console.log("got here seleceted course and selected year");
      this.bookingsService.findAllBookingsSelectedCourseAndSelectedYear(this.fromDate, this.toDate, this.selectedCourse, this.selectedYear).subscribe(data => {
        this.bookings = data.body;
        console.log(this.bookings);
        this.filterBookings();
      }, error => {
        console.log(error);
      });
    }

    if (this.selectedCourse != "all" && this.selectedYear == "all") {
      console.log("got here seleceted course and all years");
      this.bookingsService.findAllBookingsSelectedCourseAndAllYears(this.fromDate, this.toDate, this.selectedCourse).subscribe(data => {
        this.bookings = data.body;
        console.log(this.bookings);
        this.filterBookings();
      }, error => {
        console.log(error);
      });
    }
    // console.log(this.toDate);
    //console.log(this.fromDate);
    console.log(this.selectedYear);
    console.log(this.selectedCourse);
    //console.log(this.bookings);
  }

  filterBookings() {
    for (let booking of this.bookings) {
      for (let subject of this.subjects) {
        if (booking.subjectId == subject.id) {
          //  console.log(subject.title);
          if (this.checkDuplicates(subject.title) == false) {
            this.labels.push(subject.title); // pushing to a postion in the array if there is no duplicate entry
            this.data[this.pos] = 1;
            this.pos++;

          }
          else {
            // there is allready this subject in the array and now i need to increment number array postion by 1
            // find position of subject and increment by 1
            this.posData = this.findPosSubject(subject.title);
            this.data[this.posData]++;
          }
        }
      }
    }
    //console.log(this.labels);
    //console.log(this.data);
  }

  findPosSubject(title: string): number {

    for (this.inc = 0; this.inc < this.labels.length; this.inc++) {
      if (this.labels[this.inc] == title) {
        return this.inc;
      }
    }
  }

  checkDuplicates(title: string): boolean {
    for (let label of this.labels) {
      if (label == title) {
        return true;
      }
    }
    return false;
  }

}
