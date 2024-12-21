from rest_framework import serializers
from .models import Pizza, Cart, CartItem, Topping,Feedback
from django.contrib.auth.models import User

class PizzaSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Pizza
        fields = ['id', 'name', 'description', 'price', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


    def create(self, validated_data):
        pizza = Pizza.objects.create(**validated_data)
        return pizza

    def update(self, instance, validated_data):
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance

# User Serializer (Basic Info)
class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

# Topping Serializer
class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'name', 'price', 'image']

# Cart Item Serializer
class CartItemSerializer(serializers.ModelSerializer):
    pizza = PizzaSerializer(read_only=True) 
    topping = ToppingSerializer(read_only=True)  
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'pizza', 'topping', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return str(obj.total_price())  

# Cart Serializer
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['name', 'email', 'message', 'rating']
