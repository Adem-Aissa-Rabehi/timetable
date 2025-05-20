from django.db import models

class Planning(models.Model):
    nom = models.CharField(max_length=100, null=True, blank=True)
    session = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.nom or "Planning sans nom"
    
class Subject(models.Model):
    planning = models.ForeignKey(Planning, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    abbreviation = models.CharField(max_length=10, null=True, blank=True)
    number_of_lessons = models.PositiveIntegerField(null=True, blank=True)
    ideal_time = models.PositiveIntegerField(null=True, blank=True)  # Temps idéal par exemple
    preparation_time = models.PositiveIntegerField(null=True, blank=True)
    distribution = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=7, null=True, blank=True)  # Couleur pour affichage visuel (ex: #FF5733)

    def __str__(self):
        return self.name or "Sujet inconnu"
    
class ClassGroup(models.Model):
    planning = models.ForeignKey(Planning, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    abbreviation = models.CharField(max_length=10, null=True, blank=True)
    student_count = models.PositiveIntegerField(null=True, blank=True)
    color = models.CharField(max_length=7, null=True, blank=True)  # Ex: #4A90E2
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='class_groups')

    def __str__(self):
        return self.name or "Groupe inconnu"
    
class Room(models.Model):
    planning = models.ForeignKey(Planning, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    is_available = models.BooleanField(default=True, null=True, blank=True)

    def __str__(self):
        return self.name or "Salle inconnue"
    
class Teacher(models.Model):
    planning = models.ForeignKey(Planning, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    max_hours_per_day = models.PositiveIntegerField(null=True, blank=True)
    availability = models.TextField(null=True, blank=True)  # ex: "Lundi-Mercredi"
    contact_info = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name or "Professeur inconnu"
    
class Lesson(models.Model):
    planning = models.ForeignKey(Planning, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    group = models.ForeignKey(ClassGroup, on_delete=models.SET_NULL, null=True, blank=True)

    day = models.CharField(
        max_length=10,
        choices=[
            ('dimanche', 'Dimanche'),
            ('lundi', 'Lundi'),
            ('mardi', 'Mardi'),
            ('mercredi', 'Mercredi'),
            ('jeudi', 'Jeudi'),
            ('vendredi', 'Vendredi'),
            ('samedi', 'Samedi')
        ],
        null=True,
        blank=True
    )

    time_slot = models.PositiveIntegerField(null=True, blank=True)  # Numéro du créneau horaire
    duration = models.PositiveIntegerField(null=True, blank=True)   # Durée en minutes

    def __str__(self):
        return f"Cours {self.subject} - Créneau {self.time_slot}, {self.day}"