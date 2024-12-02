from rest_framework import serializers
from .models import Pizza
from django.contrib.auth.models import User

# Serializer for Pizza model
class PizzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pizza
        fields = ['id', 'name', 'description', 'price']  

    def create(self, validated_data):
        pizza = Pizza.objects.create(**validated_data)
        return pizza

    def update(self, instance, validated_data):
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance

# Serializer for User model
class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  
