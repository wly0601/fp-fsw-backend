'use strict';

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { Cities } = require("../../app/models");
const data = require("../../data/indonesia-cities.json");

const names = [
  "Ahmad Yuneda Alfajr",
  "Ahmad Dendy Prasongko Putra",
  "Ahmad Ilham",
  "Aulia Ardi Utami",
  "Deka Mersandi",
  "Devi Indriyana Putri",
  "Ghifari Astaudi` Ukumullah",
  "I Gede Ariawan Eka Putra",
  "Ida Bagus Gede Suprapta",
  "Mahardhika Chandra Nur Ikhsan",
  "Maria Natalia",
  "Muhammad Nur Fadli",
  "Narantyo Maulana Adhi Nugraha",
  "Nilam Cahya",
  "Nur Aini Lailla Asri",
  "Ramadhan Yudha Pratama",
  "Rizki Oktavianus",
  "Safira Tyas Wandita",
  "Tito Anggoro",
  "Tubagus Muhammad Eza Rizqi",
  "Wahyu Priyo Atmaja",
  "Yudha Gana Prasetyo Wibowo"
];

function getRandAlphabet(args) {
  const getRandInt = Math.floor(Math.random() * 26);
  return String.fromCharCode((getRandInt + 65).toString());
}

function getRandTwoDigits(args) {
  var getRandInt = Math.random().toString().substring(6, 8);
  if (getRandInt[0] === '0' && getRandInt[1] !== '0') {
    getRandInt = getRandInt[1];
  } else if (getRandInt[0] === '0' && getRandInt[1] === '0') {
    getRandInt = '1';
  }
  return getRandInt;
}

function getRandCity(args) {
  const cities = [
    "Kota Jakarta Selatan",
    "Kota Jakarta Pusat",
    "Kota Jakarta Utara",
    "Kota Jakarta Timur",
    "Kota Jakarta Barat",
    "Kota Bandung",
    "Kota Semarang",
    "Kota Surabaya",
    "Kota Yogyakarta"
  ];
  const getCity = cities[Math.floor(Math.random() * cities.length)];

  const find = data.find((element) =>
    element.city === getCity
  );

  return find;
}


module.exports = {
  async up(queryInterface, Sequelize) {
    const password = "12345678";
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const users = names.map((name) => {
      const splitName = name.split(' ');
      var emailBuild = splitName[0] + splitName[splitName.length - 1];
      const randAlpha = getRandAlphabet();
      const getRandDigits = getRandTwoDigits();
      const randCity = getRandCity();
      const rand = Math.floor(Math.random() * 10);

      return ({
        name,
        email: `${emailBuild.toLowerCase()}@gmail.com`,
        encryptedPassword,
        photo: `https://randomuser.me/api/portraits/lego/${rand}.jpg`,
        phoneNumber: `08${Math.random().toString().substring(5,15)}`,
        address: `Jalan Binar Blok ${randAlpha} Nomor ${getRandDigits}, ${randCity.city}.`,
        cityId: randCity.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      name: {
        [Op.in]: names
      }
    }, {});
  }
};