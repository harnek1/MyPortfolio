import React, { useState, } from 'react';
import axios from 'axios';
import './App.css';

function App() {

 const listOfCountries =
  {
    "AED": "UAE Dirham",
    "AFN": "Afghan Afghani",
    "ALL": "Albanian Lek",
    "AMD": "Armenian Dram",
    "ANG": "Netherlands Antillian Guilder",
    "AOA": "Angolan Kwanza",
    "ARS": "Argentine Peso",
    "AUD": "Australian Dollar",
    "AWG": "Aruban Florin",
    "AZN": "Azerbaijani Manat",
    "BAM": "Bosnia and Herzegovina Mark",
    "BBD": "Barbados Dollar",
    "BDT": "Bangladeshi Taka",
    "BGN": "Bulgarian Lev",
    "BHD": "Bahraini Dinar",
    "BIF": "Burundian Franc",
    "BMD": "Bermudian Dollar",
    "BND": "Brunei Dollar",
    "BOB": "Bolivian Boliviano",
    "BRL": "Brazilian Real",
    "BSD": "Bahamian Dollar",
    "BTN": "Bhutanese Ngultrum",
    "BWP": "Botswana Pula",
    "BYN": "Belarusian Ruble",
    "BZD": "Belize Dollar",
    "CAD": "Canadian Dollar",
    "CDF": "Congolese Franc",
    "CHF": "Swiss Franc",
    "CLP": "Chilean Peso",
    "CNY": "Chinese Renminbi",
    "COP": "Colombian Peso",
    "CRC": "Costa Rican Colon",
    "CUP": "Cuban Peso",
    "CVE": "Cape Verdean Escudo",
    "CZK": "Czech Koruna",
    "DJF": "Djiboutian Franc",
    "DKK": "Danish Krone",
    "DOP": "Dominican Peso",
    "DZD": "Algerian Dinar",
    "EGP": "Egyptian Pound",
    "ERN": "Eritrean Nakfa",
    "ETB": "Ethiopian Birr",
    "EUR": "Euro",
    "FJD": "Fiji Dollar",
    "FKP": "Falkland Islands Pound",
    "FOK": "Faroese Króna",
    "GBP": "Pound Sterling",
    "GEL": "Georgian Lari",
    "GGP": "Guernsey Pound",
    "GHS": "Ghanaian Cedi",
    "GIP": "Gibraltar Pound",
    "GMD": "Gambian Dalasi",
    "GNF": "Guinean Franc",
    "GTQ": "Guatemalan Quetzal",
    "GYD": "Guyanese Dollar",
    "HKD": "Hong Kong Dollar",
    "HNL": "Honduran Lempira",
    "HRK": "Croatian Kuna",
    "HTG": "Haitian Gourde",
    "HUF": "Hungarian Forint",
    "IDR": "Indonesian Rupiah",
    "ILS": "Israeli New Shekel",
    "IMP": "Manx Pound",
    "INR": "Indian Rupee",
    "IQD": "Iraqi Dinar",
    "IRR": "Iranian Rial",
    "ISK": "Icelandic Króna",
    "JEP": "Jersey Pound",
    "JMD": "Jamaican Dollar",
    "JOD": "Jordanian Dinar",
    "JPY": "Japanese Yen",
    "KES": "Kenyan Shilling",
    "KGS": "Kyrgyzstani Som",
    "KHR": "Cambodian Riel",
    "KID": "Kiribati Dollar",
    "KMF": "Comorian Franc",
    "KRW": "South Korean Won",
    "KWD": "Kuwaiti Dinar",
    "KYD": "Cayman Islands Dollar",
    "KZT": "Kazakhstani Tenge",
    "LAK": "Lao Kip",
    "LBP": "Lebanese Pound",
    "LKR": "Sri Lanka Rupee",
    "LRD": "Liberian Dollar",
    "LSL": "Lesotho Loti",
    "LYD": "Libyan Dinar",
    "MAD": "Moroccan Dirham",
    "MDL": "Moldovan Leu",
    "MGA": "Malagasy Ariary",
    "MKD": "Macedonian Denar",
    "MMK": "Burmese Kyat",
    "MNT": "Mongolian Tögrög",
    "MOP": "Macanese Pataca",
    "MRU": "Mauritanian Ouguiya",
    "MUR": "Mauritian Rupee",
    "MVR": "Maldivian Rufiyaa",
    "MWK": "Malawian Kwacha",
    "MXN": "Mexican Peso",
    "MYR": "Malaysian Ringgit",
    "MZN": "Mozambican Metical",
    "NAD": "Namibian Dollar",
    "NGN": "Nigerian Naira",
    "NIO": "Nicaraguan Córdoba",
    "NOK": "Norwegian Krone",
    "NPR": "Nepalese Rupee",
    "NZD": "New Zealand Dollar",
    "OMR": "Omani Rial",
    "PAB": "Panamanian Balboa",
    "PEN": "Peruvian Sol",
    "PGK": "Papua New Guinean Kina",
    "PHP": "Philippine Peso",
    "PKR": "Pakistani Rupee",
    "PLN": "Polish Złoty",
    "PYG": "Paraguayan Guaraní",
    "QAR": "Qatari Riyal",
    "RON": "Romanian Leu",
    "RSD": "Serbian Dinar",
    "RUB": "Russian Ruble",
    "RWF": "Rwandan Franc",
    "SAR": "Saudi Riyal",
    "SBD": "Solomon Islands Dollar",
    "SCR": "Seychellois Rupee",
    "SDG": "Sudanese Pound",
    "SEK": "Swedish Krona",
    "SGD": "Singapore Dollar",
    "SHP": "Saint Helena Pound",
    "SLE": "Sierra Leonean Leone",
    "SOS": "Somali Shilling",
    "SRD": "Surinamese Dollar",
    "SSP": "South Sudanese Pound",
    "STN": "São Tomé and Príncipe Dobra",
    "SYP": "Syrian Pound",
    "SZL": "Eswatini Lilangeni",
    "THB": "Thai Baht",
    "TJS": "Tajikistani Somoni",
    "TMT": "Turkmenistan Manat",
    "TND": "Tunisian Dinar",
    "TOP": "Tongan Paʻanga",
    "TRY": "Turkish Lira",
    "TTD": "Trinidad and Tobago Dollar",
    "TVD": "Tuvaluan Dollar",
    "TWD": "New Taiwan Dollar",
    "TZS": "Tanzanian Shilling",
    "UAH": "Ukrainian Hryvnia",
    "UGX": "Ugandan Shilling",
    "USD": "United States Dollar",
    "UYU": "Uruguayan Peso",
    "UZS": "Uzbekistani So'm",
    "VES": "Venezuelan Bolívar Soberano",
    "VND": "Vietnamese Đồng",
    "VUV": "Vanuatu Vatu",
    "WST": "Samoan Tālā",
    "XAF": "Central African CFA Franc",
    "XCD": "East Caribbean Dollar",
    "XDR": "Special Drawing Rights",
    "XOF": "West African CFA franc",
    "XPF": "CFP Franc",
    "YER": "Yemeni Rial",
    "ZAR": "South African Rand",
    "ZMW": "Zambian Kwacha",
    "ZWL": "Zimbabwean Dollar"
  };

 const API_KEY = process.env.REACT_APP_API_KEY;

 var [alert, setAlert] = useState(null);

 var [fromCur, setFromCur] = useState("");
 var [toCur, setToCur] = useState("");
 var [amount, setAmount] = useState(0.0);

 var [conversionRate, setConversionRate] = useState(0.0);
 var [conversionResult, setConversionResult] = useState(0.0);
 var [lastUpdateUtc, setLastUpdateUtc] = useState("");
 var [nextUpdateUtc, setNextUpdateUtc] = useState("");
 
 var handleSelectChange = (event) => {
  setFromCur(event.target.value);
  setConversionRate(0.0);
  setConversionResult(0.0);
  setLastUpdateUtc("");
  setNextUpdateUtc("");
};

var handleSelectChange2 = (event) => {
  setToCur(event.target.value);
  setConversionRate(0.0);
  setConversionResult(0.0);
  setLastUpdateUtc("");
  setNextUpdateUtc("");
};

var handleAmountChange = (event) => {
  setAmount(event.target.value);
};


const triggerAlert = (message, type) => {
  setAlert({ message, type });

  setTimeout(() => {
    setAlert(null);
  }, 2000);

};


const handleSubmit = (event) => {
  event.preventDefault();

    if ((fromCur && toCur) && (fromCur !== toCur)  && (amount > 0)) {
      axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCur}/${toCur}/${amount}`)
        .then(response => {
        setConversionRate(response.data.conversion_rate);
        setConversionResult(response.data.conversion_result);
        setLastUpdateUtc(response.data.time_last_update_utc);
        setNextUpdateUtc(response.data.next_update_utc);

        var date = new Date(response.data.time_last_update_utc);
        var date2 = new Date(response.data.time_next_update_utc);

        setLastUpdateUtc(date.toLocaleString());
        setNextUpdateUtc(date2.toLocaleString());
        })
        .catch(error => {
          console.log(error);
          
        });
    }
    else if (!fromCur || !toCur) 
    {
      triggerAlert("Please select a Country/currency", 'danger');
    } 

    else if (fromCur === toCur) 
    {
      triggerAlert('Please select a different Country/currency', 'danger');
    } 
     else if (amount <= 0) 
    {
      triggerAlert('Please enter an amount greater than zero', 'danger');
    }
  };

  return (
    <div className="App">
      <h1>Currency Exchange App</h1>
    {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setAlert(null)} // Dismiss the alert
          ></button>
        </div>
      )}
       <form onSubmit={handleSubmit}>
      <label className="form-label">From:</label>
       <select className="form-select" onChange={handleSelectChange}>
       <option>Please select a currency</option>
      {Object.entries(listOfCountries).map(([code, name]) => (
        <option key={code} value={code}>
          {code} - {name}
        </option>
      ))}
    </select>
    <br/>
    <label className="form-label">To:</label>
       <select className="form-select" onChange={handleSelectChange2} >
       <option>Please select a currency</option>
      {Object.entries(listOfCountries).map(([code, name]) => (
        <option key={code} value={code}>
          {code} - {name}
        </option>
      ))}
    </select>
    <br/>
    <label className="form-label">Amount:</label>
    <input type="number" className="form-control" value={amount} onChange={handleAmountChange}></input>
    <button type="submit"  id="submitButton" className="btn btn-primary">Submit</button>
    </form>
    <br/>

    <p>From: {fromCur} &nbsp;&nbsp; To: {toCur}</p>
    <p>Conversion Rate: {conversionRate}</p>
    <p>Converted Amount: {conversionResult} {toCur}</p>
    <p>Last Update: {lastUpdateUtc} &nbsp;&nbsp; Next Update: {nextUpdateUtc}</p>
   
    <div className="alert alert-info" role="alert">
    Please note that the Argentine Peso, Libyan Dinar, South Sudanese Pound, Syrian Pound, Venezuelan Bolívar Soberano, 
    Yemeni Rial Zimbabwean Dollar. <br/><br/>These currencies experience heightened volatility substantial differences between 
    actual rates of exchange available in different markets and those published officially. In these instances we 
    default to the rates published by the appropriate central banks.
    </div>

  </div>
  );
}

export default App;
