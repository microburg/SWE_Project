from django.urls import path
from .views import LoginView, SignupView, google_auth, PizzaViewSet, UserBasicInfoView, process_payment

from .views import ToppingListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('api/auth/google/', google_auth, name='google_auth'),

    # Pizza-related endpoints
    path('menu/', PizzaViewSet.as_view({'get': 'list', 'post': 'create'}), name='pizza-list-create'),
    path('menu/<int:pk>/', PizzaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'update', 'delete': 'destroy'}), name='pizza-detail-update-delete'),

    # User profile endpoint
    path('user/basic-info/', UserBasicInfoView.as_view(), name='user-basic-info'),


    path('pay/', process_payment, name='payment'),   

    path('toppings/', ToppingListView.as_view(), name='topping-list'),
]

