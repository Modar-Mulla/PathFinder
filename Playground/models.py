from django.db import models


class Country(models.Model):
    country_name = models.CharField(max_length=255)


class City(models.Model):
    name = models.CharField(max_length=255)
    lat = models.FloatField()
    lng = models.FloatField()
    country = models.ForeignKey(
        Country, on_delete=models.PROTECT, related_name='cities')


class GraphModel(models.Model):
    graph = models.JSONField()
