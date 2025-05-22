from django.shortcuts import render,redirect
from django.contrib.auth import logout
import json
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your views here.

def main_page(request):
    #выход пользователя
    if 'logout' in request.POST:
        logout(request)
        return redirect('home')
    return render(request,"main/main.html")

def sendScore(request):
    data = json.loads(request.body)
    if request.user.is_authenticated:
        if 'score' in data:
            if request.user.is_authenticated:
                request.user.score += int(data['score'])
                if request.user.record < int(data['score']):
                    request.user.record = int(data['score'])
                    request.user.save(update_fields=['record'])
                request.user.save(update_fields=['score'])
                
        context = {'score':request.user.score}
    context = {}
    return render(request,"main/play_snake.html",context)

def recordTable(request):
    users = User.objects.order_by('-score')[:10]
    button_add = True
    print()
    if len(User.objects.order_by('-score')[:11])<=10:
        button_add = False
    context = {
        'users':users,
        'button_add':button_add
        }
    return render(request,'main/record_table.html',context)

def add_table(request,quantity):
    print(quantity)
    users = User.objects.order_by('-score')[:quantity+5]
    
    if len(User.objects.order_by('-score')[:quantity+6])<=User.objects.order_by('-score')[:quantity+5].count():
        button_add = False
    context = {
        'users':users,
        'button_add':button_add
        }
    return render(request,'main/record_table.html',context)