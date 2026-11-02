from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_id", "full_name", "email", "course", "year_of_study", "status")
    list_filter = ("status", "course", "year_of_study")
    search_fields = ("student_id", "full_name", "email")
