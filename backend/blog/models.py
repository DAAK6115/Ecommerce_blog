from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

class Article(models.Model):
    titre = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, editable=False)
    contenu = models.TextField()
    auteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    date_publication = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, default='publie')  # ex: 'brouillon', 'publie'

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.titre)
            candidate, i = base, 1
            while Article.objects.filter(slug=candidate).exists():
                i += 1
                candidate = f"{base}-{i}"
            self.slug = candidate
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class Commentaire(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='commentaires')
    # related_name explicite côté User pour éviter toute collision
    auteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_commentaires')
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, default='publie')  # ex: 'masque', 'publie'

    def __str__(self):
        return f"Commentaire({self.auteur} -> {self.article})"
