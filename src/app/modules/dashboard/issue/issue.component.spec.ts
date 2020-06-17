import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueComponent } from './issue.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';

describe('IssueComponent', () => {
  let component: IssueComponent;
  let fixture: ComponentFixture<IssueComponent>;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ApolloTestingModule
      ],
      declarations: [ IssueComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueComponent);
    component = fixture.componentInstance;

    component.issue = {
      id: 'testId',
      title: 'test issue title',
      body: 'test issue body',
      repository: {
        name: 'test repo',
        resourcePath: 'test repo resource path'
      },
      resourcePath: 'test resource'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
