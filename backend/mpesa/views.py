from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import MPesaSTKPush


class STKPushView(APIView):
    """
    Handle MPesa STK Push Requests.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get('phone_number')
        amount = request.data.get('amount')
        account_reference = request.data.get('account_reference', 'Order123')
        transaction_desc = request.data.get('transaction_desc', 'Payment')

        if not phone_number or not amount:
            return Response({"error": "Phone number and amount are required"}, status=400)

        response = MPesaSTKPush.initiate_payment(
            amount=amount,
            phone_number=phone_number,
            account_reference=account_reference,
            transaction_desc=transaction_desc,
        )
        return Response(response)


class MPesaCallbackView(APIView):
    """
    Handle MPesa STK Push Callbacks.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        # Handle transaction status and update your database
        print("MPesa Callback Data:", data)
        return Response({"ResultCode": 0, "ResultDesc": "Success"})
class InitiatePaymentView(APIView):
    def post(self, request):
        order_id = request.data.get("order_id")
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")

        payment = MPesaPayment.objects.create(
            order_id=order_id,
            phone_number=phone_number,
            amount=amount,
        )

        response = MPesa.initiate_stk_push(order_id, phone_number, amount)
        return Response(response, status=status.HTTP_200_OK)

class PaymentCallbackView(APIView):
    def post(self, request):
        data = request.data
        # Extract payment details
        body = data.get("Body", {})
        result_code = body.get("stkCallback", {}).get("ResultCode", None)
        transaction = body.get("stkCallback", {}).get("CallbackMetadata", {}).get("Item", [])

        if result_code == 0:
            transaction_id = [item for item in transaction if item["Name"] == "MpesaReceiptNumber"][0]["Value"]
            amount = [item for item in transaction if item["Name"] == "Amount"][0]["Value"]

            payment = MPesaPayment.objects.get(transaction_id=transaction_id)
            payment.transaction_status = "Completed"
            payment.payment_time = datetime.now()
            payment.save()

            return Response({"status": "Payment successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)