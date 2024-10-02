from django.urls import path 
from .views import analyze_code,update_vulnerability_status,get_vulnerabilities_by_filename,get_vulnerabilities_by_foldername

urlpatterns = [
    path('analyze_code/', analyze_code, name='analyze_code'),
    path('vulnerability/<int:vulnerabilityId>/status/', update_vulnerability_status, name='update_vulnerability_status'),
    path('vulnerabilities/<str:fileName>/', get_vulnerabilities_by_filename, name='get_vulnerabilities_by_filename'),
    path('vulnerabilities/folder/<str:folderName>/',get_vulnerabilities_by_foldername,name='get_vulnerabilities_by_foldername')
]
