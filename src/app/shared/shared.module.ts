import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { PrimeNGModule } from '../utilities/PrimeNG/primeng.module'; 
import { AppMenuComponent } from './components/menu/app.menu.component';
import { AppMenuitemComponent } from './components/menuitem/app.menuitem.component';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';  
import { MenuScrollComponent } from './components/menu-scroll/menu-scroll.component';
import { AppFooterComponent } from './components/footer/app.footer.component';
 
@NgModule({
  declarations: [   
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent, 
    MenuScrollComponent,
    AppFooterComponent
  ],
  imports: [
    CommonModule, 
    PrimeNGModule,
  ],
  exports:[   
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent, 
    MenuScrollComponent,
    AppFooterComponent
  ]
})
export class SharedModule { }
