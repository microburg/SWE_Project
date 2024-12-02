from django.urls import path, include
from .views import LoginView, SignupView, google_auth, PizzaViewSet, UserBasicInfoView, process_payment

from .views import ToppingListView
from rest_framework.routers import DefaultRouter
from .views import CartViewSet


# urlpatterns = [
#     path('login/', LoginView.as_view(), name='login'),
#     path('signup/', SignupView.as_view(), name='signup'),
#     path('api/auth/google/', google_auth, name='google_auth'),

#     # Pizza-related endpoints
#     path('menu/', PizzaViewSet.as_view({'get': 'list', 'post': 'create'}), name='pizza-list-create'),
#     path('menu/<int:pk>/', PizzaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'update', 'delete': 'destroy'}), name='pizza-detail-update-delete'),

#     # User profile endpoint
#     path('user/basic-info/', UserBasicInfoView.as_view(), name='user-basic-info'),


#     path('pay/', process_payment, name='payment'),   

#     path('toppings/', ToppingListView.as_view(), name='topping-list'),

#     path('carts/', CartViewSet.as_view({'get': 'list', 'post': 'create'}), name='cart-list-create'),
#     path('carts/<int:pk>/', CartViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='cart-detail-update-delete'),
    
#     # Cart custom actions
#     path('carts/<int:pk>/add-to-cart/', CartViewSet.as_view({'post': 'add_to_cart'}), name='cart-add-to-cart'),
#     path('carts/<int:pk>/remove-from-cart/', CartViewSet.as_view({'post': 'remove_from_cart'}), name='cart-remove-from-cart'),
#     path('carts/<int:pk>/items/', CartViewSet.as_view({'get': 'get_cart_items'}), name='cart-get-cart-items'),
#     path('carts/<int:pk>/total-price/', CartViewSet.as_view({'get': 'get_total_price'}), name='cart-get-total-price'),
# ]


router = DefaultRouter() 
router.register(r'carts', CartViewSet)



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

    path('', include(router.urls)),

]