from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    gender_display = serializers.CharField(source="get_gender_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "student_id", "full_name", "email", "phone", "date_of_birth",
            "gender", "gender_display", "course", "year_of_study", "gpa", "address",
            "status", "status_display", "enrolled_on", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "student_id", "created_at", "updated_at"]
        # Uniqueness is handled in validate_email so matching is case-insensitive.
        extra_kwargs = {"email": {"validators": []}}

    def validate_full_name(self, value):
        value = " ".join(value.split())
        if len(value) < 2:
            raise serializers.ValidationError("Enter the student's full name.")
        return value

    def validate_email(self, value):
        value = value.lower()
        qs = Student.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value
