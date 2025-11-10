from rest_framework import serializers
from .models import Article, Commentaire
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User


class CommentaireSerializer(serializers.ModelSerializer):
    auteur_username = serializers.CharField(source='auteur.username', read_only=True)

    class Meta:
        model = Commentaire
        fields = ['id', 'auteur', 'auteur_username', 'contenu', 'date_creation', 'statut']
        read_only_fields = ['id', 'auteur', 'auteur_username', 'date_creation']


class ArticleSerializer(serializers.ModelSerializer):
    auteur_username = serializers.CharField(source='auteur.username', read_only=True)
    commentaires = CommentaireSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'titre', 'slug', 'contenu', 'auteur', 'auteur_username',
            'date_publication', 'statut', 'commentaires'
        ]
        read_only_fields = ['id', 'slug', 'auteur', 'auteur_username', 'date_publication']


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
