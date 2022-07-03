'use strict';

const categories = [
  "Elektronik",
  "Komputer & Aksesoris",
  "Perawatan & Kecantikan",
  "Handphone & Akesoris",
  "Perlengkapan Rumah",
  "Pakaian Pria",
  "Pakaian Wanita",
  "Sepatu Pria",
  "Fashion Muslim",
  "Tas Pria",
  "Fashion Bayi & Anak",
  "Aksesoris Fashion",
  "Ibu & Bayi",
  "Jam Tangan",
  "Sepatu Wanita",
  "Tas Wanita",
  "Hobi & Koleksi",
  "Otomotif",
  "Olahraga & Outdoor",
  "Souvenir & Pesta",
  "Buku & Alat Tulis",
  "Fotografi"
]

module.exports = {
  async up (queryInterface, Sequelize) {
    const category = categories.map((cat) => ({
      name: cat,
      createdAt: new Date(),
      updatedAt: new Date(),      
    }))

    await queryInterface.bulkInsert('Categories', category, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
