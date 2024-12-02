from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Topping

@admin.register(Topping)
class ToppingAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_available')  # Fields to display 
    search_fields = ('name',)
    list_filter = ('is_available',)  


    fieldsets = (
        (None, {
            'fields': ('name', 'price', 'image', 'is_available')
        }),
    )