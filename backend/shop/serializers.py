from rest_framework import serializers
from .models import Product, Order, OrderItem, Category, Cart, CartItem

class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category 
    fields = [
      'id',
      'name',
      'description',
      'parent',
      'image'
      ]

class ProductSerializer(serializers.ModelSerializer):
  image = serializers.SerializerMethodField()

  def get_image(self, obj):
    request = self.context.get('request')
    if obj.image and hasattr(obj.image, 'url'):
      return request.build_absolute_uri(obj.image.url)
    return request.build_absolute_uri('/media/products/default_image_temp.jpeg')
  class Meta: 
    model = Product
    fields = [
      'id',
      'name',
      'description',
      'price',
      'image'
    ]


class CartItemSerializer(serializers.ModelSerializer):
  class Meta: 
    model = CartItem
    fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True, read_only=True)
  class Meta:
    model = Cart
    fields = [
      'id',
      'user',
      'created_at',
      'items'
    ]

  

class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem 
    fields = ["product", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True) # Nested relationship fro OrderItems


  class Meta:
    model = Order
    fields = '__all__'

  
  def create(self, validated_data):
    items_data = validated_data.pop("items")
    order = Order.objects.create(**validated_data)
    for item_data in items_data:
      OrderItem.objects.create(order=order, **item_data)

    return order 