from django.contrib import admin
from django.contrib import admin
from .models import Topping, Pizza

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
@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):  
    list_display = ('id', 'name', 'description', 'price', 'image_tag')  
    search_fields = ('name',)  

    def image_tag(self, obj):  
        if obj.image:  
            return '<img src="{}" width="100" height="100" />'.format(obj.image.url)  
        return "No Image"  

    image_tag.allow_tags = True  
    image_tag.short_description = 'Image'  

    fieldsets = (  
        (None, {  
            'fields': ('name', 'description', 'price', 'image')  
        }),  
    )  