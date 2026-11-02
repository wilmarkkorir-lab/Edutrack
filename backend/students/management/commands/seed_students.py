import random
from datetime import date

from django.core.management.base import BaseCommand

from students.models import Student

NAMES = [
    "Amina Wanjiru", "Brian Otieno", "Catherine Mwangi", "David Kamau", "Esther Achieng",
    "Faith Njeri", "George Mutiso", "Hannah Chebet", "Isaac Kiprop", "Joy Atieno",
    "Kevin Mwenda", "Lilian Naliaka",
]
COURSES = ["Computer Science", "Business Administration", "Civil Engineering", "Nursing", "Law"]


class Command(BaseCommand):
    help = "Insert sample students for demos (skipped if students already exist)."

    def handle(self, *args, **options):
        if Student.objects.exists():
            self.stdout.write("Students already exist - nothing seeded.")
            return
        random.seed(7)
        for i, name in enumerate(NAMES):
            Student.objects.create(
                full_name=name,
                email=f"{name.lower().replace(' ', '.')}@example.com",
                phone=f"+2547{random.randint(10000000, 99999999)}",
                date_of_birth=date(random.randint(1998, 2005), random.randint(1, 12), random.randint(1, 28)),
                gender=random.choice(["M", "F"]),
                course=COURSES[i % len(COURSES)],
                year_of_study=random.randint(1, 4),
                gpa=round(random.uniform(2.2, 3.9), 2),
                status=random.choice(["active"] * 4 + ["graduated", "suspended"]),
                address="Nairobi, Kenya",
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(NAMES)} students."))
