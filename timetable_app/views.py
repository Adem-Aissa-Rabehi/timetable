from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Planning, Subject, ClassGroup, Room, Teacher
import json

# Vues pour la page d'index
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

# Vues pour la page de détail du planning
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

# Vues API pour les sujets
class SubjectListView(View):
    def get(self, request, planning_id):
        subjects = Subject.objects.filter(planning_id=planning_id)
        data = [{
            'id': subject.id,
            'name': subject.name,
            'abbreviation': subject.abbreviation,
            'number_of_lessons': subject.number_of_lessons,
            'ideal_time': subject.ideal_time,
            'distribution': subject.distribution,
            'preparation_time': subject.preparation_time,
            'color': subject.color
        } for subject in subjects]
        return JsonResponse(data, safe=False)

# Vues API pour les classes
class ClassListView(View):
    def get(self, request, planning_id):
        classes = ClassGroup.objects.filter(planning_id=planning_id)
        data = [{
            'id': classe.id,
            'name': classe.name,
            'abbreviation': classe.abbreviation,
            'student_count': classe.student_count,
            'color': classe.color
        } for classe in classes]
        return JsonResponse(data, safe=False)

# Vues API pour les salles
class RoomListView(View):
    def get(self, request, planning_id):
        try:
            rooms = Room.objects.filter(planning_id=planning_id)
            data = [{
                'id': room.id,
                'name': room.name,
                'location': room.location,
                'capacity': room.capacity,
                'is_available': room.is_available
            } for room in rooms]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# Vues API pour les professeurs
class TeacherListView(View):
    def get(self, request, planning_id):
        try:
            teachers = Teacher.objects.filter(planning_id=planning_id)
            data = [{
                'id': teacher.id,
                'name': teacher.name,
                'subject': teacher.subject.name if teacher.subject else None,
                'max_hours_per_day': teacher.max_hours_per_day,
                'availability': teacher.availability,
                'contact_info': teacher.contact_info
            } for teacher in teachers]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# Vues pour les sujets d'une classe
class ClassSubjectsView(View):
    def get(self, request, planning_id, class_id):
        try:
            classe = ClassGroup.objects.get(id=class_id, planning_id=planning_id)
            subject = classe.subject
            if subject:
                data = [{
                    'id': subject.id,
                    'name': subject.name,
                    'abbreviation': subject.abbreviation,
                    'number_of_lessons': subject.number_of_lessons
                }]
            else:
                data = []
            return JsonResponse(data, safe=False)
        except ClassGroup.DoesNotExist:
            return JsonResponse({'error': 'Classe non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def post(self, request, planning_id, class_id):
        try:
            classe = ClassGroup.objects.get(id=class_id, planning_id=planning_id)
            data = json.loads(request.body)
            subject_ids = data.get('subjects', [])
            if subject_ids:
                subject_id = subject_ids[0]  # Prendre le premier ID
                subject = Subject.objects.get(id=subject_id)
                classe.subject = subject
            else:
                classe.subject = None
            classe.save()
            return JsonResponse({'message': 'Matière mise à jour avec succès'})
        except ClassGroup.DoesNotExist:
            return JsonResponse({'error': 'Classe non trouvée'}, status=404)
        except Subject.DoesNotExist:
            return JsonResponse({'error': 'Matière non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# Vues pour les sujets d'un professeur
class TeacherSubjectsView(View):
    def get(self, request, planning_id, teacher_id):
        try:
            teacher = Teacher.objects.get(id=teacher_id, planning_id=planning_id)
            subject = teacher.subject
            if subject:
                data = [{
                    'id': subject.id,
                    'name': subject.name,
                    'abbreviation': subject.abbreviation,
                    'number_of_lessons': subject.number_of_lessons
                }]
            else:
                data = []
            return JsonResponse(data, safe=False)
        except Teacher.DoesNotExist:
            return JsonResponse({'error': 'Professeur non trouvé'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def post(self, request, planning_id, teacher_id):
        try:
            teacher = Teacher.objects.get(id=teacher_id, planning_id=planning_id)
            data = json.loads(request.body)
            subject_ids = data.get('subjects', [])
            if subject_ids:
                subject_id = subject_ids[0]  # Prendre le premier ID
                subject = Subject.objects.get(id=subject_id)
                teacher.subject = subject
            else:
                teacher.subject = None
            teacher.save()
            return JsonResponse({'message': 'Matière mise à jour avec succès'})
        except Teacher.DoesNotExist:
            return JsonResponse({'error': 'Professeur non trouvé'}, status=404)
        except Subject.DoesNotExist:
            return JsonResponse({'error': 'Matière non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# Vue pour ajouter un élément
@csrf_exempt
def add_item(request, planning_id, item_type):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            planning = Planning.objects.get(id=planning_id)
            
            if item_type == 'subjects':
                item = Subject.objects.create(
                    planning=planning,
                    name=data['name'],
                    abbreviation=data.get('abbreviation', ''),
                    number_of_lessons=data.get('number_of_lessons', 1),
                    ideal_time=data.get('ideal_time', 50),
                    distribution=data.get('distribution', ''),
                    preparation_time=data.get('preparation_time', 0),
                    color=data.get('color', '#000000')
                )
            elif item_type == 'classes':
                item = ClassGroup.objects.create(
                    planning=planning,
                    name=data['name'],
                    abbreviation=data.get('abbreviation', ''),
                    student_count=data.get('student_count', 30),
                    color=data.get('color', '#000000')
                )
            elif item_type == 'rooms':
                item = Room.objects.create(
                    planning=planning,
                    name=data['name'],
                    location=data.get('location', ''),
                    capacity=data.get('capacity', 30),
                    is_available=data.get('is_available', True)
                )
            elif item_type == 'teachers':
                subject = None
                if data.get('subject_id'):
                    subject = Subject.objects.get(id=data['subject_id'])
                item = Teacher.objects.create(
                    planning=planning,
                    name=data['name'],
                    subject=subject,
                    max_hours_per_day=data.get('max_hours_per_day', 6),
                    availability=data.get('availability', ''),
                    contact_info=data.get('contact_info', '')
                )
            else:
                return JsonResponse({'error': 'Type d\'élément invalide'}, status=400)
            
            return JsonResponse({
                'message': 'Élément ajouté avec succès',
                'id': item.id,
                'name': item.name
            })
        except Planning.DoesNotExist:
            return JsonResponse({'error': 'Planning non trouvé'}, status=404)
        except Subject.DoesNotExist:
            return JsonResponse({'error': 'Matière non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)