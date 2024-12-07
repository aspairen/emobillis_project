from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address 

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
  list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff')
  search_fields = ('username', 'email', 'first_name', 'last_name')
  list_filter = ('is_active', 'is_staff', 'date_joined')
  ordering = ('-date_joined',)


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
  list_display = ('user', 'street_address', 'city', 'state', 'country', 'postal_code')
  search_fields = ('street_address', 'city', 'country')
  list_filter = ('city', 'state', 'country')