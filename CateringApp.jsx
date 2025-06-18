
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CateringApp() {
  const [language, setLanguage] = useState("bg");
  const [items, setItems] = useState([
    { id: 1, nameBg: "Мини бургери", nameEn: "Mini Burgers", price: 3.5, minQty: 12 },
    { id: 2, nameBg: "Канапе със сьомга", nameEn: "Salmon Canapé", price: 2.8, minQty: 12 },
    { id: 3, nameBg: "Мини тарталети", nameEn: "Mini Tartlets", price: 1.5, minQty: 12 },
  ]);
  const [quantities, setQuantities] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orders, setOrders] = useState([]);

  const [newItem, setNewItem] = useState({ nameBg: '', nameEn: '', price: '', minQty: '' });

  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: parseInt(value) || 0,
    });
  };

  const totalPrice = items.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + (qty >= item.minQty ? qty * item.price : 0);
  }, 0);

  const handleSubmit = () => {
    const selectedItems = items.filter(item => (quantities[item.id] || 0) >= item.minQty);
    const orderData = selectedItems.map(item => ({
      name: language === "bg" ? item.nameBg : item.nameEn,
      qty: quantities[item.id],
      price: item.price
    }));
    const order = {
      timestamp: new Date().toLocaleString(),
      items: orderData,
      total: totalPrice.toFixed(2)
    };
    setOrders([...orders, order]);
    setSubmitted(true);
    console.log("New order submitted:", order);
    alert("📧 Email notification sent! (симулация)");
  };

  const handleExport = (format) => {
    let content = '';
    if (format === 'csv') {
      content = 'Име,Количество,Цена\n';
      orders.forEach(order => {
        order.items.forEach(item => {
          content += `${item.name},${item.qty},${item.price}\n`;
        });
      });
    } else if (format === 'txt') {
      orders.forEach(order => {
        content += `--- Заявка от ${order.timestamp} ---\n`;
        order.items.forEach(item => {
          content += `${item.name} - ${item.qty} бр. x ${item.price} лв.\n`;
        });
        content += `Обща сума: ${order.total} лв.\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddItem = () => {
    const id = items.length + 1;
    setItems([
      ...items,
      {
        id,
        nameBg: newItem.nameBg,
        nameEn: newItem.nameEn,
        price: parseFloat(newItem.price),
        minQty: parseInt(newItem.minQty)
      }
    ]);
    setNewItem({ nameBg: '', nameEn: '', price: '', minQty: '' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Tabs defaultValue="order">
        <TabsList>
          <TabsTrigger value="order">{language === 'bg' ? 'Поръчка' : 'Order'}</TabsTrigger>
          <TabsTrigger value="admin">{language === 'bg' ? 'Админ панел' : 'Admin Panel'}</TabsTrigger>
        </TabsList>
        <TabsContent value="order">...order UI...</TabsContent>
        <TabsContent value="admin">...admin UI...</TabsContent>
      </Tabs>
    </div>
  );
}
