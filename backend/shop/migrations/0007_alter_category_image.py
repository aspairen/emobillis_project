# Generated by Django 5.1.3 on 2024-12-07 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0006_alter_product_options_alter_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='image',
            field=models.ImageField(blank=True, default='categories/default_category.jpg', help_text='Image representing the category.', null=True, upload_to='categories/'),
        ),
    ]
