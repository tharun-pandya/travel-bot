// get the booking id from the page address (?id=AP12345)
var params = new URLSearchParams(window.location.search);
var id = params.get("id");

fetch("/booking/" + id)
  .then(function (res) { return res.json(); })
  .then(function (booking) {
    if (booking.booking_id) {
      document.getElementById("bookingId").textContent = booking.booking_id;
      document.getElementById("customerName").textContent = booking.customer_name;
      document.getElementById("packageName").textContent = booking.package_name;
      document.getElementById("travelDate").textContent = booking.travel_date;
      document.getElementById("travelers").textContent = booking.travelers;
      document.getElementById("total").textContent = "₹" + booking.total_price_inr.toLocaleString("en-IN");
      document.getElementById("payment").textContent = booking.payment_status;
    } else {
      document.getElementById("message").textContent = "Booking not found.";
    }
  });
