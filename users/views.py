import json
import google.auth
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from rest_framework.decorators import api_view
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets 

from rest_framework.permissions import IsAuthenticated
from .serializers import UserBasicInfoSerializer,FeedbackSerializer

 
from .models import Pizza  
from .serializers import PizzaSerializer  
from rest_framework import status  


from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Cart, CartItem, Topping
from .serializers import CartSerializer, CartItemSerializer, ToppingSerializer

from .models import Payment



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid credentials"}, status=401)


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        # Create the user and save it
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)  # Hash the password before storing
        )

        return Response({"message": "User created successfully!"}, status=201)


import logging

@api_view(['POST'])
def google_auth(request):
    try:
        token = request.data.get('token')
        if not token:
            return Response({'success': False, 'error': 'Token not provided'}, status=400)
        
        # Verify token
        id_info = id_token.verify_oauth2_token(token, Request(), settings.GOOGLE_CLIENT_ID)
        logging.info(f"ID Token Info: {id_info}")
        
        email = id_info.get('email')
        username = id_info.get('name')
        logging.info(f"Google User Info: Email - {email}, Username - {username}")

        # Create or get user
        user, created = User.objects.get_or_create(username=username, email=email)

        if created:
            user.set_unusable_password()
            user.save()

        return Response({'success': True, 'username': user.username})

    except ValueError as e:
        logging.error(f"Token verification failed: {e}")
        return Response({'success': False, 'error': 'Invalid token'}, status=400)

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return Response({'success': False, 'error': 'Something went wrong'}, status=500)


from decimal import Decimal, InvalidOperation
from .models import VisaCard

class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        service_type = data.get('service_type')  # Dine In, Delivery, or Pick Up
        payment_method = data.get('payment_method')  # Cash or Visa
        amount = data.get('amount')
        card_number = data.get('card_number')
        expiry_date = data.get('expiry_date')
        cvv = data.get('cvv')

        # Basic validations
        if not service_type or not payment_method or not amount:
            return Response({"success": False, "message": "All fields are required"}, status=400)

        # Convert amount to Decimal
        try:
            amount = Decimal(str(amount))  # Convert to Decimal from string
        except InvalidOperation:
            return Response({"success": False, "message": "Invalid amount format"}, status=400)

        # Create payment object
        payment = Payment(
            amount=amount,
            service_type=service_type,
            payment_method=payment_method
        )

        if payment_method == "Visa":
            # Validate card details
            if not card_number or not expiry_date or not cvv:
                return Response({"success": False, "message": "Card details are required for Visa payment"}, status=400)

            # Check if the card exists
            try:
                visa_card = VisaCard.objects.get(card_number=card_number, expiry_date=expiry_date, cvv=cvv)
            except VisaCard.DoesNotExist:
                return Response({"success": False, "message": "Invalid card details"}, status=400)

            # Check if the balance is sufficient
            if visa_card.balance >= amount:
                visa_card.balance -= amount  # Deduct the amount from the card's balance
                visa_card.save()  # Save the updated balance
                payment.card_number = card_number
                payment.expiry_date = expiry_date
                payment.cvv = cvv
                payment.payment_status = "Successful"
            else:
                return Response({"success": False, "message": "Insufficient balance on the card"}, status=400)

        elif payment_method == "Cash":
            payment.payment_status = "Pending"

        # Save payment
        payment.save()

        return Response({"success": True, "payment_status": payment.payment_status}, status=201)


from rest_framework import status  
from rest_framework.response import Response  
from rest_framework import viewsets  
from .models import Pizza  
from .serializers import PizzaSerializer  
from rest_framework.permissions import IsAuthenticated  
from django.urls import reverse  

