# Generated by Django 5.1.3 on 2024-12-20 17:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_pizza_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='pizza',
            field=models.ForeignKey(default='2', on_delete=django.db.models.deletion.CASCADE, to='users.pizza'),
            preserve_default=False,
        ),
    ]