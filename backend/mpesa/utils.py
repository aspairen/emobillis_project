import base64
import requests
from datetime import datetime
from requests.auth import HTTPBasicAuth
from django.conf import settings

class MPesa:
    @staticmethod
    def generate_access_token():
        consumer_key = settings.MPESA_CONSUMER_KEY
        consumer_secret = settings.MPESA_CONSUMER_SECRET
        api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(api_url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
        return response.json().get("access_token")

    @staticmethod
    def generate_password(shortcode, passkey, timestamp):
        data = f"{shortcode}{passkey}{timestamp}"
        encoded = base64.b64encode(data.encode())
        return encoded.decode("utf-8")

    @staticmethod
    def initiate_stk_push(order_id, phone_number, amount):
        access_token = MPesa.generate_access_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        shortcode = settings.MPESA_SHORTCODE
        passkey = settings.MPESA_PASSKEY
        password = MPesa.generate_password(shortcode, passkey, timestamp)

        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": f"Order-{order_id}",
            "TransactionDesc": "Payment for Order",
        }

        response = requests.post(api_url, json=payload, headers=headers)
        return response.json()
