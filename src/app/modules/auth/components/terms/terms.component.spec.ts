import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AUTH, NetworkService } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { TermsComponent } from './terms.component';

describe('LoginComponent', () => {
  let httpBackend: any;
  let myService: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [TermsComponent],
      providers: [
        NetworkService,
        AuthService,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TermsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should get data from getTermsAndConditionsAPI', () => {
    const requestData = {
      code: 200,
      message: 'Success',
      data: {
        page_id: 70,
        page_name: 'Adda52 - Terms of Use',
        url: 'terms-of-use',
        page_type: 'cms',
        game_type: 'poker',
        site: 'adda52',
        page_description:
          '<p style="text-align: justify;"><strong>DEFINITIONS AND GETTING STARTED</strong></p>\n<p style="text-align: justify;">The terms of use is an agreement between Gaussian Networks Private Limited and all its subsidiaries, from here on referred to as the &ldquo;company&rdquo; (the company could also be referred to as &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo; and other such adjectives), including its website&nbsp;<a href="https://www.adda52.com/"><strong><span style="text-decoration: underline;">www.Adda52.com</span></strong></a>, from here on is referred to as the &ldquo;website&rdquo; and you from here on will be referred as &ldquo;you&rdquo;, &ldquo;your&rdquo;, &ldquo;user&rdquo; or &ldquo;player&rdquo;.</p>\n<p style="text-align: justify;">The agreement must be read by you (user)&nbsp; completely and well understood before you agree to the terms of use governing any and all relationship in this agreement and&nbsp; terms of services, products or information and there usage, from here on are referred to as &ldquo;Terms and conditions&rdquo;. The user should read, understand and agree to the terms of use which includes those terms and conditions expressly set out below and those incorporated by reference, which you can access by clicking on the relevant link.</p>\n<p style="text-align: justify;"><strong>DEFINITION OF "MEMBERSHIP"</strong></p>\n<p style="text-align: justify;">',
        seo_title: 'Terms of Use | Adda52.com',
        seo_title_new: 'Terms of Use | Adda52.com',
        seo_description: 'User Terms and Conditions for playing on Adda52.com',
        seo_description_new: 'User Terms and Conditions for playing on Adda52.com',
        page_heading: 'TERMS OF USE',
        left_tab: 18,
        seo_keyword: '',
        seo_keyword_new: '',
        author: 'bhupendrachahar',
        author_remarks: 'Arunachal Pradesh update',
        status: 'approved',
        approver: 'bhupendrachahar',
        modified_on: '2021-02-19T01:21:20.000Z',
        new_url_name: 'terms-of-use',
        new_side_link: 'terms',
        data: null,
        id: 18,
        tab_name: 'About Us',
        tab_location: 'about_us/about_us_tabs'
      }
    };
    const expectedResponse = { success: true };

    httpBackend?.expect(AUTH.TERMS_AND_CONDITIONS).respond(expectedResponse);

    myService?.getData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });
});
