from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('/admin/')),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
<<<<<<< HEAD
] +static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
] 
>>>>>>> bf66de9a8b42ffdc4d10a3a6b73e1063edf31131

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)