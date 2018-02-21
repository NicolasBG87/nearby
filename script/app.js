///// ----- VARIABLES ----- /////
let userLat,
    userLng,
    map,
    infowindow,
    btns = document.querySelectorAll(".btn-option"),
    div = document.querySelector("#main");
///// ----- GET USER COORDINATES ----- /////
let getLocation = () => { 
  navigator.geolocation ? 
  navigator.geolocation.getCurrentPosition(getCoords) : 
  alert("Geolocation is not supported by this browser.") }
let getCoords = position => {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
}
getLocation();
///// ----- GOOGLE MAP INIT ----- /////
let initMap = e => {
  let latLng = new google.maps.LatLng(userLat, userLng);
  let searchType = e.target.id;
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 14
  });
  infowindow = new google.maps.InfoWindow();
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: latLng,
    radius: 2000,
    type: searchType
  }, callback);
}
let callback = (results, status) => {
  div.innerHTML = "";
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach((result) =>{
      createMarker(result);
      let card = document.createElement("div");
      card.classList.add("card", "col-xs-12", "col-sm-12", "col-md-6", "col-lg-4", "col-xl-3");
      card.innerHTML = `
        <img class="card-img-top" src="${result.icon}">
        <div class="card-body">
          <h5 class="card-title">${result.name}</h5>
          <p class="card-text">${result.vicinity}</p>
        </div>
      `;
      div.appendChild(card);
    });
  }
}
let createMarker = (place) => {
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
///// ----- EVENT LISTENERS ----- /////
btns.forEach((btn) =>{
  btn.addEventListener("click", initMap);
});
