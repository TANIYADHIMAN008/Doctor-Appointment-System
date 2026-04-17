import requests

url = "http://localhost:5678/webhook-test/d157bcc9-0dac-479c-9091-a64e9c7d52a9"

data = {
    "email": "your_email@gmail.com",
    "name": "Taniya",
    "type": "registration"
}

res = requests.post(url, json=data)
print(res.text)