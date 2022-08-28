from unicodedata import name
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page,name="home"),
    path('getCountries/', views.get_countries),
    path('cities/<str:country>', views.get_cities),
    
]
