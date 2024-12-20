# Generated by Django 5.1.3 on 2024-12-20 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_userprofile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='is_successful',
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_method',
            field=models.CharField(choices=[('Cash', 'Cash'), ('Visa', 'Visa')], default='pending', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_status',
            field=models.CharField(default='Pending', max_length=10),
        ),
        migrations.AddField(
            model_name='payment',
            name='service_type',
            field=models.CharField(choices=[('Dine In', 'Dine In'), ('Delivery', 'Delivery'), ('Pick Up', 'Pick Up')], default='Cash', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='payment',
            name='card_number',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
        migrations.AlterField(
            model_name='payment',
            name='cvv',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
        migrations.AlterField(
            model_name='payment',
            name='expiry_date',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.DeleteModel(
            name='UserProfile',
        ),
    ]
