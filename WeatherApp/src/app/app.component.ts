import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {env} from '../environments/environment'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  showFirstContent: boolean = false
  showSecondContent: boolean = false
  cityName: string = ""
  countryCode: string = ""
  latitude: number = 0
  longitude: number = 0
  data: any = []
  name: string = ""
  temp: number = 0
  feels_like: number = 0
  temp_min: number = 0
  temp_max: number = 0
  humidity: string = ""
  main: string = ""
  description: string = ""
  sunrise: string = ""
  sunset: string = ""
  errorMessage: any = ""
  successMessage : any = ""

  apiKey = env.API_KEY

  constructor(private http:HttpClient){}
  ngOnInit(): void {
  }

  inputCityText()
  {
    this.fetchCityData(this.cityName, this.countryCode)
  }

  inputLatLongText()
  {
    this.fetchLatLonData(this.latitude, this.longitude)
  }

  showContent(content: string) {
    this.cityName = ""
    this.countryCode = ""
    this.latitude = 0
    this.longitude = 0

    this.name = ""
    this.temp = 0
    this.feels_like = 0
    this.temp_min = 0
    this.temp_max = 0
    this.humidity = ""
    this.main = ""
    this.description = ""
    this.sunrise = ""
    this.sunset = ""

    if (content === 'first') {
      this.showFirstContent = true;
      this.showSecondContent = false;
    } else if (content === 'second') {
      this.showFirstContent = false;
      this.showSecondContent = true;
    }
  }

  showError(message: string) {
    this.errorMessage = message;

    // Hide the alert after 2 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 2000);
  }

  showSuccess(message: string) {
    this.successMessage = message;

    // Hide the alert after 2 seconds
    setTimeout(() => {
      this.successMessage = null;
    }, 2000);
  }

  fetchCityData(city: any, countryCode: any)
  {

    if(city.length < 1)
      {
        this.showError('City field is empty. Please check your input and try again.');
      }
    else if(countryCode < 1)
      {
        this.showError('Country code field is empty. Please check your input and try again.');
      }  
    else
    {
      this.http
      .get('https://api.openweathermap.org/data/2.5/weather?'+'q='+city+","+countryCode+'&units=metric&appid='+this.apiKey)
      .subscribe({
      next: (data: any) => {
        this.data = data;
        this.name = this.data.name;
        this.temp = this.data["main"].temp;
        this.feels_like = this.data["main"].feels_like;
        this.temp_min = this.data["main"].temp_min;
        this.temp_max = this.data["main"].temp_max;
        this.humidity = this.data["main"].humidity;
        this.main = this.data["weather"][0].main;
        this.description = this.data["weather"][0].description;

        let convSunriseTime = new Date(this.data["sys"].sunrise * 1000);
        let convSunsetTime = new Date(this.data["sys"].sunset * 1000);
        this.sunrise = convSunriseTime.toLocaleTimeString("en-US");
        this.sunset = convSunsetTime.toLocaleTimeString("en-US");
      },
      error: (error) => {
  
        if (error.status === 404) {
          this.showError('Failed to get weather data. Please check your inputs and try again.');
        } else {
          this.showError('An error occurred while fetching the data. Please try again later.');
        }

        this.latitude = 0
        this.longitude = 0

        this.name = ""
        this.temp = 0
        this.feels_like = 0
        this.temp_min = 0
        this.temp_max = 0
        this.humidity = ""
        this.main = ""
        this.description = ""
        this.sunrise = ""
        this.sunset = ""
      },
      complete: () => {
        this.showSuccess('Weather Data fetching complete.');
      }
      })
    }
}

  fetchLatLonData(lat: any, long: any)
  {
    this.http
    .get('https://api.openweathermap.org/data/2.5/weather?'+'lat='+lat+'&lon='+long+'&units=metric&appid='+this.apiKey)
    .subscribe({
      next: (data: any) => {
        this.data = data
        this.name = this.data.name
        this.temp = this.data["main"].temp
        this.feels_like = this.data["main"].feels_like
        this.temp_min = this.data["main"].temp_min
        this.temp_max = this.data["main"].temp_max
        this.humidity = this.data["main"].humidity
        this.main = this.data["weather"][0].main
        this.description = this.data["weather"][0].description
        let convSunriseTime = new Date(this.data["sys"].sunrise * 1000);
        let convSunsetTime = new Date(this.data["sys"].sunset * 1000);
        this.sunrise = convSunriseTime.toLocaleTimeString("en-US")
        this.sunset = convSunsetTime.toLocaleTimeString("en-US")
      },
      error: (error) => {
  
        if (error.status === 404) {
          this.showError('Failed to get weather data. Please check your inputs and try again.');
        } else {
          this.showError('An error occurred while fetching the data. Please try again later.');
        }

        this.latitude = 0
        this.longitude = 0

        this.name = ""
        this.temp = 0
        this.feels_like = 0
        this.temp_min = 0
        this.temp_max = 0
        this.humidity = ""
        this.main = ""
        this.description = ""
        this.sunrise = ""
        this.sunset = ""
      },
      complete: () => {
        this.showSuccess('Weather Data fetching complete.');
      }
    })
  }
}

