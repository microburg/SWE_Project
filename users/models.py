from django.db import models  

# class Payment(models.Model):
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     card_number = models.CharField(max_length=16)
#     expiry_date = models.CharField(max_length=5)  # مثلاً MM/YY
#     cvv = models.CharField(max_length=3)
#     is_successful = models.BooleanField(default=False)
#     transaction_date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Payment of {self.amount} - {'Success' if self.is_successful else 'Failed'}"

class Pizza(models.Model):  
    id = models.CharField(max_length=10, primary_key=True)  # Use a string field for the unique ID  
    name = models.CharField(max_length=100)  
    description = models.TextField()  
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Allows prices with two decimal places  

    def __str__(self):  
        return self.name 
