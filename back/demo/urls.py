from django.urls import path 
from .views import analyze_code,update_vulnerability_status,get_vulnerabilities_by_filename

urlpatterns = [
    path('analyze_code/', analyze_code, name='analyze_code'),
    path('vulnerability/<int:vulnerabilityId>/status/', update_vulnerability_status, name='update_vulnerability_status'),
    path('vulnerabilities/<str:fileName>/', get_vulnerabilities_by_filename, name='get_vulnerabilities_by_filename'),
]
