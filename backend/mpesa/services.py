import json
import base64
from datetime import datetime
import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings


class MPesaCredentials:
    CONSUMER_KEY = "your_consumer_key"
    CONSUMER_SECRET = "your_consumer_secret"
    API_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    SHORTCODE = "174379"
    PASSKEY = "your_passkey"


class AccessToken:
    @staticmethod
    def get_access_token():
        response = requests.get(
            MPesaCredentials.API_URL,
            auth=HTTPBasicAuth(MPesaCredentials.CONSUMER_KEY, MPesaCredentials.CONSUMER_SECRET),
        )
        return json.loads(response.text)['access_token']


class MPesaSTKPush:
    @staticmethod
    def initiate_payment(amount, phone_number, account_reference, transaction_desc="Payment for Goods"):
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(
            f"{MPesaCredentials.SHORTCODE}{MPesaCredentials.PASSKEY}{timestamp}".encode()
        ).decode('utf-8')

        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {AccessToken.get_access_token()}",
            "Content-Type": "application/json",
        }
        payload = {
            "BusinessShortCode": MPesaCredentials.SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": MPesaCredentials.SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://yourdomain.com/api/mpesa/callback/",
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc,
        }

        response = requests.post(api_url, headers=headers, json=payload)
        return response.json()
