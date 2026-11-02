import uuid
from datetime import date

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Student(models.Model):
    class Gender(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"
        OTHER = "O", "Other"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        GRADUATED = "graduated", "Graduated"
        SUSPENDED = "suspended", "Suspended"

    student_id = models.CharField(max_length=24, unique=True, editable=False)
    full_name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=24, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=Gender.choices, default=Gender.OTHER)
    course = models.CharField(max_length=120)
    year_of_study = models.PositiveSmallIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(8)]
    )
    gpa = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(4)],
    )
    address = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    enrolled_on = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.student_id} - {self.full_name}"

    def save(self, *args, **kwargs):
        creating = not self.student_id
        if creating:
            self.student_id = f"TMP-{uuid.uuid4().hex[:16]}"
        super().save(*args, **kwargs)
        if creating:
            self.student_id = f"STU-{self.enrolled_on.year}-{self.pk:04d}"
            Student.objects.filter(pk=self.pk).update(student_id=self.student_id)
