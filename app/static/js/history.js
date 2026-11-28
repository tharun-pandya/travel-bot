function findBookings() {
  var mobile = document.getElementById("historyMobile").value.trim();
  var error = document.getElementById("historyError");
  var results = document.getElementById("historyResults");

  error.textContent = "";
  results.innerHTML = "";

  if (mobile == "") {
    error.textContent = "Please enter your mobile number.";
    return;
  }

  fetch("/bookings?mobile=" + encodeURIComponent(mobile))
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.bookings == undefined) {
        error.textContent = "Please enter a valid mobile number.";
        return;
      }
      if (data.count == 0) {
        results.innerHTML = '<p>No bookings found for this number.</p>';
        return;
      }

      var html = "";
      for (var i = 0; i < data.bookings.length; i++) {
        var b = data.bookings[i];
        html += '<div class="card mb-3">';
        html += '<div class="card-body">';
        html += '<h5>' + b.package_name + '</h5>';
        html += '<p class="small mb-1">Booking ID: ' + b.booking_id + '</p>';
        html += '<p class="small mb-1">Travel date: ' + b.travel_date + '</p>';
        html += '<p class="small mb-1">Travellers: ' + b.travelers + '</p>';
        html += '<p class="small mb-1">Total: ₹' + b.total_price_inr.toLocaleString("en-IN") + '</p>';
        html += '<p class="small mb-2">Status: ' + b.status + '</p>';
        html += '<a href="/booking-confirmation?id=' + b.booking_id + '">View details</a>';
        html += '</div>';
        html += '</div>';
      }
      results.innerHTML = html;
    });
}
