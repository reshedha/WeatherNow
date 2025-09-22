import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const __dirname=dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/public'));
const weather_key =process.env.WEATHER_KEY;
let url="https://api.openweathermap.org/data/2.5/weather?";
app.use(bodyParser.urlencoded({ extended: true }));

//date and time
function timmer(){
let now=new Date();
let hours=now.getHours();
if(hours>=18 || hours<6){
    return "background-color: rgba(0,0,0,0.9)";  // night
}
else{
      return "background-color: rgba(255, 255, 255,1)";  // day
}
}
setInterval(timmer,60*60*1000);
app.get("/", async (req, res) => {
      let bgcoloring = timmer();
      console.log(bgcoloring);
      res.render("index.ejs",{bgcoloring});
});
function coloring(temp){
  if (temp <=10) return 'background-image:linear-gradient(45deg,#6aeff0,#1e8378)';
  else if (temp <= 30) return  'background-image:linear-gradient(45deg,#d6ee11,#355002)';
  else return 'background-image:linear-gradient(45deg,#e24b00,#e0ab06)';
}

app.post("/submit",async (req, res) => {
   let city=req.body["city"].trim();
   let country=req.body["country"].trim();
   let output=`${url}q=${city},${country}&appid=${weather_key}`;
   try{
    let outputres=await axios.get(output);
    let temp=(outputres.data.main.feels_like-273.15).toFixed(2);
    let color=coloring(temp);
    let humi=outputres.data.main.humidity;
    let pres=outputres.data.main.pressure;
    let visib=(outputres.data.visibility/1000).toFixed(1);
    let weather={city:city,temperature:temp,humidity:humi,pressure:pres,visibility:visib};
    console.log({weather,color});
    res.render("index.ejs",{weather,color,bgcoloring:timmer()});
   }
   catch(error){
    res.render("index.ejs",{warning:"not found",bgcoloring:timmer()});
    console.error("failed to fetch activity",error);
   } 
   });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

