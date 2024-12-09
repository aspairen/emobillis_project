from django.db import models

class MPesaPayment(models.Model):
    order_id = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    transaction_status = models.CharField(max_length=50, default="Pending")
    payment_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.transaction_status}"
