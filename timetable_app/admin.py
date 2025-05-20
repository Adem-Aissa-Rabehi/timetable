from django.contrib import admin
from .models import Planning, Subject, ClassGroup, Room, Teacher

# === Admin : Sujets ===
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('planning', 'name', 'abbreviation', 'number_of_lessons', 'ideal_time', 'preparation_time')
    search_fields = ('name', 'abbreviation')
    list_filter = ('planning',)
    ordering = ('planning', 'name')

# === Admin : Classes ===
@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = ('planning', 'name', 'abbreviation', 'student_count')
    search_fields = ('name',)
    list_filter = ('planning',)
    ordering = ('planning', 'name')

# === Admin : Salles ===
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('planning', 'name', 'capacity', 'location', 'is_available')
    search_fields = ('name', 'location')
    list_filter = ('planning', 'is_available')
    ordering = ('planning', 'name')

# === Admin : Professeurs ===
@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('planning', 'name', 'subject', 'max_hours_per_day')
    search_fields = ('name', 'subject__name')
    list_filter = ('planning', 'subject')
    ordering = ('planning', 'name')

# === Admin : Planning principal ===
@admin.register(Planning)
class PlanningAdmin(admin.ModelAdmin):
    list_display = ('nom', 'session', 'created_at')
    search_fields = ('nom', 'session')
    ordering = ('nom',)