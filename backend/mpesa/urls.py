from django.urls import path
from .views import STKPushView, MPesaCallbackView

urlpatterns = [
    path('stkpush/', STKPushView.as_view(), name='stkpush'),
    path('callback/', MPesaCallbackView.as_view(), name='mpesa_callback'),
]
