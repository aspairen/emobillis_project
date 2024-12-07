from rest_framework import generics, permissions
from .models import Product, Order, Category, Cart  
from .serializers import ProductSerializer, OrderSerializer, CategorySerializer, CartSerializer
from rest_framework.permissions import BasePermission
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.method in permissions.SAFE_METHODS

# Category Views
class CategoryListView(generics.ListCreateAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer
   permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Product Views
class ProductListView(generics.ListCreateAPIView):
  queryset = Product.objects.all().order_by('name')
  serializer_class = ProductSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  filter_backends = [DjangoFilterBackend, SearchFilter]
  filterset_fields = ['category']
  search_fields = ['name', 'description']

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Cart Views
class CartListView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    

# Order Views
class OrderListView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Order.objects.all()
   serializer_class = OrderSerializer
   permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]