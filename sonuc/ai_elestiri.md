Araç: Gemini, 20.11.2026

## Verilen İstem

FıratFit veritabanında Föy 04 Görev 2.4'teki 'eğitmen başına toplam kayıt sayısını en çoktan aza sıralayan' 3 tablolu SQL sorgusunu (egitmenler, dersler, kayitlar JOIN), doküman modelimize (egitmen bilgisinin dersler koleksiyonu içine gömülü alt doküman olduğu yapıya) uygun MongoDB aggregate boru hattına çevirir misin?

## Modelin İlk Ürettiği Boru Hattı (Gereksiz İki Aşamalı Lookup)

```javascript
db.kayitlar.aggregate([
  { $lookup: { from: 'dersler', localField: 'ders_id', foreignField: '_id', as: 'ders' } },
  { $unwind: '$ders' },
  { $lookup: { from: 'egitmenler', localField: 'ders.egitmen_id', foreignField: '_id', as: 'egitmen' } },
  { $unwind: '$egitmen' },
  { $group: { _id: '$egitmen.ad', toplam_kayit: { $sum: 1 } } },
  { $sort: { toplam_kayit: -1 } }
])
```

## Sadeleştirilmiş Boru Hattı ve Ortam Çıktısı

```javascript
db.kayitlar.aggregate([
  { $lookup: { from: 'dersler', localField: 'ders_id', foreignField: '_id', as: 'ders' } },
  { $unwind: '$ders' },
  { $group: { _id: '$ders.egitmen.ad', toplam_kayit: { $sum: 1 } } },
  { $sort: { toplam_kayit: -1 } }
])
```

**Çalıştırma Çıktısı:**
```javascript
[
  { _id: 'Emine Taş', toplam_kayit: 73 },
  { _id: 'Serkan Arslan', toplam_kayit: 64 },
  { _id: 'Murat Koç', toplam_kayit: 62 },
  { _id: 'Nazlı Kaya', toplam_kayit: 58 },
  { _id: 'Elif Özdemir', toplam_kayit: 50 },
  { _id: 'Ece Polat', toplam_kayit: 36 },
  { _id: 'Murat Taş', toplam_kayit: 24 },
  { _id: 'Tolga Aydın', toplam_kayit: 19 }
]
```

## Eleştiri ve Değerlendirme

Yapay zeka modeli, ilişkisel veritabanındaki 3 tablolu `JOIN` alışkanlığını doğrudan MongoDB'ye uyarlamaya çalışarak hem `dersler` hem de gerçekte var olmayan `egitmenler` koleksiyonu için iki ayrı `$lookup` aşaması üretmiştir. Oysa doküman tasarımımızda eğitmen bilgileri ayrı bir koleksiyonda tutulmak yerine `dersler` koleksiyonundaki her dokümanın içine gömülü alt doküman (`egitmen`) olarak yerleştirilmiştir. Bu nedenle ikinci `$lookup` ve `$unwind` adımları gereksizdir ve çalıştırıldığında eşleşme bulunamadığı için boş dizi (`[]`) döndürür. Gereksiz ikinci birleştirme kaldırılıp gruplama doğrudan gömülü alana (`$ders.egitmen.ad`) nokta notasyonu ile yapıldığında sorgu hem kısalmış hem de PostgreSQL'deki sonuçlarla birebir örtüşen doğru çıktıyı vermiştir.