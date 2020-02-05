import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

// TODO: CRUD operasyonlarindaki entity arasi mapping'ler ayarlanacak.

export class AddressComponent implements OnInit {
  public addressForm: any;
  private clickedRowId: any;
  private clickedRowIndex: any;
  public phoneArray       = [];     // O anki adres icin eklenen telefonlar
  private updateClick     = false;
  public addressRows: any;

  baseUrl = 'http://localhost:3000/api/task';

  @ViewChild('phoneOpt', {read: ElementRef}) private phoneOpt: ElementRef;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    this.resetForm();
    const obs = this.http.get('http://localhost:3000/api/tasks');
    obs.subscribe((response) => this.addressRows = response);
  }

  onSubmit() {
    let prompt = 'Add new address?';
    if (this.updateClick) {
      prompt = 'Update the address?';
    }
    if (confirm(prompt)) {
      // TODO_1 : form input'taki stringi almak yerine telefon eklemediniz uyarisi verilebilir.
      //        : TODO_2 yi gor.
      if (this.phoneArray.length !== 0) {
        this.addressForm.patchValue({phoneNumbers: this.phoneArray});
      } else {
        // bu string'ten array yap.
        this.phoneArray.push(this.addressForm.get('phoneNumbers').value);
        this.addressForm.patchValue({phoneNumbers: this.phoneArray});
      }

      let found = false;
      let i = 0;
      for (i = 0; i < this.addressRows.length; i++) {
        // formdaki name su anki satirdaki name ile ayni degilse diger satira gec.
        // Ayni ise diger keylere bak.
        if (this.addressRows[i].name !== this.addressForm.get('name').value) {} else
        if (this.addressRows[i].surname !== this.addressForm.get('surname').value) {} else
        if (this.addressRows[i].address.city !== this.addressForm.get('address').value.city) {} else
        if (this.addressRows[i].address.town !== this.addressForm.get('address').value.town) {} else
        if (this.addressRows[i].address.district !== this.addressForm.get('address').value.district) {} else
        if (this.addressRows[i].address.street !== this.addressForm.get('address').value.street) {} else
        if (this.addressRows[i].description !== this.addressForm.get('description').value) {} else
        if (JSON.stringify(this.addressRows[i].phoneNumbers.sort()) !==
            JSON.stringify(this.addressForm.get('phoneNumbers').value.sort()))
            {} else {
                found = true; // tum keyler ayni.
                break;
              }
      }

      // Eger eklenmek veya guncellenmek istenen adres halihazirda yoksa bu islemi gerceklestir.
      if (!found) {
        if (this.updateClick) {
          if (this.clickedRowId !== null) {
            const obs = this.http.put(`${this.baseUrl}/${this.clickedRowId}`, this.addressForm.value, this.httpOptions);
            const temp = this.addressForm.value;
            const key = '_id';
            const value = this.clickedRowId;
            obs.subscribe(() => temp[key] = value);
            // Table'daki satiri degistir.
            this.addressRows[this.clickedRowIndex] = temp;
            console.log('Address updated.');
          }
        } else {
            const obs = this.http.post(this.baseUrl, this.addressForm.value);
            // Gelen response'ta eklenen adresin objectId'si var.
            // Bunu addressRows'a koymazsak update islemleri gerceklesmez.
            const temp = this.addressForm.value;
            const key = '_id';
            obs.subscribe((response) => temp[key] = response);
            // Table'a yeni adresi ekle.
            this.addressRows.push(temp);
          }
      } else {
        console.log('This address is already in the database.');
      }
      this.resetForm();
  } else {
      console.log('Address is not added/updated.');
    }
  }

  delAddress(selectedRow: any, indexRow: any) {
    if (confirm('Delete the address?')) {
      // Silinmek istenen adresin objectIdsi ile sunucuya istek gonder.
      if (selectedRow._id !== null) {
        const obs = this.http.delete(`${this.baseUrl}/${selectedRow._id}`, this.httpOptions);
        obs.subscribe(() => console.log('row is deleted.'));
      }
      // Silinmek istenen adresin indeksini kullanip tablodan cikar.
      this.addressRows.splice(indexRow, 1);
    }
  }

  updAddress(selectedRow: any, indexRow: any) {
    // Flagi set et. Onsubmit'te add/update isleminin ayrimi bu flag uzerinden yapilir.
    this.updateClick = true;
    this.clickedRowId = selectedRow._id;
    this.clickedRowIndex = indexRow;
    // Forma git.
    window.scrollTo(0, 0);
    // Update edilecek adresi form'a aktar
    this.addressForm.patchValue(
      {
        name: selectedRow.name,
        surname: selectedRow.surname,
        address: {
          city: selectedRow.address.city,
          town: selectedRow.address.town,
          district: selectedRow.address.district,
          street: selectedRow.address.street
        },
        description: selectedRow.description
      }
    );
    // phoneArray'i artik update edilmek istenen adresin telefonlarini tutsun.
    this.phoneArray = selectedRow.phoneNumbers.slice();
    // Dropdown'da su an bulunan telefonlari sil.
    const elements = document.getElementsByClassName('phoneOptions');
    while (elements.length > 0) { elements[0].remove(); }
    // Telefon form input'una ilk telefonu aktar yoksa submit edilmiyor.
    // TODO_2: Telefon formunun validation kismini formun bos olup olmamasiyla degil phoneArray'de eleman
    //         olup olmamasiyla yap.
    this.addressForm.patchValue( {phoneNumbers:  this.phoneArray[0]} );
    // Guncellenecek olan adres satirindaki telefonlari dropdown'a ekle.
    this.phoneArray.forEach(element => {
      const option = this.renderer.createElement('option');
      this.renderer.addClass(option, 'phoneOptions');
      option.innerHTML = element;
      this.renderer.appendChild(this.phoneOpt.nativeElement, option);
    });
  }

  addPhone() {
    const newPhone = this.addressForm.get('phoneNumbers').value;
    if (!this.phoneArray.includes(newPhone) && newPhone !== '') {
      this.phoneArray.push(newPhone);
      const option = this.renderer.createElement('option');
      this.renderer.addClass(option, 'phoneOptions');
      option.innerHTML = newPhone;
      this.renderer.appendChild(this.phoneOpt.nativeElement, option);
    }
  }

  deletePhone() {
    const deletedPhone = this.addressForm.get('phoneNumbers').value;
    // Eger girilen telefon, telefon listesinde varsa ve bos string gelmediyse silinir.
    if (this.phoneArray.includes(deletedPhone) && deletedPhone !== '') {
      this.phoneArray.splice(this.phoneArray.indexOf(deletedPhone), 1);
      // DOM'daki dropdownda degisikligi yap.
      const elements = document.querySelectorAll('option.phoneOptions');
      let i;
      for (i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML === deletedPhone) {
          elements[i].remove();
          // silinmek istenen telefon bulundugu icin donguye devam etmene gerek yok.
          break;
        }
      }
    }
  }

  resetForm() {
    this.addressForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      address: new FormGroup({
        city: new FormControl('', Validators.required),
        town: new FormControl('', Validators.required),
        district: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required)
      }),
      description: new FormControl('', Validators.required),
      phoneNumbers: new FormControl('', Validators.required)
    });
    const removeElements = (elms) => elms.forEach(el => el.remove());
    removeElements( document.querySelectorAll('option.phoneOptions') );
    this.phoneArray = [];
    // Update flag'ini false yap ki daha sonra olasi add islemleri de yapilabilsin.
    this.updateClick = false;
    this.clickedRowId = null;
    this.clickedRowIndex = null;
  }
}
