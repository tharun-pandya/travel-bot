// all packages are saved in this list after loading from the server
var allPackages = [];


// ---------- packages ----------

function loadPackages() {
  fetch("/packages")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allPackages = data;
      showPackages();
      fillPackageSelect();
    });
}

function showPackages() {
  var search = document.getElementById("search").value.toLowerCase();
  var category = document.getElementById("category").value;
  var html = "";
  var count = 0;

  for (var i = 0; i < allPackages.length; i++) {
    var p = allPackages[i];
    var text = (p.name + " " + p.description + " " + p.locations.join(" ")).toLowerCase();

    // skip the packages which do not match
    if (category != "all" && p.category != category) {
      continue;
    }
    if (text.indexOf(search) == -1) {
      continue;
    }

    count = count + 1;
    html += '<div class="col-md-6 col-lg-4">';
    html += '<div class="card h-100">';
    html += '<img src="' + p.image + '" alt="' + p.name + '" class="card-img-top tour-image" onerror="this.src=\'/static/images/placeholder.svg\'">';
    html += '<div class="card-body">';
    html += '<span class="badge bg-success">' + p.category + '</span> ';
    html += '<span class="small text-secondary"><i class="bi bi-clock"></i> ' + p.duration + '</span>';
    html += '<h5 class="mt-2">' + p.name + '</h5>';
    html += '<p class="small text-secondary">' + p.description + '</p>';
    html += '<p class="small"><i class="bi bi-geo-alt"></i> ' + p.locations.join(", ") + '</p>';
    html += '</div>';
    html += '<div class="card-footer d-flex justify-content-between align-items-center">';
    html += '<b>₹' + p.price_inr.toLocaleString("en-IN") + '</b>';
    html += '<a href="#booking" class="btn btn-success btn-sm" onclick="selectPackage(\'' + p.id + '\')"><i class="bi bi-calendar-check"></i> Book now</a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  }

  if (count == 0) {
    html = '<p>No packages found.</p>';
  }

  document.getElementById("packageCount").textContent = count + " packages found (demo prices)";
  document.getElementById("packageGrid").innerHTML = html;
}

// put all package names in the booking form dropdown
function fillPackageSelect() {
  var select = document.getElementById("packageSelect");
  for (var i = 0; i < allPackages.length; i++) {
    var option = document.createElement("option");
    option.value = allPackages[i].id;
    option.textContent = allPackages[i].name;
    select.appendChild(option);
  }
}

// when "Book now" is clicked
function selectPackage(id) {
  document.getElementById("packageSelect").value = id;
  showEstimate();
}

function showEstimate() {
  var id = document.getElementById("packageSelect").value;
  var travelers = Number(document.getElementById("travelers").value);
  var text = "";

  for (var i = 0; i < allPackages.length; i++) {
    if (allPackages[i].id == id) {
      var total = allPackages[i].price_inr * travelers;
      text = "Estimated total: ₹" + total.toLocaleString("en-IN");
    }
  }

  document.getElementById("estimate").textContent = text;
}


// ---------- places ----------

function loadPlaces() {
  fetch("/places")
    .then(function (res) { return res.json(); })
    .then(function (places) {
      var html = "";
      for (var i = 0; i < places.length; i++) {
        var p = places[i];
        html += '<div class="col-md-6 col-lg-4">';
        html += '<div class="card h-100">';
        html += '<img src="' + p.image + '" alt="' + p.name + '" class="card-img-top tour-image" onerror="this.src=\'/static/images/placeholder.svg\'">';
        html += '<div class="card-body">';
        html += '<h5>' + p.name + '</h5>';
        html += '<p class="small text-secondary">' + p.description + '</p>';
        html += '<p class="small mb-1"><i class="bi bi-sun"></i> <b>Best time:</b> ' + p.best_time + '</p>';
        html += '<p class="small mb-1"><i class="bi bi-pin-map"></i> <b>Nearby:</b> ' + p.nearby_attractions.join(", ") + '</p>';
        html += '<p class="small mb-1"><i class="bi bi-signpost"></i> <b>Distance from Vizag:</b> ' + p.distance_from_visakhapatnam_km + ' km (approx)</p>';
        html += '<p class="small mb-0"><i class="bi bi-ticket-perforated"></i> <b>Entry fee:</b> ' + p.entry_fee + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      }
      document.getElementById("placeGrid").innerHTML = html;
    });
}


// ---------- agents ----------

function loadAgents() {
  fetch("/agents")
    .then(function (res) { return res.json(); })
    .then(function (agents) {
      var html = "";
      for (var i = 0; i < agents.length; i++) {
        var a = agents[i];
        html += '<div class="col-md-6 col-lg-4">';
        html += '<div class="card h-100">';
        html += '<div class="card-body">';
        html += '<h5><i class="bi bi-person-badge text-success"></i> ' + a.name + '</h5>';
        html += '<p class="small text-secondary">' + a.service_area + '</p>';
        html += '<p class="small"><b>Packages:</b> ' + a.available_packages.join(", ") + '</p>';
        html += '<p class="small mb-1"><i class="bi bi-telephone"></i> <b>Contact:</b> ' + a.contact_number + '</p>';
        html += '<p class="small text-secondary mb-0">' + a.note + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      }
      document.getElementById("agentGrid").innerHTML = html;
    });
}


// ---------- business ideas ----------

function loadBusinessIdeas() {
  fetch("/business-ideas")
    .then(function (res) { return res.json(); })
    .then(function (ideas) {
      var html = "";
      for (var i = 0; i < ideas.length; i++) {
        var idea = ideas[i];
        html += '<div class="col-md-6 col-lg-3">';
        html += '<div class="card h-100">';
        html += '<div class="card-body">';
        html += '<i class="bi ' + idea.icon + ' fs-2 text-success"></i>';
        html += '<h6 class="mt-2">' + idea.title + '</h6>';
        html += '<p class="small text-secondary">' + idea.description + '</p>';
        html += '<p class="small mb-0"><b>Start:</b> ' + idea.starter + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      }
      document.getElementById("businessGrid").innerHTML = html;
    });
}


// ---------- booking ----------

function sendBooking() {
  var error = document.getElementById("bookingError");
  error.textContent = "";

  var data = {
    customer_name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    email: document.getElementById("email").value,
    package_id: document.getElementById("packageSelect").value,
    travelers: Number(document.getElementById("travelers").value),
    travel_date: document.getElementById("travelDate").value,
    payment_method: document.getElementById("payment").value
  };

  // simple check before sending
  if (data.customer_name == "" || data.mobile == "" || data.email == "") {
    error.textContent = "Please fill name, mobile and email.";
    return;
  }
  if (data.package_id == "") {
    error.textContent = "Please select a package.";
    return;
  }
  if (data.travel_date == "") {
    error.textContent = "Please select the travel date.";
    return;
  }

  fetch("/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(function (res) { return res.json(); })
    .then(function (result) {
      if (result.booking) {
        // go to the confirmation page
        window.location.href = "/booking-confirmation?id=" + result.booking.booking_id;
      } else if (typeof result.detail == "string") {
        error.textContent = result.detail;
      } else {
        error.textContent = "Please check the form and try again.";
      }
    });
}


// ---------- chat ----------

function toggleChat() {
  var box = document.getElementById("chatBox");
  if (box.style.display == "block") {
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

function addMessage(text, who) {
  var box = document.getElementById("chatMessages");
  var div = document.createElement("div");
  div.textContent = text;
  if (who == "user") {
    div.className = "message user-message";
  } else {
    div.className = "message bot-message";
  }
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function sendChat(event) {
  event.preventDefault();

  var input = document.getElementById("chatInput");
  var question = input.value.trim();
  if (question == "") {
    return;
  }

  addMessage(question, "user");
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) { addMessage(data.answer, "bot"); })
    .catch(function () { addMessage("Could not connect. Please try again.", "bot"); });
}


// ---------- run when the page opens ----------

// travel date cannot be in the past
document.getElementById("travelDate").min = new Date().toISOString().split("T")[0];

loadPackages();
loadPlaces();
loadAgents();
loadBusinessIdeas();
