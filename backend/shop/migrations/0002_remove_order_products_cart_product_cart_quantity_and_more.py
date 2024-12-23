# Generated by Django 5.1.3 on 2024-12-06 10:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='products',
        ),
        migrations.AddField(
            model_name='cart',
            name='product',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='shop.product'),
        ),
        migrations.AddField(
            model_name='cart',
            name='quantity',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='cartitem',
            name='product',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='shop.product'),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(default='General', max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='product',
            name='category',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='products', to='shop.category'),
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(default='products/default_image.jgeg', upload_to='products/'),
        ),
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(default='Unnamed Product', max_length=200),
        ),
        migrations.AlterField(
            model_name='product',
            name='stock',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shop.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.product')),
            ],
        ),
        migrations.DeleteModel(
            name='OrderProduct',
        ),
    ]
