import datetime

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Student",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("student_id", models.CharField(editable=False, max_length=24, unique=True)),
                ("full_name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone", models.CharField(blank=True, max_length=24)),
                ("date_of_birth", models.DateField(blank=True, null=True)),
                ("gender", models.CharField(choices=[("M", "Male"), ("F", "Female"), ("O", "Other")], default="O", max_length=1)),
                ("course", models.CharField(max_length=120)),
                (
                    "year_of_study",
                    models.PositiveSmallIntegerField(
                        default=1,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(8),
                        ],
                    ),
                ),
                (
                    "gpa",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=3,
                        null=True,
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(4),
                        ],
                    ),
                ),
                ("address", models.TextField(blank=True)),
                (
                    "status",
                    models.CharField(
                        choices=[("active", "Active"), ("graduated", "Graduated"), ("suspended", "Suspended")],
                        default="active",
                        max_length=10,
                    ),
                ),
                ("enrolled_on", models.DateField(default=datetime.date.today)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at", "-id"]},
        ),
    ]
