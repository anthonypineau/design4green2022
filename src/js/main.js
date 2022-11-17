const listBody = document.querySelector("#list .body");
const cartBody = document.querySelector("#cart .body");

const cities = new Array;
const trainings = new Array;
let filtered = new Array;
let selectedTrainings = new Array;

var map = L.map('map').setView([46.861, 2.131], 6);
L.tileLayer('../../assets/osm/{z}/{x}/{y}.png', {
    minZoom : 6,
    maxZoom: 6,
    noWrap: true,
    bounds: [
      [51.454, -5.405],
      [42.115, 8.262]
    ],
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch("../../data/data.json")
.then(response => {
   return response.json();
}).then(data => {
    data.forEach(d => {
      trainings.push(d);
      if(!cities.includes(d.city)){
        cities.push(d.city);
      }
    });
    filtered = trainings;
    const selectCity = document.querySelector("#city");
    cities.forEach(c => {
      const optCity = document.createElement("option");
      optCity.value = c;
      optCity.text = c;
      selectCity.appendChild(optCity);
    });

    renderTrainings();
});

const pdf = document.querySelector("#pdf");
pdf.addEventListener("click", () => {
  var mywindow = window.open("", "PRINT", "height=600,width=600");
  mywindow.document.write(cartBody.innerHTML);
  mywindow.document.close();
  mywindow.focus();
  mywindow.print();
  return true;
});

const submit = document.querySelector("#submit");
submit.addEventListener("click", e => {
  filter = {
    "formation" : selectTrainingType.value,
    "organisation" : selectOrganistion.value,
    "city": selectCity.value,
    "access": selectAccess.value
  }

  filtered = trainings.filter(obj => (filter.formation == 'null' ? true : obj.formation == filter.formation) && (filter.organisation == 'null' ? true : obj.organisation == filter.organisation) && (filter.city == 'null' ? true : obj.city == filter.city) && (filter.access == 'null' ? true : obj.access == filter.access) );

  renderTrainings();
  renderCart();
});

function createCard(training){
  const div = document.createElement("div");
  div.classList.add("card");
  div.id = training.name;
  div.textContent=training.name;
  return div;
}

function renderTrainings(){
  listBody.innerHTML="";
  
  filtered.forEach(t => {
    const div = createCard(t);

    let marker = L.marker(t.latlong).addTo(map).bindPopup(t.name);
    div.addEventListener("mouseover", e => {
      marker.openPopup();
    });

    div.addEventListener("mouseout", e => {
      marker.closePopup();
    });

    div.addEventListener("click", () => {
      const divCart = createCard(t);
      divCart.addEventListener("click", () => {
        cartBody.removeChild(divCart);
        div.style.display = "block";
        selectedTrainings = selectedTrainings.slice(selectedTrainings.indexOf(t));
      });

      selectedTrainings.push(t);

      cartBody.appendChild(divCart);

      div.style.display = "none";
    });

    marker.addEventListener("click", () => {
      if(marker.isPopupOpen()){
        window.location = "#"+t.name;
      } 
    });

    marker.addEventListener("popupopen", () => {
      div.classList.add("shine");
    });

    marker.addEventListener("popupclose", () => {
      div.classList.remove("shine");
    });

    submit.addEventListener("click", e => {
      map.removeLayer(marker);
    });

    listBody.appendChild(div);
  });     
}

const selectTrainingType = document.querySelector("#trainingType");
const selectOrganistion = document.querySelector("#organisation");
const selectCity = document.querySelector("#city");
const selectAccess = document.querySelector("#access");

const namePerson = document.querySelector("#namePerson");

const mail = document.querySelector("#mail");
mail.addEventListener("click", () => {
  let yourMessage = "Liste de formations : ";
  selectedTrainings.forEach(t => {
    yourMessage += t.name + ", ";
  });
  let subject = "Demande de devis - "+ namePerson.value;

  document.location.href = "mailto:design4green@etik.com?subject="
      + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(yourMessage);

});