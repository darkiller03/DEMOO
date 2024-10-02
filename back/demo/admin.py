from django.contrib import admin
from .models import File, Vulnerability, Folder

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('id', 'foldername') 
    search_fields = ('foldername',) 

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'filename', 'filecontent','folder')
    search_fields = ('filename',)
    list_filter = ('folder',)

@admin.register(Vulnerability)
class VulnerabilityAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'vulnerability', 'file', 'status', 'risk', 
        'recommendation', 'implemented_measures', 'description', 
        'priority', 'cwe'
    )
    search_fields = ('vulnerability', 'description')
    list_filter = ('file',)  # Allows filtering vulnerabilities by file