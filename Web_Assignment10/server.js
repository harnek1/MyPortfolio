var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis");

client = redis.createClient({
  url: ""
  , password: ""
});

client.connect();

client.on("error", function (err) {
  console.log("Error: " + err)
});


async function create_Log(msg) {

  let exists = await client.exists("log:");

  let log;

  if (exists == 0) 
  {
    log = 1;

    await client.set("log:", log);
  }
  else 
  {
    log = await client.get("log:");
  }

  await client.set("log:" + log, msg);
  await client.set("log:", parseInt(log) + 1);

}

async function track_Help_Command() 
{
  let help_Exists = await client.exists("help_Command:");

  let help_Count;

  if (help_Exists == 0) 
  {
    help_Count = 1;

    await client.set("help_Command:", help_Count);
  }
  else 
  {
    help_Count = await client.get("help_Command:");
  }

  await client.set("help_Command:" + help_Count, "The help command has been entered: " + help_Count + " time(s)");
  await client.set("help_Command:", parseInt(help_Count) + 1);

}

async function track_Bath_Bed_Command() 
{
  let bath_Bed_Exists = await client.exists("bath_Bed_Command:");

  let bath_Bed_Count;

  if (bath_Bed_Exists == 0) 
  {
    bath_Bed_Count = 1;

    await client.set("bath_Bed_Command:", bath_Bed_Count);
  }
  else 
  {
    bath_Bed_Count = await client.get("bath_Bed_Command:");
  }

  await client.set("bath_Bed_Command:" + bath_Bed_Count, "The bathrooms bedrooms command has been entered: " + bath_Bed_Count + " time(s)");
  await client.set("bath_Bed_Command:", parseInt(bath_Bed_Count) + 1);

}

async function track_Bath_Command() {

  let bath_Exists = await client.exists("bath_Command:");

  let bath_Count;

  if (bath_Exists == 0) 
  {
    bath_Count = 1;

    await client.set("bath_Command:", bath_Count);
  }
  else 
  {
    bath_Count = await client.get("bath_Command:");
  }

  await client.set("bath_Command:" + bath_Count, "The bathrooms command has been entered: " + bath_Count + " time(s)");
  await client.set("bath_Command:", parseInt(bath_Count) + 1);

}

async function track_Min_Max_Command() 
{

  let min_Max_Exists = await client.exists("min_Max_Command:");

  let min_Max_Count;

  if (min_Max_Exists == 0) 
  {
    min_Max_Count = 1;

    await client.set("min_Max_Command:", min_Max_Count);
  }
  else 
  {
    min_Max_Count = await client.get("min_Max_Command:");
  }

  await client.set("min_Max_Command:" + min_Max_Count, "The min max command has been entered: " + min_Max_Count + " time(s)");
  await client.set("min_Max_Command:", parseInt(min_Max_Count) + 1);

}

async function track_Contact_Command() 
{

  let contact_Exists = await client.exists("contact_Command:");

  let contact_Count;

  if (contact_Exists == 0) 
  {
    contact_Count = 1;

    await client.set("contact_Command:", contact_Count);
  }
  else 
  {
    contact_Count = await client.get("contact_Command:");

  }

  await client.set("contact_Command:" + contact_Count, "The contact command has been entered: " + contact_Count + " time(s)");
  await client.set("contact_Command:", parseInt(contact_Count) + 1);

}


