from rest_framework import serializers
from .models import Produit, Commande, LigneCommande


class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = ['id', 'nom', 'slug', 'description', 'prix', 'stock', 'image', 'image_url', 'actif']
        read_only_fields = ['id', 'slug']  # slug auto: jamais saisi par le client


class LigneCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneCommande
        fields = ['id', 'produit', 'quantite', 'prix_unitaire']
        read_only_fields = ['id', 'prix_unitaire']  # calculé depuis produit.prix


class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True, read_only=True)

    class Meta:
        model = Commande
        fields = ['id', 'user', 'statut', 'total', 'date_creation', 'date_confirmation', 'lignes']
        read_only_fields = ['id', 'user', 'total', 'date_creation', 'date_confirmation', 'statut']
