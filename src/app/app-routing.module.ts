import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [IntroGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'audiomessages',
    loadChildren: () => import('./pages/audiomessages/audiomessages.module').then( m => m.AudioMessagesPageModule)
  },
  {
    path: 'videomessages',
    loadChildren: () => import('./pages/videomessages/videomessages.module').then( m => m.VideoMessagesPageModule)
  },
  {
    path: 'donate',
    loadChildren: () => import('./pages/donate/donate.module').then( m => m.DonatePageModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./pages/announcement/announcement.module').then( m => m.announcementPageModule)
  },
  {
    path: 'testimony',
    loadChildren: () => import('./pages/testimony/testimony.module').then( m => m.TestimonyPageModule)
  },
  {
    path: 'radio',
    loadChildren: () => import('./pages/radio/radio.module').then( m => m.RadioPageModule)
  },
  {
    path: 'prayer-request',
    loadChildren: () => import('./pages/prayer-request/prayer-request.module').then( m => m.PrayerRequestPageModule)
  },

  { 
    path: 'contactDev', 
    loadChildren: () => import('./pages/admin/dev-contact/dev-contact.module').then( m => m.DevContactPageModule)
  },

  {
    path: 'auth',
    // canActivateChild: [FrontAuthGuard],
    children: [
      { 
        path: '', 
        // component: LoginComponent,
        loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
      },

      { 
        path: 'login', 
        // component: LoginComponent,
        loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
      },
    
      // { 
      //   path: 'signup', 
      //   loadChildren: () => import('./pages/auth/signup/signup.module').then( m => m.SignupPageModule)
      // },

      { 
        path: 'reset', 
        // component: ForgotPasswordComponent,
        loadChildren: () => import('./pages/auth/reset/reset.module').then( m => m.ResetPageModule)
      },

    ]
  },

  {
    path: 'admin',
    // canActivateChild: [FrontAuthGuard],
    children: [
      { 
        path: '', 
        loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      
      { 
        path: 'new-admin', 
        loadChildren: () => import('./pages/auth/signup/signup.module').then( m => m.SignupPageModule)
      },

      { 
        path: 'liveTV', 
        loadChildren: () => import('./pages/admin/live-tv/live-tv.module').then( m => m.LiveTVPageModule)
      },

      { 
        path: 'details', 
        loadChildren: () => import('./pages/admin/detailz/detailz.module').then( m => m.DetailzPageModule)
      },

      { 
        path: 'testimonies', 
        loadChildren: () => import('./pages/admin/testiz/testiz.module').then( m => m.TestizPageModule)
      },

      { 
        path: 'contacts', 
        loadChildren: () => import('./pages/admin/contact-msg/contact-msg.module').then( m => m.ContactMsgPageModule)
      },

      { 
        path: 'announcements', 
        loadChildren: () => import('./pages/admin/announcez/announcez.module').then( m => m.AnnouncezPageModule)
      },

      { 
        path: 'prayer-requests', 
        loadChildren: () => import('./pages/admin/pray-requestz/pray-requestz.module').then( m => m.PrayRequestzPageModule)
      },

      { 
        path: 'audio-messages', 
        loadChildren: () => import('./pages/admin/audio-msg/audio-msg.module').then( m => m.AudioMsgPageModule)
      },

      { 
        path: 'video-messages', 
        loadChildren: () => import('./pages/admin/video-msg/video-msg.module').then( m => m.VideoMsgPageModule)
      },

      { 
        path: 'developers-contact', 
        loadChildren: () => import('./pages/admin/dev-contact/dev-contact.module').then( m => m.DevContactPageModule)
      },
      
      {
        path: 'settings',
        loadChildren: () => import('./pages/admin/settings/settings.module').then( m => m.SettingsPageModule)
      },
    ]
  },

  {
    path: '**',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
