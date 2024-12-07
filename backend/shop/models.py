from django.db import models
from django.conf import settings

class Category(models.Model):
    """
    Category model for organizing products.
    """
    name = models.CharField(max_length=100, unique=True, default="General")
    description = models.TextField(blank=True, null=True, default="No description available.")    
    parent = models.ForeignKey(
        'self', # Self-referential foreign key for subcategories
        on_delete=models.CASCADE,
        related_name='subcategories',
        blank=True,
        null=True,
        help_text="Parent category for subcategories.",
        default=None,
    )
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        help_text="Image representing the category.",
        default="categories/default_category.jpg"
    )
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.parent.name} > {self.name}" if self.parent else self.name


class Product(models.Model):
    """
    Product model with a seller relationship.
    """
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE, default=1)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
        limit_choices_to={'profile__role': 'seller'},  # Ensures only sellers can add products
        default=1, 
    )
    name = models.CharField(max_length=200, default="Unnamed Product")
    description = models.TextField(default="No description available.")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to="products/", default="products/default_image_temp.jpeg")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']


    def __str__(self):
        return self.name


class Cart(models.Model):
    """
    Cart model for managing buyer's cart.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
        limit_choices_to={'profile__role': 'buyer'},  # Ensures only buyers can have carts
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    """
    Individual items in a cart.
    """
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.cart.user.username} - {self.product.name}"


class Order(models.Model):
    """
    Order model for buyers.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        limit_choices_to={'profile__role': 'buyer'},  # Only buyers can place orders
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


class OrderItem(models.Model):
    """
    Individual items in an order.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Order {self.order.id} - {self.product.name} x {self.quantity}"


class SellerProfile(models.Model):
    """
    Additional information for sellers.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile",
        limit_choices_to={'profile__role': 'seller'},  # Restrict to seller users
    )
    store_name = models.CharField(max_length=150, unique=True)
    store_description = models.TextField(blank=True, null=True, default="")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.store_name
