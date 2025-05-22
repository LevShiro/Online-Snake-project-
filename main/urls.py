from django.contrib import admin
from django.urls import path

from django.urls import path
from . import views

urlpatterns = [
    path('',views.main_page,name='home'),
    path('sendScore',views.sendScore,name='sendScore'),
    path('record_table',views.recordTable,name='record_table'),
    path('<int:quantity>_add_table',views.add_table,name='add_table')
]