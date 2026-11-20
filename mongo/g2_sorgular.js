// 2.1: 2000 ve sonrasi dogumlu uye sayisi
const g2_1 = db.uyeler.countDocuments({ dogum_yili: { $gte: 2000 } });
print("2.1 (2000 ve sonrasi dogumlu uye sayisi): " + g2_1);

// 2.2: Ucreti 500'den yuksek derslerin adi ve ucreti
print("\n2.2 (Ucreti 500'den yuksek dersler):");
printjson(db.dersler.find({ ucret: { $gt: 500 } }, { ad: 1, ucret: 1, _id: 0 }).toArray());

// 2.3: Tam 3 telefonu olan uye sayisi
const g2_3 = db.uyeler.countDocuments({ telefonlar: { $size: 3 } });
print("\n2.3 (Tam 3 telefonu olan uye sayisi): " + g2_3);

// 2.4: Her dersin kayit sayisi, en coktan aza, ilk 5
print("\n2.4 (En cok kayit alan ilk 5 ders):");
printjson(db.kayitlar.aggregate([
  { $group: { _id: "$ders_id", adet: { $sum: 1 } } },
  { $sort: { adet: -1 } },
  { $limit: 5 }
]).toArray());