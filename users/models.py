from django.db import models  
from django.contrib.auth.models import User

class Payment(models.Model):
    SERVICE_CHOICES = [
        ('Dine In', 'Dine In'),
        ('Delivery', 'Delivery'),
        ('Pick Up', 'Pick Up'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Visa', 'Visa'),
    ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=10, default="Pending")  # Pending, Successful
    card_number = models.CharField(max_length=16, blank=True, null=True)
    expiry_date = models.CharField(max_length=5, blank=True, null=True)  # Format MM/YY
    cvv = models.CharField(max_length=3, blank=True, null=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    order_status = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        return f"{self.service_type} - {self.amount} - {self.payment_status}"

class Pizza(models.Model):  
    id = models.CharField(max_length=10, primary_key=True) 
    name = models.CharField(max_length=100)  
    description = models.TextField()  
    price = models.DecimalField(max_digits=10, decimal_places=2)  

    def __str__(self):  
        return self.name 


class Topping(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='toppings/', blank=True, null=True)
    is_available = models.BooleanField(default=True)

    def str(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Cart for {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    topping = models.ForeignKey(Topping, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def str(self):
        return f"{self.quantity} x {self.topping.name}"


    def total_price(self):
        return self.quantity * self.topping.price
#------------------------------------------------------

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"