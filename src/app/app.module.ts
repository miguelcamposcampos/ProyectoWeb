import {LOCALE_ID, NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
 
import {AppComponent} from './app.component'; 
  
import {AppBreadcrumbService} from './shared/services/app.breadcrumb.service';
import { InterceptorService } from './auth/services/interceptor.service';
import { MenuService } from './shared/services/app.menu.service';  
import { SharedModule } from './shared/shared.module';
 
  
import { registerLocaleData } from '@angular/common';  
import localePy from '@angular/common/locales/es-Pe';   
registerLocaleData(localePy, 'es');



@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule, 
    ],
    declarations: [
        AppComponent, 
    ],
    
    providers: [
        DatePipe,
        {
            provide: LocationStrategy,  
            useClass: HashLocationStrategy
        }, 
        { provide: LOCALE_ID, useValue: 'es' },
        MenuService,
        AppBreadcrumbService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true,    
        },  
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
