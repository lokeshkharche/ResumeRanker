import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.css']
})
export class ComposeMailComponent implements OnInit {
  emailListString: string = '';
  emailList: string[] = [];
  subject: string = '';
  message: string = '';
  isSending: boolean = false;
  sendStatus: string = '';

  constructor(private router: Router, private jobService: JobService) {}

  ngOnInit(): void {
    const navState = history.state;
    const candidateIds: string[] = navState?.candidateIds || [];

    if (candidateIds.length > 0) {
      this.jobService.getCandidateEmailsByIds(candidateIds).then(emails => {
        this.emailList = emails;
        this.emailListString = emails.join(', ');
      });
    }
  }

  updateEmailList(value: string) {
    this.emailListString = value;
    this.emailList = value.split(',').map(email => email.trim());
  }

  async sendMail() {
    this.isSending = true;
    this.sendStatus = '';

    const result = await this.jobService.getComposeMail(this.emailList, this.subject, this.message);

    if (result === 1) {
      this.sendStatus = '✅ Email sent successfully!';
    } else {
      this.sendStatus = '❌ Failed to send email.';
    }

    this.isSending = false;
  }
}
