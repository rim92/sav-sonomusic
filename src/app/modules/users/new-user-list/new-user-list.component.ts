import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/service/api.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from '../../../dialog/edit-dialog/edit-dialog.component';
import {PrintDialogComponent}from '../../../dialog/print-dialog/print-dialog.component';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-new-user-list',
  templateUrl: './new-user-list.component.html',
  styleUrls: ['./new-user-list.component.scss']
})
export class NewUserListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean;
  usersEndPoint: { userLists: string; deleteUser: string; updateUser: string; };
  persons: any;

  constructor(public data: ApiService, public router: Router, public dialog: MatDialog) {
    this.usersEndPoint = environment.apiRoutes;
  }

  ngOnInit() {
    this.dataTableOpt();
    this.getAllUsers();
  }

  public dataTableOpt() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // lengthMenu: [5, 10, 25, 50],
      processing: true
    };
  }
  public getAllUsers() {
    this.loading = true;
    this.data.getDataX(this.usersEndPoint.userLists).subscribe((result) => {
      this.persons = result;
      this.loading = false;
      // Calling the DT trigger to manually render the table
      // this.dtTrigger.next();
      // console.log(this.persons);
    }, (err) => {
      this.loading = false;
      // console.log(err);
      this.data.openSnackBar('Error loading users list.', '', 'bg-danger');
    });
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
  public openEditDialog(editUser = {_id:'',nom:'',prenom:'',tel:'',email:'',designation:'',marque:'',date:'',date_achat:'',num_serie:'',
    garantie:'',panne_client:'',reparation:'',frais_diagnostic:''}): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: 'auto',
      data: { editUser }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(result.id);
       this.loading = true;
       //this.editUser(result);
       
      if (typeof (result) !== 'undefined') {
        result.id = editUser._id ? editUser._id : '';
        // result.DOB = this.formatDate(result.DOB);
        // this.editUser(result);

         result.id !== '' ? this.editUser(result) : this.addUser(result);

      }
    });
  }



  public openPrintDialog(editUser = {_id:'',nom:'',prenom:'',tel:'',email:'',designation:'',marque:'',date:'',date_achat:'',num_serie:'',
  garantie:'',panne_client:'',reparation:'',frais_diagnostic:''}): void {
  const dialogRef = this.dialog.open(PrintDialogComponent, {
    width: 'auto',
    data: { editUser }
  });
  dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     //this.editUser(result);
     
    if (typeof (result) !== 'undefined') {
      result.id = editUser._id ? editUser._id : '';
      // result.DOB = this.formatDate(result.DOB);
       this.editUser(result);
    }
  });
}








  public editUser(userVal) {
    this.loading = true;
    console.log(userVal.id);
    this.data.putDataX(userVal, this.usersEndPoint.updateUser + '/' +userVal.id+'/'+userVal.nom+'/'+userVal.prenom+'/'+userVal.tel+'/'+userVal.email+'/'+userVal.designation+'/'+userVal.marque+'/'+userVal.date+'/'+userVal.date_achat+'/'+userVal.num_serie+'/'+userVal.garantie+'/'+userVal.panne_client+'/'+userVal.reparation+"/"+userVal.frais_diagnostic).subscribe((res) => {
      this.getAllUsers();
      this.data.openSnackBar(`${res.nom} ${res.prenom} updated successfully`, '', 'bg-success');
      location.reload();
    }, (err) => {
      this.loading = false;
      console.log(err);
      //this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
    });
  }
  public addUser(userVal) {
    this.loading = true;
    this.data.postDataX(userVal, this.usersEndPoint.updateUser).subscribe((res) => {
       this.getAllUsers();
      this.data.openSnackBar(`${res.prenom} ${res.nom} added successfully`, '', 'bg-success');
      location.reload();
    }, (err) => {
      this.loading = false;
      // console.log(err);
      this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
    });
  }
  public trackByFn(index, item) {
    return index; // or item.id
  }

  // public formatDate(date) {
  //   const dateObj = new Date(date + 'T00:00:00');
  //   return new Intl.DateTimeFormat('en-US').format(dateObj);
  // }
  public dropTable(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.persons, event.previousIndex, event.currentIndex);
    this.reorder(this.persons);
  }
  public reorder(userLists: any) {
    console.log(userLists);
    this.data.putDataX(userLists, 'reorder').subscribe((result) => {
    }, (err) => {
      console.log(err);
    });
  }
  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
