from django.db import models
from django.utils.text import slugify


class Produit(models.Model):
    nom = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, editable=False)
    description = models.TextField(blank=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    # Web: ImageField (optionnel). Mobile: image_url renvoyée par endpoint d'upload
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    actif = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.nom or '')
            candidate, i = base, 1
            while Produit.objects.filter(slug=candidate).exists():
                i += 1
                candidate = f"{base}-{i}"
            self.slug = candidate
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.nom


class Commande(models.Model):
    STATUTS = (
        ('brouillon', 'Brouillon'),
        ('confirmee', 'Confirmée'),
    )
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='commandes')
    statut = models.CharField(max_length=10, choices=STATUTS, default='brouillon')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_confirmation = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Commande #{self.pk} ({self.statut})"


class LigneCommande(models.Model):
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='lignes')
    produit = models.ForeignKey(Produit, on_delete=models.PROTECT, related_name='lignes')
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantite} x {self.produit.nom}"
