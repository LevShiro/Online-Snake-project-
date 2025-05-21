from django.shortcuts import render,redirect
from django.contrib.auth import logout
import json
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
                request.user.save(update_fields=['score'])
                
        context = {'score':request.user.score}
    context = {}
    return render(request,"main/play_snake.html",context)

def recordTable(request):
    return render(request,'main/record_table.html')