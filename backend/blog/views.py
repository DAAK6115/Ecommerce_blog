from rest_framework import generics, permissions
from .models import Article, Commentaire
from .serializers import ArticleSerializer, CommentaireSerializer
from uuid import uuid4
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status


class ArticleListCreate(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-date_publication')
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentaireSerializer

    def get_queryset(self):
        return Commentaire.objects.filter(
            article_id=self.kwargs["pk"]
        ).order_by("date_creation")

    def get_permissions(self):
        # GET = public ; POST = user connecté
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(
            auteur=self.request.user,
            article_id=self.kwargs["pk"]
        )


@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    f = request.FILES.get("file")
    if not f:
        return Response({"detail": "No file"}, status=status.HTTP_400_BAD_REQUEST)

    ext = (f.name.rsplit(".", 1)[-1] or "bin").lower() if "." in f.name else "bin"
    filename = f"{uuid4().hex}.{ext}"
    path = default_storage.save(f"article/{filename}", ContentFile(f.read()))
    url = request.build_absolute_uri(settings.MEDIA_URL + path.replace("\\", "/"))
    return Response({"url": url}, status=status.HTTP_201_CREATED)
