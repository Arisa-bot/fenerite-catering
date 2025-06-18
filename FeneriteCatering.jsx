
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function FeneriteCatering() {
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

        <TabsContent value="order">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {language === "bg" ? "FeneriteCatering Поръчка" : "FeneriteCatering Order"}
            </h1>
            <Select onValueChange={(val) => setLanguage(val)} defaultValue={language}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg">Български</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">
                  {language === "bg" ? item.nameBg : item.nameEn} - {item.price.toFixed(2)} лв.
                </h2>
                <Label>
                  {language === "bg" ? "Количество (мин. " + item.minQty + ")" : "Quantity (min. " + item.minQty + ")"}
                </Label>
                <Input
                  type="number"
                  min={item.minQty}
                  step="1"
                  value={quantities[item.id] || ""}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </CardContent>
            </Card>
          ))}

          <div className="text-right">
            <p className="text-lg font-bold">
              {language === "bg" ? "Обща цена:" : "Total Price:"} {totalPrice.toFixed(2)} лв.
            </p>
            <Button onClick={handleSubmit} className="mt-2">
              {language === "bg" ? "Изпрати заявка" : "Submit Order"}
            </Button>
          </div>

          {submitted && (
            <div className="p-4 border rounded-xl bg-green-100 mt-4">
              <p className="text-green-800 font-medium">
                {language === "bg"
                  ? "Заявката беше изпратена успешно. Ще се свържем с Вас."
                  : "Your order has been submitted. We will contact you soon."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="admin">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {language === "bg" ? "Добави нов артикул" : "Add New Item"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder={language === "bg" ? "Име (BG)" : "Name (BG)"}
                value={newItem.nameBg}
                onChange={(e) => setNewItem({ ...newItem, nameBg: e.target.value })}
              />
              <Input
                placeholder={language === "bg" ? "Име (EN)" : "Name (EN)"}
                value={newItem.nameEn}
                onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })}
              />
              <Input
                type="number"
                placeholder={language === "bg" ? "Цена" : "Price"}
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <Input
                type="number"
                placeholder={language === "bg" ? "Мин. количество" : "Min Qty"}
                value={newItem.minQty}
                onChange={(e) => setNewItem({ ...newItem, minQty: e.target.value })}
              />
            </div>
            <Button onClick={handleAddItem}>
              {language === "bg" ? "Добави артикул" : "Add Item"}
            </Button>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">{language === "bg" ? "Експорт на заявки" : "Export Orders"}</h3>
              <div className="flex gap-4 mt-2">
                <Button variant="outline" onClick={() => handleExport('csv')}>CSV</Button>
                <Button variant="outline" onClick={() => handleExport('txt')}>TXT</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