io.on('connection', (socket) => {

  socket.on("chat message", function (msg) {

    if (msg === "help") 
    {
      create_Log(msg)
      track_Help_Command()

      msg += `<li> help - shows a listing of all commands<br/><br/>
      bathrooms 3 – shows all houses with 3 or more bathrooms<br/><br/>
      bathrooms 3 bedrooms 2 - shows all houses with 3 or more bathrooms, 2 or more bedrooms<br/><br/>
      min 779900 max 1925000 - shows all houses with minimum price of 779900 and maximum price of 1925000<br/><br/>
      Contact - shows the contact information for the website</li>`

    } else if (msg.split(" ")[0] === "bathrooms" && msg.split(" ")[2] === "bedrooms") 
    {
      create_Log(msg)
      track_Bath_Bed_Command()

      if (msg.split(" ")[1] && msg.split(" ")[3]) 
      {
        let json = data.filter(data => data.bathrooms >= msg.split(" ")[1] && data.bedrooms >= msg.split(" ")[3])
        if (json.length > 0) 
        {
          for (let i = 0; i < json.length; i++) 
          {
            msg += "<ul class='list-group'>" +
              "<li class='list-group-item'>" + json[i].address + "&nbsp" + json[i].city + "&nbsp" + json[i].postal_code + "&nbsp" +
              "&nbsp" + json[i].community + "&nbsp" + json[i].province + "&nbsp" + json[i].price
              + json[i].bedrooms + json[i].bathrooms
              + '<img src="' + json[i].img + '">'
              + json[i].description +
              "<li>" + "</ul>"
          }
        } else 
        {
          msg += "<li>" + "sorry, no houses were found with bedrooms " + msg.split(" ")[1] + " or more, " + msg.split(" ")[3] + " or more bedrooms" + "</li>"
        }
      } else 
      {
        msg += "<li>" + "Please specify number of bathrooms and bedrooms with a space after bathrooms and a space after bedrooms" + "</li>"
      }
    } else if (msg.split(" ")[0] === "bathrooms") 
    {
      create_Log(msg)
      track_Bath_Command()

      if (msg.length === 11) 
      {
        let json = data.filter(data => data.bathrooms >= msg.split(" ")[1])
        for (let i = 0; i < json.length; i++) 
        {
          msg += "<ul class='list-group'>" +
            "<li class='list-group-item'>" + json[i].address + "&nbsp" + json[i].city + "&nbsp" + json[i].postal_code + "&nbsp" +
            "&nbsp" + json[i].community + "&nbsp" + json[i].province + "&nbsp" + json[i].price
            + json[i].bedrooms + json[i].bathrooms
            + '<img src="' + json[i].img + '">'
            + json[i].description +
            "<li>" + "</ul>"
        }
      } else if (msg.length < 11) 
      {
        msg += "<li>" + "Please specify number of bathrooms with a space after bathrooms" + "</li>"

      } else if (msg.length > 11) 
      {
        msg += "<li>" + "Sorry, you did not enter a vaild command" + "</li>"
      }
    } else if (msg.split(" ")[0] === "min" && msg.split(" ")[2] === "max") 
    {
      create_Log(msg)
      track_Min_Max_Command()

      let json = data.filter(data => data.price >= msg.split(" ")[1] && data.price <= msg.split(" ")[3])
      if (json.length > 0) 
      {
        for (let i = 0; i < json.length; i++) 
        {
          msg += "<ul class='list-group'>" +
            "<li class='list-group-item'>" + json[i].address + "&nbsp" + json[i].city + "&nbsp" + json[i].postal_code + "&nbsp" +
            "&nbsp" + json[i].community + "&nbsp" + json[i].province + "&nbsp" + json[i].price
            + json[i].bedrooms + json[i].bathrooms
            + '<img src="' + json[i].img + '">'
            + json[i].description +
            "<li>" + "</ul>"
        }
      } else 
      {
        msg += "<li>" + "sorry, no houses were found with a min of: " + msg.split(" ")[1] + " and a max of: " + msg.split(" ")[3] + "</li>"
      }
    } else if (msg.split(" ")[0] === "Contact")
    {
      create_Log(msg)
      track_Contact_Command()
      msg += "<li>" + "You can contact us at hbhalru@mcmaster.ca" + "</li>"

    } else 
    {
      msg += "<li>" + "Sorry, you did not enter a vaild command" + "</li>"
    }

    io.emit("chat message", msg + "<br/>" + "<li>Do you have another question?</li>");
  })


  socket.on('disconnect', () => {
   
  });

});


