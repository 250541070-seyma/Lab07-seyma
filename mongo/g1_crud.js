// 1. Kendinizi uye yapin (_id: 9001)
db.uyeler.insertOne({
  _id: 9001,
  ad: "Emine Gülmez",
  dogum_yili: 2005,
  telefonlar: ["05551234567"]
});

// 2. 10 numarali uyenin dogum_yili alanini 1999 yapin
db.uyeler.updateOne(
  { _id: 10 },
  { $set: { dogum_yili: 1999 } }
);

// 3. 20 numarali uyeyi silin
db.uyeler.deleteOne({ _id: 20 });

// 4. Uye 20 silindikten sonra kayitlar koleksiyonundaki oksuz kayit sayisi
const oksuzSayisi = db.kayitlar.countDocuments({ uye_id: 20 });
print("Uye 20 oksuz kayit sayisi: " + oksuzSayisi);
