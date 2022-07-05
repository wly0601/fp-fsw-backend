'use strict';

function randomPrice(deviation, multiple){
	return deviation*(Math.floor(2*Math.random()*multiple) - multiple)
};

module.exports = {
	async up (queryInterface, Sequelize) {
		const products = [
			{
				name: "Jam Tangan Casio",
				categoryId: 14,
				basePrice: 400000,
				deviationPrice: 10000,
				multiple: 15
			},
			{
				name: "Laptop Asus ROG",
				categoryId: 2,
				basePrice: 5000000,
				deviationPrice: 150000,
				multiple: 10
			},
			{
				name: "Mesin Cuci",
				categoryId: 5,
				basePrice: 1000000,
				deviationPrice: 10000,
				multiple: 25
			},
			{
				name: "Meja Belajar",
				categoryId: 5,
				basePrice: 500000,
				deviationPrice: 10000,
				multiple: 25
			},
			{
				name: "Kamera Nikon D3500",
				categoryId: 22,
				basePrice: 3500000,
				deviationPrice: 150000,
				multiple: 4
			}
		];

		const users = new Array(15)
		for (let i = 0; i < users.length; i++) {
			users[i] = i+1;
		}

		const insertProducts = [];
		products.forEach((product) => {
			insertProducts.push(
				...users.map((user, index) => {
					const getTwoDigits = Math.random().toString().substring(6,8);
					const deviationPrice = randomPrice(product.deviationPrice, product.multiple)
					return ({
						name: product.name,
						sellerId: index + 1,
						price: product.basePrice + deviationPrice,
						categoryId: product.categoryId,
						description: "Lorem ipsum dolor sit amet",
						images: [
							`https://picsum.photos/id/1${getTwoDigits}/200/300`,
							`https://picsum.photos/id/${getTwoDigits}2/200/300`,
							`https://picsum.photos/id/${getTwoDigits}1/200/300`,
							`https://picsum.photos/id/2${getTwoDigits}/200/300`
						],
						statusId: 1,
						numberOfWishlist: Math.floor(Math.random()*5),
						createdAt: new Date(),
						updatedAt: new Date(),  						
					})
				})
			)
		})

		await queryInterface.bulkInsert('Products', insertProducts, {})
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Products', null, {});
	}
};
