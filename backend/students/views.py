from django.contrib.auth import authenticate
from django.db.models import Avg, Count
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Student
from .serializers import StudentSerializer


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data.get("username", ""),
            password=request.data.get("password", ""),
        )
        if not user:
            return Response(
                {"detail": "Wrong username or password."}, status=status.HTTP_400_BAD_REQUEST
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class LogoutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentViewSet(viewsets.ModelViewSet):
    """Full CRUD plus search (?search=), filters (?status=&course=&year=) and ordering (?ordering=)."""

    serializer_class = StudentSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["full_name", "email", "student_id", "course"]
    ordering_fields = ["full_name", "course", "year_of_study", "gpa", "created_at", "student_id"]

    def get_queryset(self):
        qs = Student.objects.all()
        params = self.request.query_params
        if params.get("status"):
            qs = qs.filter(status=params["status"])
        if params.get("course"):
            qs = qs.filter(course__iexact=params["course"])
        if params.get("year"):
            qs = qs.filter(year_of_study=params["year"])
        return qs

    @action(detail=False, methods=["get"])
    def stats(self, request):
        qs = Student.objects.all()
        by_status = {s: 0 for s, _ in Student.Status.choices}
        for row in qs.values("status").annotate(n=Count("id")):
            by_status[row["status"]] = row["n"]
        avg = qs.aggregate(a=Avg("gpa"))["a"]
        courses = list(
            qs.values("course").annotate(count=Count("id")).order_by("-count", "course")
        )
        return Response(
            {
                "total": qs.count(),
                "by_status": by_status,
                "average_gpa": round(float(avg), 2) if avg is not None else None,
                "courses": courses,
            }
        )
