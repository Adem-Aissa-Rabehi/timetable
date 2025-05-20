from django.core.management.base import BaseCommand
from timetable_app.models import Planning, Subject, ClassGroup, Room, Teacher, Lesson
from django.utils import timezone

def create_test_data():
    # Création d'un planning
    planning = Planning.objects.create(
        nom="Planning Test 2024",
        session="2024-2025",
        created_at=timezone.now()
    )

    # Création des matières
    subjects = [
        Subject.objects.create(
            planning=planning,
            name="Mathématiques",
            abbreviation="MATH",
            number_of_lessons=4,
            ideal_time=60,
            preparation_time=30,
            distribution="2-2",
            color="#FF5733"
        ),
        Subject.objects.create(
            planning=planning,
            name="Français",
            abbreviation="FR",
            number_of_lessons=3,
            ideal_time=45,
            preparation_time=20,
            distribution="1-2",
            color="#4A90E2"
        ),
        Subject.objects.create(
            planning=planning,
            name="Histoire",
            abbreviation="HIST",
            number_of_lessons=2,
            ideal_time=45,
            preparation_time=15,
            distribution="1-1",
            color="#50C878"
        )
    ]

    # Création des groupes
    groups = [
        ClassGroup.objects.create(
            planning=planning,
            name="6ème A",
            abbreviation="6A",
            student_count=25,
            color="#FFD700"
        ),
        ClassGroup.objects.create(
            planning=planning,
            name="6ème B",
            abbreviation="6B",
            student_count=28,
            color="#FF69B4"
        )
    ]

    # Création des salles
    rooms = [
        Room.objects.create(
            planning=planning,
            name="Salle 101",
            capacity=30,
            location="Bâtiment A",
            is_available=True
        ),
        Room.objects.create(
            planning=planning,
            name="Salle 102",
            capacity=25,
            location="Bâtiment A",
            is_available=True
        ),
        Room.objects.create(
            planning=planning,
            name="Salle Informatique",
            capacity=20,
            location="Bâtiment B",
            is_available=True
        )
    ]

    # Création des professeurs
    teachers = [
        Teacher.objects.create(
            planning=planning,
            name="Marie Dupont",
            subject=subjects[0],  # Mathématiques
            max_hours_per_day=6,
            contact_info="marie.dupont@ecole.fr"
        ),
        Teacher.objects.create(
            planning=planning,
            name="Jean Martin",
            subject=subjects[1],  # Français
            max_hours_per_day=5,
            contact_info="jean.martin@ecole.fr"
        ),
        Teacher.objects.create(
            planning=planning,
            name="Sophie Bernard",
            subject=subjects[2],  # Histoire
            max_hours_per_day=4,
            contact_info="sophie.bernard@ecole.fr"
        )
    ]

    # Création de quelques cours
    days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
    for day in days:
        # Cours de mathématiques
        Lesson.objects.create(
            planning=planning,
            subject=subjects[0],
            teacher=teachers[0],
            room=rooms[0],
            group=groups[0],
            day=day,
            time_slot=1,
            duration=60
        )
        
        # Cours de français
        Lesson.objects.create(
            planning=planning,
            subject=subjects[1],
            teacher=teachers[1],
            room=rooms[1],
            group=groups[0],
            day=day,
            time_slot=3,
            duration=45
        )
        
        # Cours d'histoire
        Lesson.objects.create(
            planning=planning,
            subject=subjects[2],
            teacher=teachers[2],
            room=rooms[2],
            group=groups[0],
            day=day,
            time_slot=5,
            duration=45
        )

    return planning

if __name__ == "__main__":
    create_test_data() 