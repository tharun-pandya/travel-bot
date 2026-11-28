import random

from app.data import packages, places, agents

# every topic has some tags (keywords) and some replies
intents = {
    'greetings': {
        'tags': ["hello", "hi", "hey", "namaste"],
        'responses': ["Hello there!", "Hi! How can I help you?", "Hey! What's up?"]
    },
    'agents': {
        'tags': ["agent", "agency", "contact", "phone"],
        'responses': ["Check the Travel Agents section on this page."]
    },
    'destinations': {
        'tags': ["travel", "vacation", "trip"],
        'responses': ["Where would you like to travel?", "Do you have a destination in mind?", "Let's plan your next trip!"]
    },
    'booking': {
        'tags': ["book", "booking", "ticket", "reserve"],
        'responses': ["Choose a package and click Book Now. Fill your name, mobile, email, travellers and travel date. This is a demo, so no payment is taken."]
    },
    'payment': {
        'tags': ["payment", "pay", "upi", "card"],
        'responses': ["You can choose Pay at office, UPI on arrival or Card at office. This is a demo, so no money is collected."]
    },
    'business': {
        'tags': ["business", "startup"],
        'responses': ["Tourism business ideas: travel agency, tour guide service, vehicle rental, homestay, food tours and photography tours. Check the Business Ideas section."]
    },
    'price': {
        'tags': ["price", "cost", "rate", "fare"],
        'responses': ["Tell me a place like Araku, Lambasingi or Vizag and I will tell you the package price."]
    },
    'besttime': {
        'tags': ["season", "weather", "month", "when", "time"],
        'responses': ["October to March is a good time for most places in Andhra Pradesh. Tell me a place name for exact details."]
    },
    'nearby': {
        'tags': ["nearby", "near", "around", "attraction"],
        'responses': ["Tell me a place name and I will tell you the nearby attractions."]
    },
    'packages': {
        'tags': ["package", "tour"],
        'responses': ["We have 20 tour packages. Tell me a place name like Araku or Vizag and I will show the packages."]
    }
}

# words the user may type  ->  word to search in the place name
place_words = {
    "araku": "araku",
    "lambasingi": "lambasingi",
    "vanjangi": "vanjangi",
    "borra": "borra",
    "vizag": "visakhapatnam",
    "visakhapatnam": "visakhapatnam",
    "rushikonda": "rushikonda",
    "konaseema": "konaseema",
    "tirupati": "tirupati",
    "tirumala": "tirupati",
    "amaravati": "amaravati",
    "gandikota": "gandikota",
    "horsley": "horsley"
}

stopwords = ["a", "an", "the", "is", "are", "do", "does", "i", "your", "you", "my", "me",
  "to", "for", "of", "in", "on", "at", "it", "this", "that", "how", "what",
  "can", "need", "want", "have", "get", "there", "here", "about", "please",
  "would", "like"]


# turn the sentence into a list of root words
def get_root_words(sentence):
    words = sentence.lower().split()
    root_words = []

    for word in words:
        word = word.strip(".,!?;:'\"")

        if word in stopwords:
            continue

        if word.endswith("ing"):
            word = word[:-3]

            if len(word) > 2 and word[-1] == word[-2]:
                word = word[:-1]

        elif word.endswith("ied"):
            word = word[:-3] + "y"

        elif word.endswith("ed"):
            word = word[:-2]

        elif word.endswith("ies"):
            word = word[:-3] + "y"

        elif word.endswith("s") and len(word) > 3:
            word = word[:-1]

        root_words.append(word)

    return root_words


# find which topic the user is asking about
def find_intent(root_words):
    for name, data in intents.items():
        for tag in data["tags"]:
            if tag in root_words:
                return name
    return None


# find which place the user is asking about
def find_place_word(root_words):
    for word in root_words:
        if word in place_words:
            return word
    return None


def get_place_reply(intent, place_word):
    search = place_words[place_word]

    # find the place
    place = None
    for p in places:
        if search in p["name"].lower():
            place = p

    # find the packages of this place
    matching_packages = []
    for pack in packages:
        text = (pack["name"] + " " + " ".join(pack["locations"])).lower()
        if place_word in text or search in text:
            matching_packages.append(pack)

    if intent == "price" or intent == "packages":
        if len(matching_packages) == 0:
            return "Sorry, no package found for that place."
        reply = "Packages for " + place_word.title() + ":\n"
        for pack in matching_packages:
            reply = reply + pack["name"] + " - Rs " + str(pack["price_inr"]) + " (" + pack["duration"] + ")\n"
        reply = reply + "These prices are demo prices."
        return reply

    if place is None:
        return "Sorry, I don't have details about that place."

    if intent == "besttime":
        return "Best time to visit " + place["name"] + ": " + place["best_time"]

    if intent == "nearby":
        return "Nearby places of " + place["name"] + ": " + ", ".join(place["nearby_attractions"])

    # only place name was given, so show the place details
    reply = place["name"] + "\n" + place["description"]
    reply = reply + "\nBest time: " + place["best_time"]
    reply = reply + "\nDistance from Visakhapatnam: " + str(place["distance_from_visakhapatnam_km"]) + " km"
    return reply


def get_response(sentence):
    root_words = get_root_words(sentence)

    intent = find_intent(root_words)
    place_word = find_place_word(root_words)

    # the user asked about a place
    if place_word is not None and intent not in ["booking", "payment", "agents", "business", "greetings"]:
        return get_place_reply(intent, place_word)

    # the user asked about agents, show names from the file
    if intent == "agents":
        reply = "Our travel agents (demo list):\n"
        for agent in agents:
            reply = reply + agent["name"] + " - " + agent["service_area"] + "\n"
        return reply

    if intent is not None:
        return random.choice(intents[intent]["responses"])

    return "I'm sorry, I don't understand. Can you please rephrase your question?"
