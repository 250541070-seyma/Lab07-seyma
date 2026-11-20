// 1. Kendimizi üye olarak ekleyelim (_id: 9001)
db.uyeler.insertOne({
  _id: 9001,
  ad: "Şeyma Nur Katar",
  dogum_yili: 2005,
  telefonlar: ["05551234567"]
});

// 2. 10 numaralı üyenin doğum yılını 1999 yapalım
db.uyeler.updateOne(
  { _id: 10 },
  { $set: { dogum_yili: 1999 } }
);

// 3. 20 numaralı üyeyi silelim
db.uyeler.deleteOne({ _id: 20 });

// 4. Üye 20 silindikten sonra kayitlar koleksiyonunda kalan öksüz kayıt sayısını bulalım
const oksuzSayisi = db.kayitlar.countDocuments({ uye_id: 20 });
print("Üye 20 için kalan öksüz kayıt sayısı: " + oksuzSayisi);