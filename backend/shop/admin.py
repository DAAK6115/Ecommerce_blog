from django.contrib import admin
from .models import Produit, Commande, LigneCommande


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('nom','prix','stock','actif','slug')
    search_fields = ('nom',)
    prepopulated_fields = {}  # slug auto, on ne le propose pas


class LigneInline(admin.TabularInline):
    model = LigneCommande
    extra = 0

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'statut', 'total', 'date_creation', 'date_confirmation')
    inlines = [LigneInline]
