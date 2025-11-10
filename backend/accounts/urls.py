from django.urls import path
from .views import RegisterView, ActivateView, LoginView, ProfileView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='accounts-register'),
    # GET /api/accounts/activate/?uid=...&token=...
    path('activate/', ActivateView.as_view(), name='accounts-activate'),
    path('login/',    LoginView.as_view(),    name='accounts-login'),
    path("me/", MeView.as_view(), name="accounts-me"),          # si déjà en place
    path("profile/", ProfileView.as_view(), name="accounts-profile"),
]
