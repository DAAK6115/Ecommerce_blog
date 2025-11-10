from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProfileSerializer
from .serializers import RegisterSerializer, LoginSerializer

token_generator = PasswordResetTokenGenerator()


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response({
            "id": u.id,
            "email": u.email,
            "username": getattr(u, "username", None),
            "is_staff": u.is_staff,
            "is_superuser": u.is_superuser,
            "first_name": u.first_name,
            "last_name": u.last_name,
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].lower().strip()
        username = serializer.validated_data['username'].strip()
        password = serializer.validated_data['password']
        nom = serializer.validated_data.get('nom', '').strip()
        prenom = serializer.validated_data.get('prenom', '').strip()

        # contrôles de doublons
        if User.objects.filter(username__iexact=username).exists():
            return Response({'field': 'username', 'detail': 'Ce nom existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email__iexact=email).exists():
            return Response({'field': 'email', 'detail': 'Cet email existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=prenom,
                last_name=nom,
                is_active=False  # activation par email
            )
        except (IntegrityError, ValidationError):
            return Response({'detail': 'Création impossible.'}, status=status.HTTP_400_BAD_REQUEST)

        # Génération du token d’activation
        token = token_generator.make_token(user)
        uid = str(user.pk)

        activation_front_url = f"http://localhost:5173/activate?uid={uid}&token={token}"
        print("=== ACTIVATION (DEV) ===")
        print(activation_front_url)
        print("========================")

        return Response({
            'id': user.id,
            'message': 'Utilisateur créé. Consulte la console pour le lien d’activation.'
        }, status=status.HTTP_201_CREATED)


class ActivateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')

        if not uid or not token:
            return Response({'detail': 'Paramètres manquants.'}, status=400)

        try:
            user = User.objects.get(pk=int(uid))
        except (User.DoesNotExist, ValueError):
            return Response({'detail': 'UID inconnu.'}, status=400)

        if not token_generator.check_token(user, token):
            return Response({'detail': 'Lien invalide ou expiré.'}, status=400)

        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])

        return Response({'detail': 'Compte activé.'})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].lower().strip()
        password = serializer.validated_data['password']

        # retrouver le username à partir de l'email
        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'Email inconnu.'}, status=400)

        if not user_obj.is_active:
            return Response({'detail': 'Compte inactif. Active d’abord ton compte.'}, status=401)

        user = authenticate(request, username=user_obj.username, password=password)
        if not user:
            return Response({'detail': 'Identifiants invalides.'}, status=401)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
