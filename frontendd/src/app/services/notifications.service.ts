import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface notifications{
  id:number,
  message: string,
  style : 'success'|'danger'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubj = new BehaviorSubject<notifications[]>([]);
  private currID = 0;
  notifications$ = this.notificationsSubj.asObservable();
  
  show(message:string, style:'success'|'danger'){
    const id=this.currID++;
    const notification:notifications = {id, message, style};

    const currNotifications = this.notificationsSubj.value;
    this.notificationsSubj.next([notification, ...currNotifications]);

    setTimeout(() => {
      this.deleteNotif(id);
    }, 3000);
  }

  deleteNotif(id:number){
    const currNotifications = this.notificationsSubj.value;
    this.notificationsSubj.next(currNotifications.filter(notif => notif.id!==id));
  }
}
