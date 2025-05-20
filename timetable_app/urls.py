from django.urls import path
from timetable_app import views

urlpatterns = [
    # URLs pour la page d'index
    path('', views.index),
    path('api/plannings/', views.get_plannings),
    path('api/plannings/create/', views.create_planning),
    path('api/plannings/delete/<int:planning_id>/', views.delete_planning),
    path('api/plannings/edit/<int:planning_id>/', views.update_planning),

    # URL pour la page de détail du planning
    path('planning/<int:planning_id>/', views.planning_detail, name='planning_detail'),

    # URLs API pour les sujets, classes, salles et professeurs
    path('api/planning/<int:planning_id>/subjects/', views.SubjectListView.as_view(), name='subject-list'),
    path('api/planning/<int:planning_id>/classes/', views.ClassListView.as_view(), name='class-list'),
    path('api/planning/<int:planning_id>/rooms/', views.RoomListView.as_view(), name='room-list'),
    path('api/planning/<int:planning_id>/teachers/', views.TeacherListView.as_view(), name='teacher-list'),

    # URLs pour la gestion des sujets des classes et professeurs
    path('api/planning/<int:planning_id>/classes/<int:class_id>/subjects/', views.ClassSubjectsView.as_view(), name='class-subjects'),
    path('api/planning/<int:planning_id>/teachers/<int:teacher_id>/subjects/', views.TeacherSubjectsView.as_view(), name='teacher-subjects'),

    # URL pour ajouter un élément
    path('api/planning/<int:planning_id>/<str:item_type>/add/', views.add_item, name='add-item'),
]