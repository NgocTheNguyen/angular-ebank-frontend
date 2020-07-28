import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { fromEvent, Subscription } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { ManagementService } from '../../services/management.service';
import { UserModel } from '../../models/user.model';
import { UserDataSource } from '../../modules/template/user-datasource.module';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [ManagementService]
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser: UserModel;
  dataSource: UserDataSource;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'address', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') searchInput: ElementRef;
  @ViewChild(MatSelect) select: MatSelect;
  subscriptions: Subscription;

  constructor(private auth: AuthenticationService, private management: ManagementService) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.dataSource = new UserDataSource(this.management);
  }

  ngAfterViewInit(): void {
    if (this.searchInput && this.paginator && this.select) {
      this.subscriptions.add(fromEvent(this.searchInput.nativeElement, 'keyup').pipe(debounceTime(200), distinctUntilChanged(), tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersPage();
      })).subscribe());
      this.subscriptions.add(this.paginator.page.pipe(tap(() => this.loadUsersPage())).subscribe());
      this.subscriptions.add(this.select.selectionChange.pipe(tap(() => this.loadUsersPage())).subscribe());
    }
    if (this.currentUser && this.currentUser.userType === 0) {
      this.loadUsersPage();
    }
  }

  loadUsersPage() {
    this.dataSource.loadUsers(this.paginator.pageIndex, this.paginator.pageSize, this.select.value, this.searchInput.nativeElement.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
