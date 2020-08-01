import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

import { StatusModel } from '../models/status.model';
import { UserImage } from '../models/user-image.model';
import { UserStorage } from '../models/user-storage.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  public get taskFinished(): Boolean {
    return JSON.parse(localStorage.getItem('task_finished'));
  }

  public get jobClaimed(): Boolean {
    return JSON.parse(localStorage.getItem('job_claimed'));
  }
  
  updateIdCard(updateData) {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = new URLSearchParams();
    body.set('identificationType', updateData.cardType);
    body.set('citizenIdentificationId', updateData.idNumber);
    body.set('issueDate', updateData.issueDate.format('DD/MM/YYYY'));
    return this.http.post(`${environment.apiUrl}/api/updateidcard`, body.toString(), { headers });
  }

  updatePassword(updateData) {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = new URLSearchParams();
    body.set('currentPassword', updateData.currentpassword);
    body.set('newPassword', updateData.newpassword);
    body.set('confirmPassword', updateData.confirmpassword);
    return this.http.post(`${environment.apiUrl}/api/changepassword`, body.toString(), { headers });
  }

  updateUser(userId, updateData) {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = new URLSearchParams();
    body.set('userId', userId);
    body.set('firstName', updateData.firstname);
    body.set('lastName', updateData.lastname);
    body.set('dateOfBirth', updateData.birth.format('DD/MM/YYYY'));
    body.set('username', updateData.username);
    body.set('phoneNumber', updateData.tel);
    body.set('email', updateData.email);
    body.set('address', updateData.address);
    return this.http.post(`${environment.apiUrl}/api/updateuserinfo`, body.toString(), { headers });
  }

  sendActivationEmail() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = new URLSearchParams();
    return this.http.post(`${environment.apiUrl}/api/resend`, body.toString(), { headers });
  }

  requestManager() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = new URLSearchParams();
    return this.http.post(`${environment.apiUrl}/api/requeststaff`, body.toString(), { headers });
  }

  findAvatar() {
    return this.http.get<UserImage[]>(`${environment.apiUrl}/api/upload/avatars`);
  }

  findAudio() {
    return this.http.get<UserStorage[]>(`${environment.apiUrl}/api/upload/audios`);
  }

  findManager() {
    return this.http.get<any>(`${environment.apiUrl}/api/requeststaff`).pipe(map(data => {
      localStorage.setItem('job_claimed', JSON.stringify(data.count > 0));
      return data;
    }));
  }

  findStatus() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const params = { type: 'status' };
    return this.http.get<StatusModel>(`${environment.apiUrl}/api/getinfo`, { headers, params }).pipe(map(status => {
      localStorage.setItem('task_finished', JSON.stringify(status.approveStatus === 1 && status.emailVerified !== 0));
      return status;
    }));
  }
  
}