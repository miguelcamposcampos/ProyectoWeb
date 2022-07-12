import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { PrimeNGModule } from '../utilities/PrimeNG/primeng.module';
import { AppBreadcrumbComponent } from './components/breadcrumb/app.breadcrumb.component'; 
import { AppConfigComponent } from './components/config/app.config.component'; 
import { AppMenuComponent } from './components/menu/app.menu.component';
import { AppMenuitemComponent } from './components/menuitem/app.menuitem.component';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';  
import { MenuScrollComponent } from './components/menu-scroll/menu-scroll.component';
 
@NgModule({
  declarations: [  
    AppBreadcrumbComponent, 
    AppConfigComponent, 
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent, 
    MenuScrollComponent
  ],
  imports: [
    CommonModule, 
    PrimeNGModule,
  ],
  exports:[  
    AppBreadcrumbComponent, 
    AppConfigComponent, 
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent, 
    MenuScrollComponent
  ]
})
export class SharedModule { }
