import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent {
  constructor(private supabaseService: SupabaseService) {}

  async sendInterviewEmail(candidate: any) {
    const interviewLink = 'https://calendly.com/interview-slot'; // Example link

    const emailSent = await this.supabaseService.sendEmail(
      candidate.email,
      candidate.name,
      candidate.jobTitle,
      'YourCompany',
      interviewLink
    );

    if (emailSent) {
      console.log('Email sent successfully!');
    } else {
      console.error('Error sending email');
    }
  }
}
