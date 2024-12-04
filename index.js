const userTab = document.querySelector("[userTab]");
const searchTab = document.querySelector("[searchTab]");

const grantLocation = document.querySelector("[grantLocation]");
const searchForm = document.querySelector("[searchForm]");
const loadingScreen = document.querySelector("[loadingScreen]");
const showWeatherInfo = document.querySelector("[showWeatherInfo]");
//for background printing;
const wrapper = document.querySelector('#wrapper');


let currentTab = userTab;
const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';
currentTab.classList.add('currentTab');
getFromSessionStorage();

function switchTab(newTab){
  if(newTab != currentTab){
    currentTab.classList.remove('currentTab');
    currentTab = newTab;
    currentTab.classList.add('currentTab');
    
    if(!searchForm.classList.contains('active')){
      searchForm.classList.add('active');
      grantLocation.classList.remove('active');
      showWeatherInfo.classList.remove('active');
    }
    else{
      searchForm.classList.remove('active');
      showWeatherInfo.classList.remove('active');

      getFromSessionStorage();
    }
  }
}

userTab.addEventListener('click',()=>{
  
  switchTab(userTab);
  
});
searchTab.addEventListener('click',()=>{

  switchTab(searchTab);
  wrapper.style.backgroundImage = `linear-gradient(45deg, rgba(0, 255, 235, 1) 0%, rgba(7, 58, 187, 1) 100%)`;

});


function getFromSessionStorage(){
  let localCoordinates = sessionStorage.getItem('user-coordinates');
  if(!localCoordinates){
    grantLocation.classList.add('active');
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherinfo(coordinates)
  }
}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //clg
    console.log('cannot access geolocation');
  }
};

function showPosition(position){
  console.log(position);
  const coordinates ={
    lat: position.coords.latitude,
    lon: position.coords.longitude
  }
  sessionStorage.setItem('user-coordinates',JSON.stringify(coordinates));
  fetchUserWeatherinfo(coordinates);
}

const grantAccess = document.querySelector('[grantAccess]');
grantAccess.addEventListener('click',getLocation);


async function fetchUserWeatherinfo(coordinates){
  let {lat,lon} = coordinates;
  grantLocation.classList.remove('active');
  loadingScreen.classList.add('active');
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove('active');
    showWeatherInfo.classList.add('active');
    renderWeatherInfo(data);
  }
  catch(err){
    //
  }
}

function renderWeatherInfo(data){

  const cityName = document.querySelector('[cityName]');
  //a image
  const countryIcon = document.querySelector('[countryIcon]');
  const weatherDesc = document.querySelector('[weatherDesc]');
  const weatherIcon = document.querySelector('[weatherIcon]');
  const temperature = document.querySelector('[temperature]');
  const windspeed = document.querySelector('[windspeed]');
  const humidity = document.querySelector('[humidity]');
  const clouds = document.querySelector('[clouds]');

  console.log(data);
  cityName.innerText = data?.name;
  weatherDesc.innerText = data?.weather?.[0]?.description;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${data?.main?.temp} °C`;
  windspeed.innerText = `${data?.wind?.speed} m/s`;
  humidity.innerText = `${data?.main?.humidity}`;
  clouds.innerText = `${data?.clouds?.all}`;
  console.log(data?.weather?.[0]?.id);
  backgroundImageFinder(data?.weather?.[0]?.id);

}

const searchInput = document.querySelector('[searchInput]');

searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  console.log('search btn clicked');
  let cityName = searchInput.value;
  console.log(cityName);
  if(cityName ==='')
    return;
  else{
    fetchSearchWeatherinfo(cityName);
  }
});

async function fetchSearchWeatherinfo(city){
  loadingScreen.classList.add('active');
  showWeatherInfo.classList.remove('active');
  grantLocation.classList.remove('active');
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove('active');
    showWeatherInfo.classList.add('active');
    renderWeatherInfo(data);
  }
  catch(err){
    //do
  }
}


function backgroundImageFinder(id){
  if(id>=200 && id<=232){
    wrapper.style.backgroundImage = `url(./assets/images/thunderstorm.jpg)`;
  }
  else if(id>=300 && id<=321){
    wrapper.style.backgroundImage = `url(./assets/images/drizzle.jpg)`;
  }
  else if(id>=500 && id<=531){
    wrapper.style.backgroundImage = `url(./assets/images/rain.jpg)`;
  }
  else if(id>=600 && id<=622){
    wrapper.style.backgroundImage = `url(./assets/images/snow.jpg)`;
  }
  else if(id>=700 && id<=781){
    switch(id){
      case 701:
        wrapper.style.backgroundImage = `url(./assets/images/mist.jpg)`;
        break;
      case 711:
        wrapper.style.backgroundImage = `url(./assets/images/smoke.jpg)`;
        break;
      case 721:
        wrapper.style.backgroundImage = `url(./assets/images/haze.jpg)`;
        break;
      case (731 || 761):
        wrapper.style.backgroundImage = `url(./assets/images/dust.jpg)`;
        break;
      case 741:
        wrapper.style.backgroundImage = `url(./assets/images/fog.jpg)`;
        break;
      case (751):
        wrapper.style.backgroundImage = `url(./assets/images/sand.jpg)`;
        break;
      case 762:
        wrapper.style.backgroundImage = `url(./assets/images/ash.jpg)`;
        break;
      case 771:
        wrapper.style.backgroundImage = `url(./assets/images/squall.jpg)`;
        break;
      case 781:
        wrapper.style.backgroundImage = `url(./assets/images/tornado.jpg)`;
        break;
      default:
        wrapper.style.backgroundImage = `linear-gradient(45deg, rgba(0, 255, 235, 1) 0%, rgba(7, 58, 187, 1) 100%)`;

    }
  }


  else if(id === 800){
    wrapper.style.backgroundImage = `url(./assets/images/clearSky.jpg)`;
  }
  else if(id>=801 && id<=804){
    wrapper.style.backgroundImage = `url(./assets/images/clouds.jpg)`;

  }
  else{
    wrapper.style.backgroundImage = `linear-gradient(45deg, rgba(0, 255, 235, 1) 0%, rgba(7, 58, 187, 1) 100%)`;

  }

}