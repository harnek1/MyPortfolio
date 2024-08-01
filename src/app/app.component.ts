import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import 'bootstrap/dist/css/bootstrap.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  httpClient = inject(HttpClient)
  showFirstButton: boolean = true
  showSecondButton: boolean = true
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
      this.showSecondContent = false;
      this.showFirstContent = true;
    } else if (content === 'second') {
      this.showFirstContent = false;
      this.showSecondContent = true;
    }
  }
  fetchCityData(city: any, countryCode: any)
  {
    this.httpClient
    .get('https://api.openweathermap.org/data/2.5/weather?'+'q='+city+","+countryCode+'&units=metric&appid=d407554f1a3fb85ef766edbea45fbe83')
    .subscribe((data: any) => {
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
      }
    )
  }

  fetchLatLonData(lat: any, long: any)
  {
    this.httpClient
    .get('https://api.openweathermap.org/data/2.5/weather?'+'lat='+lat+'&lon='+long+'&units=metric&appid=d407554f1a3fb85ef766edbea45fbe83')
    .subscribe((data: any) => {
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
      }
    )
  }
}
