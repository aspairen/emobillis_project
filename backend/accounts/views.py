# accounts/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Token Views
class MyTokenObtainPairView(TokenObtainPairView):
    pass 

# User registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        # Log incoming request data for debugging
        print("Received registration data:", request.data)  # Log incoming data

        # Serialize the incoming data
        serializer = self.get_serializer(data=request.data)

        # Validate the data
        if serializer.is_valid():
            # Save the new user to the database
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            # Send response with created user data (excluding password)
            response_data = {
                "message": "User registered successfully.",
                "user": serializer.data,
                "token": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }
            return Response(response_data, status=201)
        
        # Log validation errors for debugging
        print("Registration errors:", serializer.errors)

        # Send response with validation errors
        return Response(serializer.errors, status=400)
            
# User Profile
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    

class AddressListView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.addresses.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