const data =
  [
    {
      address: "224 EAST 25TH ST",
      postal_code: "L8V 3A5",
      city: "Hamilton",
      community: "Mountain",
      province: "Ontario",
      price: 779900,
      bedrooms: 4,
      bathrooms: 3,
      img: "224east.jpeg",
      description: "Beautiful 100% Turn-Key 1.5 Storey Home On East Mountain Feat 3+1 Beds, 3 Baths, In-Law Suite W/ Duplex Conversion Potential, Ample Storage Space, Detached Garage, Up To 5 Car Parking, & Waterproofed Bsmt."
    },

    {
      address: "183 Kitty Murray Lane",
      postal_code: "L9K 1H7",
      city: "Hamilton",
      community: "Ancaster",
      province: "Ontario",
      price: 1050000,
      bedrooms: 4,
      bathrooms: 4,
      img: "183kitty.jpeg",
      description: "Steps to Meadowlands,schools, parks and easy access to 403/LINC. 2 Storey, 3+1 bedrm,3.5 baths with large backyard. Hardwood stairs and hardwood floors in all principal and bed rooms, no carpet! "
    },

    {
      address: "20 ERINGATE Court",
      postal_code: "L8J 3Y4",
      city: "Hamilton",
      community: "Stoney Creek",
      province: "Ontario",
      price: 1925000,
      bedrooms: 4,
      bathrooms: 4,
      img: "20eringate.jpeg",
      description: "Built by award winning Zeina Homes. All brick on the sides and rear. Modern open concept main floor has 9ft ceiling, oak staircase with iron spindles, hardwood floors on main level and upper hallways, oversized windows, large kitchen with custom extended height cabinets, granite counters, large island, stainless steel appliances and porcelain tiles."
    },

    {
      address: "11 Cloverhill Avenue",
      postal_code: "L8J 3Y4",
      city: "Hamilton",
      community: "Dundas",
      province: "Ontario",
      price: 899900,
      bedrooms: 3,
      bathrooms: 3,
      img: "11cloverhill.jpeg",
      description: "Fabulous home and property in sought after Dundas neighborhood. Superb location on a quiet cul de sac just a short walk to downtown Dundas's shops, restaurants and amenities."
    },

    {
      address: "257 PARKSIDE Drive Unit# 8",
      postal_code: "L8B 0W5",
      city: "Hamilton",
      community: "Waterdown",
      province: "Ontario",
      price: 799900,
      bedrooms: 2,
      bathrooms: 3,
      img: "257parkside.jpeg",
      description: "This condo townhome boasts two huge bedrooms, both with 4-piece ensuite bathrooms. The laundry is also on the bedroom level with custom California Closet built-ins around it. The main floor is stunning! Open concept living/dining room and kitchen with a breakfast bar."
    },

  ];

app.get('/search', function (req, res) {

  res.sendFile(__dirname + "/search.html")

});

app.get('/home', function (req, res) {

  res.sendFile(__dirname + "/home.html")

});

app.get('/community_search', function (req, res) {

  res.json(data.filter((house) => house.community == req.query.community));

});

app.get('/price_search', function (req, res) {

  res.json(data.filter((house) => (house.price <= req.query.max &&
    house.price >= req.query.min)));

});

app.get('/bed_search', function (req, res) {

  res.json(data.filter((house) => (house.bedrooms >= req.query.bedrooms)));

});

app.get('/bathroom_search', function (req, res) {

  res.json(data.filter((house) => (house.bathrooms >= req.query.bathrooms)));

});

app.get('/all', function (req, res) {

  res.json(data);

});

app.get('/', function(req, res) {
  res.redirect('/home');
});

// Send back a static file
// Use a regular expression to detect "any other route"
// Define the route last such that other routes would
// be detected and handled as such first.
app.get(/^(.+)$/, function (req, res) {
  console.log("static file request: " + req.params[0]);
  res.sendFile(__dirname + req.params[0]);
});

var server = http.listen(3000, function () {
  console.log("App listening....");
});
