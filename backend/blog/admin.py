from django.contrib import admin
from .models import Article, Commentaire

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'titre', 'slug', 'auteur', 'date_publication', 'statut')
    list_filter = ('statut', 'date_publication')
    search_fields = ('titre', 'contenu', 'slug', 'auteur__username')
    readonly_fields = ('slug', 'date_publication')

@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'article', 'auteur', 'date_creation', 'statut')
    list_filter = ('statut', 'date_creation')
    search_fields = ('contenu', 'article__titre', 'auteur__username')
