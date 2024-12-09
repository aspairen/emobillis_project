from django.contrib import admin
from .models import Product, Order, Category, Cart, OrderItem, CartItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image')
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'available', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('available', 'category', 'created_at')
    ordering = ('-created_at',)

class CartItemInline(admin.TabularInline):
    model = CartItem 
    extra = 1

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'product_list', 'created_at')
    # search_fields = ('user__username', 'product__name')
    inlines = [CartItemInline]

    def total_items(self, obj):
        """"Calculate total items in the cart"""
        return sum(item.quantity for item in obj.items.all())
    total_items.short_description = 'Total Items'

    def product_list(self, obj):
        """List all products in the cart."""
        return ", ".join([f"{item.product.name} (x{item.quantity})" for item in obj.items.all()])
    product_list.short_description = 'Products in Cart'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_price', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('created_at',)
    ordering = ('-created_at',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')