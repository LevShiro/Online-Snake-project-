from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django import forms
from django.forms import TextInput,PasswordInput
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate



User=get_user_model()

class RegisterForm(UserCreationForm):
    username = forms.CharField(min_length=3,max_length=10,widget=TextInput(attrs={
        'class':'form-input',
        'placeholder':'Логин'
    }))
    password1 =  forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Пароль'
    }))
    password2 = forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Повторите ваш пароль'
    }))
    def save(self, commit=True):
        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password1']
        )
        return user
    class Meta:
        model = User
        fields = ('username','password1','password2')

class LoginForm(AuthenticationForm):
    model = User

    username = forms.CharField(min_length=3,max_length=10,widget=TextInput(attrs={
        'class':'form-input',
        'placeholder':'Логин'
    }))
    password = forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Пароль'
    }))
    fields = ['username','password',]
    def is_exist(self):
        username = self.cleaned_data['login']
        password = self.cleaned_data['password']
        return authenticate(username=username,password=password)
