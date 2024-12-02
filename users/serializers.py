from rest_framework import serializers
from .models import Pizza
from django.contrib.auth.models import User

# Serializer for Pizza model
class PizzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pizza
        fields = ['id', 'name', 'description', 'price']  # Ensure these fields are correct

    def create(self, validated_data):
        # No need to pass 'id' explicitly; let Django handle it
        pizza = Pizza.objects.create(**validated_data)  # Django will generate 'id' automatically
        return pizza

    def update(self, instance, validated_data):
        # Only update the price (or any other fields you want to allow updating)
        instance.price = validated_data.get('price', instance.price)  # Only update price
        instance.save()
        return instance

# Serializer for User model (auth_user table)
class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  # Only fetch name (username) and email
