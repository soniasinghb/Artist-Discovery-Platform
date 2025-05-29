import { Component } from '@angular/core';
import { notifications, NotificationsService } from '../services/notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notificationsList: notifications[] = [];
  constructor(private notificationService: NotificationsService){};

  ngOnInit(){
    this.notificationService.notifications$.subscribe(notifications =>{
      this.notificationsList = notifications;
    })
  }

  removeNotif(id:number){
    this.notificationService.deleteNotif(id);
  }
}
