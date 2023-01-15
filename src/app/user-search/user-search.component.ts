import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RepositoryUserService } from '../repository-user.service';
import { User } from '../user';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  user!: User;
  searchText!: string;
  displayUserDetailContainer = false;
  displayGithubUserErrorNotFound = false;
  repositories: any;
  displayUserRepositoryList = false;
  displayUserErrorMessage = false;
  repositoryUserService: any;
  constructor(private userservice: RepositoryUserService) { }

  //accessing form inputs
  @ViewChild('f')
  searchForm!: NgForm;

  ngOnInit(): void { }
  //search for a github user
  searchGithubUser() {
    this.searchText = this.searchForm.value.search;
    this.userservice.getUserResponse(this.searchText).then(
      (response) => {
        this.user = this.userservice.getUserDetails;
        this.displayUserDetailContainer = true;
      },
      (error) => {
        console.log(error);
        this.displayGithubUserErrorNotFound = true;
      }
    );
    this.userservice.getRepositoryResponse(this.searchText).then(
      async (response) => {
        this.repositories = this.userservice.getRepositoryDetails;

        for (let i = 0; i < this.repositories.length; i++) {
          fetch(this.repositories[i].languages_url + '?access_token=' +
            environment.apiKey)
            .then((response) => response.json())
            .then((langs) => {
              if (Object.keys(langs)[0] != 'message') {
                this.repositories[i].languages = Object.keys(langs);
                console.log(Object.keys(langs))
              }
            },
              (error) => {
                console.log(error);
              });
        }
        this.displayUserRepositoryList = true;
      },
      (error) => {
        this.displayUserErrorMessage = true;
        console.log(error);
      }
    );

  }

}
