# Generated by Django 5.1 on 2024-09-06 17:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0003_alter_vuln_vulnerability'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='vuln',
        ),
        migrations.RenameField(
            model_name='file',
            old_name='file_content',
            new_name='filecontent',
        ),
        migrations.RenameField(
            model_name='file',
            old_name='file_name',
            new_name='filename',
        ),
        migrations.AlterField(
            model_name='file',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.CreateModel(
            name='Vulnerability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vulnerability', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('risk', models.CharField(max_length=50)),
                ('priority', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=50)),
                ('recommendation', models.TextField()),
                ('cwe', models.CharField(max_length=255)),
                ('implemented_measures', models.TextField()),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vulnerabilities', to='demo.file')),
            ],
        ),
        migrations.DeleteModel(
            name='Vuln',
        ),
    ]
