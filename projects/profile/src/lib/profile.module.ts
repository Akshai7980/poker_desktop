import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { ShareModule } from 'src/app/modules/share/share.module';

import { ActionDialogComponent } from './components/action-dialog/action-dialog.component';
import { AvatarSelectionComponent } from './components/avatar-selection/avatar-selection.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DocumentVerificationComponent } from './components/document-verification/document-verification.component';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';
import { KycDocumentsVerifiedComponent } from './components/kyc-documents-verified/kyc-documents-verified.component';
import { KycComponent } from './components/kyc/kyc.component';
import { ManageCardsComponent } from './components/manage-cards/manage-cards.component';
import { PanComponent } from './components/pan/pan.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { ProfileStepsComponent } from './components/profile-steps/profile-steps.component';
import { SelfieComponent } from './components/selfie/selfie.component';
import { AlphanumericDirective } from './directives/alphanumeric-only.directive';
import { AutocompleteOffDirective } from './directives/autocomplete-off.directive';
import { InputNumberOnlyDirective } from './directives/numbers-only.directive';
import { MaterialModule } from './material.module';
import PrimengModule from './primeng.module';
import { PokerProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    PokerProfileComponent,
    ProfileStepsComponent,
    PersonalDetailsComponent,
    DocumentVerificationComponent,
    PanComponent,
    EditUsernameComponent,
    ChangePasswordComponent,
    ManageCardsComponent,
    ActionDialogComponent,
    KycComponent,
    SelfieComponent,
    KycDocumentsVerifiedComponent,
    AvatarSelectionComponent,
    AlphanumericDirective,
    AutocompleteOffDirective,
    InputNumberOnlyDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    NgxSharedModule,
    PdfViewerModule
  ],
  exports: [PokerProfileComponent]
})
export class NgxProfileModule {}
