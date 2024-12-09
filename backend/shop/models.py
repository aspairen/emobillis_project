from django.db import models
from django.conf import settings
from django.db.models import Q

class Category(models.Model):
    """
    Category model for organizing products.
    """
    name = models.CharField(max_length=100, unique=True, default="General")
    description = models.TextField(blank=True, null=True, default="No description available.")    
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
        return self.name


class Product(models.Model):
    """
    Product model with a seller relationship.
    """
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE, default=1)    
    name = models.CharField(max_length=200, default="Unnamed Product")
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)

    description = models.TextField(default="No description available.")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to="products/", default="products/default_image_temp.jpeg")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @staticmethod
    def search(query=None, category=None, min_price=None, max_price=None, in_stock=None):
        products = Product.objects.all()

        # Text search
        if query:
            products = products.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
        # Category filter
        if category:
            if isinstance(category, int):
                products = products.filter(category_id=category)
            elif isinstance(category, str):
                products = products.filter(category__name__icontains=category)

        # Price range filter
        if min_price is not None:
            products = products.filter(price__gte=min_price)
        if max_price is not None:
            products = products.filter(price__lte=max_price)

        # Stock filter
        if in_stock is not None:
            products = products.filter(stock__gt=0) if in_stock else products.filter(stock__lte=0)

        return products

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
