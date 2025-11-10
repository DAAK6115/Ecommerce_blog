from django.contrib.auth.models import User
from django.db import models

User._meta.get_field("email")._unique = True # rapide pour MVP


class Article(models.Model):
    titre = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    contenu = models.TextField()
    auteur = models.ForeignKey(User, on_delete=models.CASCADE)
    date_publication = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, default="publie")


class Commentaire(models.Model):
    article = models.ForeignKey(Article, related_name="commentaires", on_delete=models.CASCADE)
    auteur = models.ForeignKey(User, on_delete=models.CASCADE)
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, default="publie")
