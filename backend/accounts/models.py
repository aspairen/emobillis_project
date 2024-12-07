from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser.
    """
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True, default="")

    # Override groups field with a unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Avoid reverse accessor clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    # Override user_permissions field with a unique related_name
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Avoid reverse accessor clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username


class Profile(models.Model):
    """
    Profile model for extending user information.
    """
    USER_ROLES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=USER_ROLES, default='buyer')
    additional_info = models.TextField(blank=True, null=True, default="")

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Address(models.Model):
    """
    Address model for storing user addresses.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)  # Mark if it's the default address

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.country}"

    class Meta:
        verbose_name_plural = "Addresses"
        ordering = ['-is_default', 'id']


class Seller(models.Model):
    """
    Additional model for seller-specific data.
    """
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='seller_profile')
    store_name = models.CharField(max_length=150, unique=True)
    store_description = models.TextField(blank=True, null=True, default="")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.store_name


class Buyer(models.Model):
    """
    Additional model for buyer-specific data.
    """
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='buyer_profile')
    wishlist = models.ManyToManyField('shop.Product', blank=True, related_name='wishlisted_by')

    def __str__(self):
        return f"Buyer Profile: {self.profile.user.username}"
