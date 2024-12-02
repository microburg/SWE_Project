from rest_framework import serializers
from .models import Pizza
from django.contrib.auth.models import User
from .models import Cart, CartItem, Topping

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

class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'name', 'price', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    topping = ToppingSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'topping', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return str(obj.total_price())

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']