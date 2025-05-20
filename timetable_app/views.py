from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Planning

# views for the index page and API endpoints
def index(request):
    return render(request, 'index.html')

def get_plannings(request):
    plannings = list(Planning.objects.values())
    return JsonResponse(plannings, safe=False)

def create_planning(request):
    if request.method == 'POST':
        nom = request.POST.get('nom')
        session = request.POST.get('session', '')
        planning = Planning.objects.create(nom=nom, session=session)
        return JsonResponse({
            'id': planning.id,
            'nom': planning.nom,
            'session': planning.session
        })
    return HttpResponse("Méthode non autorisée", status=405)

def delete_planning(request, planning_id):
    try:
        planning = Planning.objects.get(id=planning_id)
        planning.delete()
        return JsonResponse({'status': 'ok'})
    except Planning.DoesNotExist:
        return JsonResponse({'error': 'Introuvable'}, status=404)

def update_planning(request, planning_id):
    try:
        planning = Planning.objects.get(id=planning_id)
        if request.method == 'POST':
            planning.nom = request.POST.get('nom', planning.nom)
            planning.session = request.POST.get('session', planning.session)
            planning.save()
            return JsonResponse({'status': 'ok', 'nom': planning.nom, 'session': planning.session})
        return JsonResponse({'error': 'Méthode invalide'}, status=400)
    except Planning.DoesNotExist:
        return JsonResponse({'error': 'Introuvable'}, status=404)
    
# end for index page and API endpoints

# planning view 
from django.shortcuts import render, get_object_or_404
from .models import Planning, Subject, ClassGroup, Room, Teacher

def planning_detail(request, planning_id):
    planning = get_object_or_404(Planning, id=planning_id)

    subjects = Subject.objects.filter(planning=planning)
    groups = ClassGroup.objects.filter(planning=planning)
    rooms = Room.objects.filter(planning=planning)
    teachers = Teacher.objects.filter(planning=planning)

    return render(request, 'planning_detail.html', {
        'planning': planning,
        'subjects': subjects,
        'groups': groups,
        'rooms': rooms,
        'teachers': teachers,
    })

def get_subjects(request, planning_id):
    subjects = list(Subject.objects.filter(planning_id=planning_id).values())
    return JsonResponse(subjects, safe=False)


def get_classes(request, planning_id):
    classes = list(ClassGroup.objects.filter(planning_id=planning_id).values())
    return JsonResponse(classes, safe=False)


def get_rooms(request, planning_id):
    rooms = list(Room.objects.filter(planning_id=planning_id).values())
    return JsonResponse(rooms, safe=False)


def get_teachers(request, planning_id):
    teachers = list(Teacher.objects.filter(planning_id=planning_id).values())
    return JsonResponse(teachers, safe=False)