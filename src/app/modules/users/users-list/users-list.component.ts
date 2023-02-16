import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/service/api.service';
import { environment } from '../../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from '../../../dialog/edit-dialog/edit-dialog.component';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild('table', { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  usersEndPoint: any;
  allUsers: any = {
   nom: String,
    prenom: String,
    tel:String,
    designation:String,
    date:String,
    email: String,
    frais_diagnostic:String
  };
  displayedColumns: string[] = [ 'Date','Client','tel','Designation','Frais','Etat','Action'];
  dataSource: MatTableDataSource<any>;
  loading: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(public data: ApiService, public router: Router, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
    this.usersEndPoint = environment.apiRoutes;
  }

  ngOnInit() {
    this.getAllUsers();
  }

  public getAllUsers() {
    this.loading = true;
    this.data.getDataX(this.usersEndPoint.userLists).subscribe((result) => {
      this.allUsers = result;
      console.log("okk");
      console.log(result);
      this.loading = false;
      // console.log(this.allUsers);
      this.dataSource = new MatTableDataSource(this.allUsers);
      // console.log(this.dataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (err) => {
      this.loading = false;
      // console.log(err);
      this.data.openSnackBar('Error loading users list.', '', 'bg-danger');
    });
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  public openDeleteDialog(deleteUser): void {

   
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: `Are you sure want to delete ${deleteUser.prenom} ${deleteUser.nom} ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        
        this.data.deleteDataX(this.usersEndPoint.deleteUser + '/'+deleteUser._id ).subscribe((res) => {
          // this.getAllUsers();
          this.data.openSnackBar(` deleted successfully`, '', 'bg-success');
          location.reload();
        }, (err) => {
          // console.log(err);
          this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
        });
      }
    });
  }


  public openEditDialog(editUser={_id:'',nom:'',prenom:'',tel:'',email:'',designation:'',date_achat:'',num_serie:'',garantie:'',panne_client:'',reparation:'',frais_diagnostic:''}): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: 'auto',
      data: { editUser }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.loading = true;
      if (typeof (result) !== 'undefined') {
        result.id = editUser._id ? editUser._id : '';
        // result.DOB = this.formatDate(result.DOB);
        console.log("resuultt"+ result.id);
        result.id !== '' ? this.addUser(result) : this.editUser(result);
      }
    });
  }
  public editUser(result) {
    //this.loading = true;
    console.log("userrr:"+result.id);
    this.data.putDataX(result, this.usersEndPoint+'/' +result.id+'/'+result.nom+'/'+result.prenom+'/'+result.tel+'/'+result.email+'/'+result.designation+'/'+result.marque+'/'+result.date+'/'+result.date_achat+'/'+result.num_serie+'/'+result.garantie+'/'+result.panne_client+'/'+result.reparation+"/"+result.frais_diagnostic ).subscribe((res) => {
      this.getAllUsers();
    this.data.openSnackBar(`${res.nom} ${res.prenom} updated successfully`, '', 'bg-success');
    this.router.navigate(['/users']);
    }, (err) => {
      this.loading = false;
      // console.log(err);
     // this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
    });
  }


  public addUser(userVal) {
    this.loading = true;
    this.data.postDataX(userVal, this.usersEndPoint.addUser).subscribe((res) => {
      this.getAllUsers();


      this.data.openSnackBar(`${res.first_name} ${res.last_name} added successfully`, '', 'bg-success');
     // this.router.navigate(['/users']);
      location.reload();
    }, (err) => {
      this.loading = false;
      // console.log(err);
      this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
    });
  }
  // public formatDate(date) {
  //   const dateObj = new Date(date + 'T00:00:00');
  //   return new Intl.DateTimeFormat('en-US').format(dateObj);
  // }
  public dropTable(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.allUsers, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }
  public dragStarted(event: CdkDragDrop<any[]>) {
  }
  public dragEnded(event: CdkDragDrop<any[]>) {
  }
}
