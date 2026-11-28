import os
import random
from datetime import date, datetime

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.data import packages, places, agents, business_ideas, bookings
from app.chatbot import get_response

app = FastAPI(title="AP Tourism Portal")

# folder of the html, css and js files
static_folder = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_folder), name="static")


# the data we get from the booking form
class Booking(BaseModel):
    customer_name: str
    mobile: str
    email: str
    package_id: str
    travelers: int
    travel_date: str
    payment_method: str


# the data we get from the chat box
class Chat(BaseModel):
    question: str


# remove spaces, brackets, + and - from the mobile number
def clean_mobile(mobile):
    for ch in [" ", "-", "+", "(", ")"]:
        mobile = mobile.replace(ch, "")
    return mobile


# ---------- html pages ----------

@app.get("/")
def home():
    return FileResponse(os.path.join(static_folder, "index.html"))


@app.get("/booking-confirmation")
def booking_confirmation_page():
    return FileResponse(os.path.join(static_folder, "booking-confirmation.html"))


@app.get("/booking-history")
def booking_history_page():
    return FileResponse(os.path.join(static_folder, "booking-history.html"))


# ---------- data ----------

@app.get("/packages")
def get_packages():
    return packages


@app.get("/places")
def get_places():
    return places


@app.get("/agents")
def get_agents():
    return agents


@app.get("/business-ideas")
def get_business_ideas():
    return business_ideas


# ---------- booking ----------

@app.post("/booking")
def create_booking(data: Booking):
    name = data.customer_name.strip()
    mobile = clean_mobile(data.mobile)
    email = data.email.strip().lower()

    if len(name) < 2:
        raise HTTPException(status_code=422, detail="Please enter your name.")

    if not mobile.isdigit() or len(mobile) < 10 or len(mobile) > 13:
        raise HTTPException(status_code=422, detail="Enter a valid mobile number with 10 to 13 digits.")

    if "@" not in email or "." not in email:
        raise HTTPException(status_code=422, detail="Enter a valid email address.")

    if data.travelers < 1 or data.travelers > 20:
        raise HTTPException(status_code=422, detail="Travellers must be between 1 and 20.")

    try:
        travel_date = date.fromisoformat(data.travel_date)
    except ValueError:
        raise HTTPException(status_code=422, detail="Enter a valid travel date.")

    if travel_date < date.today():
        raise HTTPException(status_code=422, detail="Travel date must be today or a future date.")

    if data.payment_method not in ["Pay at office", "UPI on arrival", "Card at office"]:
        raise HTTPException(status_code=422, detail="Choose a payment method from the list.")

    # find the package
    selected = None
    for package in packages:
        if package["id"] == data.package_id:
            selected = package

    if selected is None:
        raise HTTPException(status_code=404, detail="Package not found.")

    booking = {
        "booking_id": "AP" + str(random.randint(10000, 99999)),
        "customer_name": name,
        "mobile": mobile,
        "email": email,
        "package_name": selected["name"],
        "travelers": data.travelers,
        "total_price_inr": selected["price_inr"] * data.travelers,
        "travel_date": data.travel_date,
        "payment_method": data.payment_method,
        "payment_status": "Not paid - demo project",
        "status": "Booking request received",
        "booked_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    bookings.append(booking)

    return {"message": "Your booking request has been saved.", "booking": booking}


@app.get("/bookings")
def get_booking_history(mobile: str):
    mobile = clean_mobile(mobile)

    found = []
    for booking in bookings:
        if booking["mobile"] == mobile:
            found.append(booking)

    # newest booking first
    found.reverse()
    return {"count": len(found), "bookings": found}


@app.get("/booking/{booking_id}")
def get_booking(booking_id: str):
    for booking in bookings:
        if booking["booking_id"] == booking_id.upper():
            return booking
    raise HTTPException(status_code=404, detail="Booking not found.")


# ---------- chatbot ----------

@app.post("/chat")
def chat(data: Chat):
    answer = get_response(data.question)
    return {"answer": answer}
