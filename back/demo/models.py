from django.db import models

class File(models.Model):
    filename = models.CharField(max_length=255)
    filecontent = models.TextField()

    def __str__(self):
        return self.filename

class Vulnerability(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='vulnerabilities')
    vulnerability = models.CharField(max_length=255)
    description = models.TextField()
    risk = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    recommendation = models.TextField()
    cwe = models.CharField(max_length=255)
    implemented_measures = models.TextField()

    def __str__(self):
        return self.vulnerability
