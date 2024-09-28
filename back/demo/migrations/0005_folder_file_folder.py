# Generated by Django 5.1 on 2024-09-27 17:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0004_remove_file_vuln_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('foldername', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='file',
            name='folder',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='demo.folder'),
            preserve_default=False,
        ),
    ]
