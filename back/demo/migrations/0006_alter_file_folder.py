# Generated by Django 5.1 on 2024-09-29 13:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0005_folder_file_folder'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='folder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='demo.folder'),
        ),
    ]
