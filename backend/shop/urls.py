# shop/urls.py
from django.urls import path
from .views import CategoryListView,CategoryDetailView , ProductListView, ProductDetailView, OrderListView, CartView, ProductSearchView

urlpatterns = [
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Products
    path('products/', ProductListView.as_view(), name='product-list'),

    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    path('products/search/', ProductSearchView.as_view(), name='product-search'),
    # Cart
    path('cart/', CartView.as_view(), name='cart-list'),

    # Orders
    path('orders/', OrderListView.as_view(), name='order-list'),
]