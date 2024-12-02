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
from .serializers import UserBasicInfoSerializer

 
from .models import Pizza  
from .serializers import PizzaSerializer  
from rest_framework import status  


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

@api_view(['POST'])
def process_payment(request):
    # بيانات الدفع الواردة من React
    card_number = request.data.get('card_number')
    expiry_date = request.data.get('expiry_date')
    cvv = request.data.get('cvv')
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')

    # معالجة الدفع (مثال بسيط: قبول الدفع)
    return Response({"success": True, "message": "Payment processed successfully!"})

# Admin page create and update
class PizzaViewSet(viewsets.ModelViewSet):
    queryset = Pizza.objects.all()
    serializer_class = PizzaSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Create pizza (with the provided ID or auto-generated)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        # Custom update logic if needed, otherwise use the default behavior
        instance = self.get_object()  # This gets the instance being updated
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            # You can add custom validation here if needed
            serializer.save()  # Save the updated instance
            return Response(serializer.data)  # Return updated data in the response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated

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