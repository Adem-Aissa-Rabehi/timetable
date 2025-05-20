from django.core.management.base import BaseCommand
from timetable_app.fixtures import create_test_data

class Command(BaseCommand):
    help = 'Charge les données de test dans la base de données'

    def handle(self, *args, **kwargs):
        self.stdout.write('Chargement des données de test...')
        planning = create_test_data()
        self.stdout.write(self.style.SUCCESS(f'Données de test chargées avec succès ! Planning créé : {planning}')) 