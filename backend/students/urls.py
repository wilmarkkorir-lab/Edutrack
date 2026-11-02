from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LoginView, LogoutView, StudentViewSet

router = DefaultRouter()
router.register("students", StudentViewSet, basename="student")

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("auth/logout/", LogoutView.as_view()),
    path("", include(router.urls)),
]
