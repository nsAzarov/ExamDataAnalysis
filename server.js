const csvFilePath = './earthquakes.csv'
const csv = require('csvtojson')

let data = []

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		const rawdata = jsonObj[0]
		rawdata.Earthquake_Magnitude.split(';;').forEach((x) => {
			const regexData = x.match(/\d.\d,\d*,"\D*"/)
			if (regexData) {
				const str = regexData[0]
				const magnitude = str.match(/\d.\d/)[0]
				const numEarthquakesRaw = str.match(/,\d*,/)[0]
				const numEarthquakes = numEarthquakesRaw.slice(
					1,
					numEarthquakesRaw.length - 1
				)
				const countries = str
					.match(/"\D*"/)[0]
					.replace(/"/, '')
					.replace(/""/, '')
					.split(',')
				data.push({ magnitude, numEarthquakes, countries })
			}
		})
		console.log(data)

		// a)	Сколько всего сильных землетрясений зарегистрировано в наборе данных?
		let numEarthquakes = 0
		for (let i = 0; i < data.length; i++) {
			if (data[i].magnitude >= 3)
				numEarthquakes += Number(data[i].numEarthquakes)
		}
		const strongEarthquakesNumber = numEarthquakes

		// PORTUGAL
		// c)	Укажите диапазон магнитуд сильных землетрясений, зарегистрированных в Португалии.
		const isPortugalInArray = (countries) => {
			for (let i = 0; i < countries.length; i++) {
				if (countries[i].includes('PORTUGAL')) return true
			}
			return false
		}
		let magnitudes = []
		for (let i = 0; i < data.length; i++) {
			console.log(data[i])
			if (isPortugalInArray(data[i].countries))
				magnitudes.push(data[i].magnitude)
		}
		console.log(
			'magnitudes',
			magnitudes[0],
			'-',
			magnitudes[magnitudes.length - 1]
		) // magnitudes 8.5 - 4.6

		// d)	Какая из магнитуд сильных землетрясений является наиболее вероятной? (То есть, чему равно математическое ожидание магнитуды сильного землетрясения?)
		let sum = 0
		for (let i = 0; i < data.length; i++) {
			sum +=
				data[i].magnitude * (data[i].numEarthquakes / strongEarthquakesNumber)
		}
		console.log(sum) // 6.464675265897263
	})
