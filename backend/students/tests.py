from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Student

PAYLOAD = {
    "full_name": "Amina Wanjiru",
    "email": "amina@example.com",
    "course": "Computer Science",
    "year_of_study": 2,
    "gpa": "3.50",
    "gender": "F",
}


class StudentAPITests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("tester", password="pass12345")
        self.token = Token.objects.create(user=self.user)

    def auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_requires_authentication(self):
        self.assertEqual(self.client.get("/api/students/").status_code, 401)

    def test_login_success_and_failure(self):
        ok = self.client.post("/api/auth/login/", {"username": "tester", "password": "pass12345"})
        self.assertEqual(ok.status_code, 200)
        self.assertIn("token", ok.data)
        bad = self.client.post("/api/auth/login/", {"username": "tester", "password": "nope"})
        self.assertEqual(bad.status_code, 400)

    def test_create_generates_student_id(self):
        self.auth()
        res = self.client.post("/api/students/", PAYLOAD, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.data["student_id"].startswith("STU-"))

    def test_duplicate_email_rejected(self):
        self.auth()
        self.client.post("/api/students/", PAYLOAD, format="json")
        res = self.client.post("/api/students/", {**PAYLOAD, "email": "AMINA@example.com"}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("email", res.data)

    def test_invalid_gpa_rejected(self):
        self.auth()
        res = self.client.post("/api/students/", {**PAYLOAD, "gpa": "5.0"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_update_and_delete(self):
        self.auth()
        sid = self.client.post("/api/students/", PAYLOAD, format="json").data["id"]
        upd = self.client.put(f"/api/students/{sid}/", {**PAYLOAD, "course": "Law"}, format="json")
        self.assertEqual(upd.status_code, 200)
        self.assertEqual(upd.data["course"], "Law")
        self.assertEqual(self.client.delete(f"/api/students/{sid}/").status_code, 204)
        self.assertEqual(Student.objects.count(), 0)

    def test_search_and_filter(self):
        self.auth()
        self.client.post("/api/students/", PAYLOAD, format="json")
        self.client.post(
            "/api/students/",
            {**PAYLOAD, "full_name": "Brian Otieno", "email": "b@example.com", "status": "graduated"},
            format="json",
        )
        self.assertEqual(self.client.get("/api/students/?search=brian").data["count"], 1)
        self.assertEqual(self.client.get("/api/students/?status=graduated").data["count"], 1)

    def test_stats(self):
        self.auth()
        self.client.post("/api/students/", PAYLOAD, format="json")
        res = self.client.get("/api/students/stats/")
        self.assertEqual(res.data["total"], 1)
        self.assertEqual(res.data["average_gpa"], 3.5)
