from django.urls import path, include
from .views import (
    LoginView,
    SignupView,
    google_auth,
    PizzaViewSet,
    UserBasicInfoView,
    PaymentView,
    ToppingListView,
    CartViewSet,
    user_profile,  # Import the new profile view
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('api/auth/google/', google_auth, name='google_auth'),

    # Pizza-related endpoints
    path('menu/', PizzaViewSet.as_view({'get': 'list', 'post': 'create'}), name='pizza-list-create'),
    path('menu/<int:pk>/', PizzaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'update', 'delete': 'destroy'}), name='pizza-detail-update-delete'),

    # User profile endpoint
    path('user/basic-info/', UserBasicInfoView.as_view(), name='user-basic-info'),

    # Add the new profile endpoint
    path('user/profile/', user_profile, name='user-profile'),

    # Payments
    path('payments/process_payment/', PaymentView.as_view(), name='process_payment'),

    # Toppings
    path('toppings/', ToppingListView.as_view(), name='topping-list'),

    # Cart-related endpoints
    path('carts/add_to_cart/', CartViewSet.as_view({'post': 'add_to_cart'}), name='cart-add-to-cart'),
    path('carts/remove_from_cart/', CartViewSet.as_view({'post': 'remove_from_cart'}), name='cart-remove-from-cart'),
    path('carts/get_cart_items/', CartViewSet.as_view({'get': 'get_cart_items'}), name='cart-items'),
    path('carts/get_total_price/', CartViewSet.as_view({'get': 'get_total_price'}), name='cart-total-price'),
]
