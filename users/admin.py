from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Topping

@admin.register(Topping)
class ToppingAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_available')  # Fields to display in the list view
    search_fields = ('name',)  # Allow searching by topping name
    list_filter = ('is_available',)  # Allow filtering by availability

    # Optional: Customize the form view
    fieldsets = (
        (None, {
            'fields': ('name', 'price', 'image', 'is_available')
        }),
    )