'use strict';

const _ = require('lodash');


const fs = require('fs')


const main = async () =>{
	console.log('Starting process');
	
	const response = await getJson();
	
	fs.writeFile('./data/locations.json', JSON.stringify(response), function (err) {
		if (err) throw err;
		console.log('File is created successfully.');
	  });
	
	console.log('Finished process');
};

const getJson = async() => {
	return new Promise((resolve, reject) => {
		var fileProvincias = fs.readFileSync('./data/provincias.json', 'utf8');
		var fileMunicipios = fs.readFileSync('./data/municipios.json', 'utf8');
		let provincias = JSON.parse(fileProvincias);
		let municipios = JSON.parse(fileMunicipios);
		let locations = [];
		let country = {
			id: 1,
			parent: 0,
			parent_country: 0,
			type: 'country',
			name: 'España'
		};
		locations.push(country);

		let parents = provincias.map(function(pro){
			let result = {
				id: parseInt(pro.id)+1,
				parent: 1,
				parent_country: 1,
				type: 'state',
				name: pro.provincia
			};
			locations.push(result);
			return result;
		});

		let childs = municipios.map(function(mun){
			let result = {
				id: parseInt(mun.id) + parents.length + 1,
				parent: parseInt(mun.provincia_id) + 1,
				parent_country: 1,
				type: 'city',
				name: mun.municipio
			}
			locations.push(result);
			return result;
		});

		// childs.forEach(element => {
		// 	parents.push(element);
		// });

		resolve(locations);
	});

}
main();
