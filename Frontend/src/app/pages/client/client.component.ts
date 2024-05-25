import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { CategoryListComponent } from '../../features/client/category-list/category-list.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../types/category.types';
import { ClientService } from '../../services/client.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, CategoryListComponent, CommonModule]
})
export default class ClientComponent implements OnInit {

  isListOpened: boolean = false



  constructor() { }

  ngOnInit() {
  }

 
  
  toggleList(){
    this.isListOpened = !this.isListOpened
  }

}
