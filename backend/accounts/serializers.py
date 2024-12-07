# accounts/serializers.py
from rest_framework import serializers
from .models import User, Address
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])

  class Meta:
    model = User
    fields = [
      'id',
      'username',
      'email',
      'password',
      'first_name',
      'last_name',
      'phone_number',
      'is_active'
    ]

  def create(self, validated_data):
    # sourcery skip: inline-immediately-returned-variable
    user = User.objects.create_user(
      username = validated_data['username'],
      email = validated_data['email'],
      password = validated_data['password'],
      first_name = validated_data.get('first_name', ''),
      last_name = validated_data.get('last_name', ''),
      phone_number = validated_data.get('phone_number', ''),
    )
    return user


class AddressSerializer(serializers.ModelSerializer):
  class Meta:
    model = Address 
    fields = '__all__'