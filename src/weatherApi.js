export default class WeatherAPI {
    constructor() {
        this.API_KEY = process.env.API_KEY;
        this.BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    }
    async getData(location, unit = "us") {
        let response = await fetch(this.BASE_URL+`${location}?key=${this.API_KEY}&unitGroup=${unit}`)
        return await response.json()
    }
    async getWeather(location, unit) {
        try {
            let data = await this.getData(location, unit)
            return this.transformResponse(data)
        } catch (error) {
            return Error("No Results Found")
        }
    }
    transformResponse(data) {
        let todaysData = data["currentConditions"]
        let location = this.splitLocation(data["resolvedAddress"])
        todaysData["days"] = this.getNextDaysWeather(data)
        todaysData["description"] = data["description"]
        todaysData["city"] = location["city"]
        todaysData["country"] = location["country"]
        todaysData["timezone"] = data["timezone"]
        return todaysData
    }
    splitLocation(address) {
        address = address.split(",")
        let response = {"city": '', "country": ''}
        if (address.length > 1) {
            response["city"] = address.slice(0, address.length-1).join(",").trim()
            response["country"] = address.at(-1).trim()
        }
        else {
            response["city"] = address.join("").trim()
        }
        return response
    }

    getNextDaysWeather(data) {
        return data["days"].slice(1, 6)
    }
}
console.log("API Key:", process.env.API_KEY);
