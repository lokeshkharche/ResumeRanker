import { Component } from '@angular/core';
import { SupaService } from './services/supa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'resume-ranker';
  constructor(private supaService: SupaService) {}

  async ngOnInit() {
    
      console.log('Refreshing session...');
      await this.supaService.refreshSession();
    
  }
}
