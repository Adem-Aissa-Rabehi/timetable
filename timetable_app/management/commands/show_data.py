from django.core.management.base import BaseCommand
from timetable_app.models import Planning, Subject, ClassGroup, Room, Teacher, Lesson

class Command(BaseCommand):
    help = 'Affiche les données présentes dans la base'

    def handle(self, *args, **kwargs):
        self.stdout.write('=== PLANNINGS ===')
        for planning in Planning.objects.all():
            self.stdout.write(f'- {planning}')

        self.stdout.write('\n=== MATIÈRES ===')
        for subject in Subject.objects.all():
            self.stdout.write(f'- {subject}')

        self.stdout.write('\n=== GROUPES ===')
        for group in ClassGroup.objects.all():
            self.stdout.write(f'- {group}')

        self.stdout.write('\n=== SALLES ===')
        for room in Room.objects.all():
            self.stdout.write(f'- {room}')

        self.stdout.write('\n=== PROFESSEURS ===')
        for teacher in Teacher.objects.all():
            self.stdout.write(f'- {teacher}')

        self.stdout.write('\n=== COURS ===')
        for lesson in Lesson.objects.all():
            self.stdout.write(f'- {lesson}') 