class PizzaViewSet(viewsets.ModelViewSet):  
    queryset = Pizza.objects.all()  
    serializer_class = PizzaSerializer  
    permission_classes = [AllowAny]  # Ensure proper permissions  

    def create(self, request):  
        serializer = self.get_serializer(data=request.data)  
        if serializer.is_valid():  
            pizza = serializer.save()  # Create pizza   
            # Generate URL for the created pizza  
            pizza_url = reverse('admin:users_pizza_change', args=[pizza.id])  
            return Response({'url': pizza_url, 'pizza': serializer.data}, status=status.HTTP_201_CREATED)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
    def update(self, request, *args, **kwargs):  
        instance = self.get_object()  
        serializer = self.get_serializer(instance, data=request.data, partial=True)  

        if serializer.is_valid():  
            serializer.save()  
            return Response(serializer.data)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile class
class UserBasicInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  
        serializer = UserBasicInfoSerializer(user)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Topping
from .serializers import ToppingSerializer

class ToppingListView(APIView):
    def get(self, request):
        toppings = Topping.objects.filter(is_available=True)
        serializer = ToppingSerializer(toppings, many=True)
        return Response(serializer.data)




from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
import logging
from .models import Cart, CartItem, Topping, Pizza
from .serializers import CartSerializer, CartItemSerializer

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        if not request.user.is_authenticated:
            logging.error(f"User not authenticated: {request.user}")
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Validate input
        topping_id = request.data.get('topping_id')
        pizza_id = request.data.get('pizza_id')
        quantity = int(request.data.get('quantity', 1))

        cart, _ = Cart.objects.get_or_create(user=request.user)

        if topping_id:
            try:
                topping = Topping.objects.get(id=topping_id)
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart, topping=topping,
                    defaults={'quantity': quantity}
                )
            except Topping.DoesNotExist:
                return Response({"detail": "Topping not found"}, status=status.HTTP_404_NOT_FOUND)
        elif pizza_id:
            try:
                pizza = Pizza.objects.get(id=pizza_id)
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart, pizza=pizza,
                    defaults={'quantity': quantity}
                )
            except Pizza.DoesNotExist:
                return Response({"detail": "Pizza not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Invalid item type"}, status=status.HTTP_400_BAD_REQUEST)

        if not created:
            # Update quantity if the item already exists
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def remove_from_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        topping_id = request.data.get('topping_id')
        pizza_id = request.data.get('pizza_id')

        try:
            if topping_id:
                # Remove topping from cart
                topping = Topping.objects.get(id=topping_id)
                cart_item = CartItem.objects.get(cart=cart, topping=topping)
            elif pizza_id:
                # Remove pizza from cart
                pizza = Pizza.objects.get(id=pizza_id)
                cart_item = CartItem.objects.get(cart=cart, pizza=pizza)
            else:
                return Response({"detail": "Invalid item type"}, status=status.HTTP_400_BAD_REQUEST)

            cart_item.delete()
            return Response({"detail": "Item removed from cart"}, status=status.HTTP_200_OK)

        except (Topping.DoesNotExist, Pizza.DoesNotExist):
            return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not in cart"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def get_cart_items(self, request):
        try:
            # Log the incoming request
            logging.info(f"Fetching cart items for user: {request.user.username}")
            
            # Get or create the cart for the user
            cart, created = Cart.objects.get_or_create(user=request.user)
            logging.info(f"Cart retrieved: {cart.id}, Created: {created}")
            
            # Fetch cart items
            items = CartItem.objects.filter(cart=cart)
            if not items:
                logging.info("Cart is empty")
                return Response({"message": "Your cart is empty"}, status=status.HTTP_200_OK)

            # Serialize cart items
            serializer = CartItemSerializer(items, many=True)
            logging.info(f"Serialized cart items: {serializer.data}")

            return Response(serializer.data)
        except Exception as e:
            logging.error(f"Error in get_cart_items: {str(e)}")
            return Response({"error": "Failed to load cart items"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['get'])
    def get_total_price(self, request):
        # Calculate the total price of items in the cart
        cart, _ = Cart.objects.get_or_create(user=request.user)
        total = sum([item.total_price() for item in CartItem.objects.filter(cart=cart)])
        return Response({"total_price": str(total)}, status=status.HTTP_200_OK)

@api_view(['POST'])
def submit_feedback(request):
    if request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
