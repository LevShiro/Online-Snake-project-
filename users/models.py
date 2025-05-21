from django.db import models
from django.contrib.auth.models import AbstractUser
import os
from django.conf import settings

# Create your models here.
class User(AbstractUser):
    score = models.IntegerField(default=0,blank=True,null=True)
    record = models.IntegerField(default=0,blank=True,null=True)