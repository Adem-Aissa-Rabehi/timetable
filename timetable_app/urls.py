from django.urls import path
from timetable_app import views

urlpatterns = [
    # index url
    path('', views.index),
    path('api/plannings/', views.get_plannings),
    path('api/plannings/create/', views.create_planning),
    path('api/plannings/delete/<int:planning_id>/', views.delete_planning),
    path('api/plannings/edit/<int:planning_id>/', views.update_planning),
    # end for index url

    # planning url
    path('planning/<int:planning_id>/', views.planning_detail, name='planning_detail'),
    # end for planning url

    # API endpoints for subjects, groups, rooms, and teachers
    path('api/planning/<int:planning_id>/subjects/', views.get_subjects, name='get-subjects'),
    path('api/planning/<int:planning_id>/classes/', views.get_classes, name='get-classes'),
    path('api/planning/<int:planning_id>/salles/', views.get_rooms, name='get-rooms'),
    path('api/planning/<int:planning_id>/professeurs/', views.get_teachers, name='get-teachers'),
    # end for API endpoints for subjects, groups, rooms, and teachers
]