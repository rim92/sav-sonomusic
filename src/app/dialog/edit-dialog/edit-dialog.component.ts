import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiService } from '../../core/service/api.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  userForm: FormGroup;
  loading: boolean;
  // minDate: Date = new Date();
  // maxDate: Date = new Date();
  usersEndPoint: { userLists: string; addUser:string; deleteUser: string; updateUser: string; };
  constructor(public formBuilder: FormBuilder, public data: ApiService, public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public userdata: any) {
    this.userForm = this.createUserForm();

    this.usersEndPoint = environment.apiRoutes;
    // this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    // this.minDate.setFullYear(this.minDate.getFullYear() - 50);
  }

  ngOnInit() {
  }







  public createUserForm(): FormGroup {
    const editUser = this.userdata.editUser;
    return this.formBuilder.group({
      prenom: [editUser.prenom ? editUser.prenom : null,
      Validators.compose([Validators.required, Validators.pattern(this.data.namePattern),
      Validators.maxLength(20)])],
      nom: [editUser.nom ? editUser.nom : null,
      Validators.compose([Validators.required, Validators.pattern(this.data.namePattern),
      Validators.maxLength(20)])],
      tel: [editUser.tel ? editUser.tel : null],

      email: [editUser.email ? editUser.email : null,
      Validators.compose([Validators.required, Validators.pattern(this.data.emailPattern)])],
     

      designation: [editUser.designation ? editUser.designation : null,
        Validators.compose([Validators.required, Validators.pattern(this.data.namePattern)])],

        marque: [editUser.marque ? editUser.marque : null],
      date: [editUser.date ? editUser.date : new Date(), Validators.required],

      date_achat: [editUser.date_achat ? editUser.date_achat : null],


  frais_diagnostic: [editUser.frais_diagnostic ? editUser.frais_diagnostic : null],
        num_serie: [editUser.num_serie ? editUser.num_serie : null,
          Validators.compose([Validators.required, Validators.pattern(this.data.namePattern)])],


          garantie: [editUser.garantie ? editUser.garantie : null],

            panne_client: [editUser.panne_client ? editUser.panne_client : null]


    });
  }



    
    
    






  

  
  onValidateClick(){

   
//     this.loading = true;
    

// this.data.AddClient(this.userForm.value).subscribe((res) => {
//   console.log(res);
  
  let client = {
    nom: this.userForm.value.nom,
    prenom: this.userForm.value.prenom,
    tel: this.userForm.value.tel,
    email:this.userForm.value.email,
    designation: this.userForm.value.designation,
    marque:this.userForm.value.marque,
    date:this.userForm.value.date,
    
    date_achat: this.userForm.value.date_achat,
    frais_diagnostic:this.userForm.value.frais_diagnostic,
    garantie:this.userForm.value.garantie,
    reparation: null,
    panne_client:this.userForm.value.panne_client,
    num_serie:this.userForm.value.num_serie,
    panne_signaler:null,
    diagnostic:null,
    reference_piece:null,
    prix_piece:null,
    prix_reparation:null,
    date_diagnostic:null,	
    date_sortie:null,
    observation:null,
    etat:"non",
    added:false,
    statut:null,
          priority:null,
        exist:"false"
    
  
  }

  this.data.putDataX(client, this.usersEndPoint.updateUser + '/'+client.nom+'/'+client.prenom+'/'+client.tel+'/'+client.email+'/'+client.designation+'/'+client.date_achat+'/'+client.num_serie+'/'+client.garantie+'/'+client.panne_client+'/'+client.reparation+"/"+client.frais_diagnostic  ).subscribe((res) => {
     this.getAllUsers();
    this.data.openSnackBar(`${res.nom} ${res.prenom} updated successfully`, '', 'bg-success');
    location.reload();
  }, (err) => {
    this.loading = false;
    // console.log(err);
   // this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
  });
  
  // this.getAllUsers();
 // console.log(client);
 // this.data.openSnackBar(`updated successfully`, '', 'bg-success');
  //location.reload();
// }, (err) => {
  
//   console.log(err);
//   //this.data.openSnackBar('Internal server, Please try again', '', 'bg-danger');
//   this.data.openSnackBar(` added successfully`, '', 'bg-success');
//   location.reload();
// });

  }



  public getAllUsers() {
    this.loading = true;
    this.data.getDataX(this.usersEndPoint.userLists).subscribe((result) => {
      //this.persons = result;
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

  /* Date */
  public date(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.userForm.get('date').setValue(convertDate);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
