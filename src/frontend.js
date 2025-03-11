import { TZDate } from "@date-fns/tz";
import { add, format } from "date-fns";

export default class Frontend {
    constructor(data, unit) {
        this.data = data
        this.tempSymbol = this.setSymbol(unit)
        this.windMetric = this.setWindMetric(unit)
        this.currentConditions = document.querySelector("#current-conditions")
        this.locationInfo = document.querySelector("#location-info")
        this.conditions = document.querySelector("#conditions")
        this.nextDaysTemplate = document.querySelector("#day-conditions")
        this.nextDays = document.querySelector("#next-days")
        this.removeLoader()
        this.render()
    }
    removeLoader() {
        document.querySelector("#next-days").classList.remove("low-opacity")
        document.querySelector("#current-conditions").classList.remove("low-opacity")
    }
    setSymbol(unit) {
       return unit == "us" ? '°F' : '°C' 
    }
    setWindMetric(unit) {
        return unit == "us" ? ' mph' : ' km/h'
    }
    toCelsius(temperature) {
        return ((temperature - 32) * 5/9).toFixed(0)
    }
    toFarenheit(temperature) {
        return ((temperature * (9/5)) + 32).toFixed(0)
    }
    toMph(windspeed) {
        windspeed = windspeed.split(" ")[0]
        return (windspeed * 0.621371).toFixed(0)
    }
    toKmh(windspeed) {
        windspeed = windspeed.split(" ")[0]
        return (windspeed * 1.60934).toFixed(0)
    }
    usUnits() {
        this.tempSymbol = this.setSymbol("us")
        this.windMetric = this.setWindMetric("us")
        document.querySelector("#current-temp").textContent = this.toFarenheit(document.querySelector("#current-temp").textContent)
        document.querySelector("#main-unit").textContent = this.tempSymbol
        document.querySelector("#feels-like").textContent = this.toFarenheit(document.querySelector("#feels-like").textContent)
        document.querySelector(".info-icon > .unit").textContent = this.tempSymbol
        document.querySelector("#wind").textContent = this.toMph(document.querySelector("#wind").textContent) + this.windMetric
        document.querySelectorAll(".day-temp-with-symbol").forEach((day) => {
            day.querySelector(".day-temp").textContent = this.toFarenheit(day.querySelector(".day-temp").textContent)
            day.querySelector(".unit").textContent = this.tempSymbol
        })
    }
    metricUnits() {
        this.tempSymbol = this.setSymbol("metric")
        this.windMetric = this.setWindMetric("metric")
        document.querySelector("#current-temp").textContent = this.toCelsius(document.querySelector("#current-temp").textContent)
        document.querySelector("#main-unit").textContent = this.tempSymbol
        document.querySelector("#feels-like").textContent = this.toCelsius(document.querySelector("#feels-like").textContent)
        document.querySelector(".info-icon > .unit").textContent = this.tempSymbol
        document.querySelector("#wind").textContent = (this.toKmh(document.querySelector("#wind").textContent)) + this.windMetric
        document.querySelectorAll(".day-temp-with-symbol").forEach((day) => {
            day.querySelector(".day-temp").textContent = this.toCelsius(day.querySelector(".day-temp").textContent)
            day.querySelector(".unit").textContent = this.tempSymbol
        })
    }
    changeUnits(unit) {
        return unit == 'us' ? this.usUnits() : this.metricUnits()
    }
    formatTime(timezone) {
        let time = new TZDate(new Date(), timezone)
        return format(time, 'p')
    }
    setLocationInfo() {
        this.locationInfo.querySelector("#location").textContent = this.data["city"]
        this.locationInfo.querySelector("#country").textContent = this.data["country"]
    }
    setConditions() {
        let template = document.querySelector("#current-conditions-template").content.cloneNode(true)
        template.querySelector("#current-temp").textContent = this.data["temp"].toFixed(0)
        template.querySelector("#main-unit").textContent = this.tempSymbol
        template.querySelector("#icon").src = `icons/${this.data["icon"]}.png`
        template.querySelector("#temp-description").textContent = this.data["description"]
        this.conditions.appendChild(template)
    }
    setAdditionalInfo() {
        let template = document.querySelector("#additional-info-template").content.cloneNode(true)
        template.querySelector("#feels-like").textContent = this.data["feelslike"].toFixed(0)
        template.querySelector(".unit").textContent = this.tempSymbol
        template.querySelector("#humidity").textContent = this.data["humidity"] + "%"
        template.querySelector("#wind").textContent = this.data["windspeed"].toFixed(0) + this.windMetric
        template.querySelector("#conditions-text").textContent = this.data["conditions"]
        template.querySelector("#current-time").textContent = this.formatTime(this.data["timezone"])
        template.querySelector("#cloud-cover").textContent = this.data["cloudcover"] + "%"
        this.conditions.appendChild(template)
    }
    setNextDays() {
        this.nextDays.textContent = ''
        this.data["days"].forEach((day) => {
            let template = this.nextDaysTemplate.content.cloneNode(true)
            template.querySelector(".date-name").textContent = format((day["datetime"] + " 00:00:00"), "eeee")
            template.querySelector(".date").textContent = day["datetime"]
            template.querySelector(".day-temp").textContent = day["temp"].toFixed(0)
            template.querySelector(".day-icon").src = `icons/${day["icon"]}.png`
            template.querySelector(".unit").textContent = this.tempSymbol
            this.nextDays.appendChild(template)
        })
    }
    clearTemplates() {
        try {
            let additionalInfo = document.querySelector("#additional-info")
            this.conditions.removeChild(additionalInfo)
            let currentTemp = document.querySelector("#temp")
            this.conditions.removeChild(currentTemp)
            let NextDaysDivs = document.querySelectorAll(".next-days-info")
            NextDaysDivs.forEach((div) => this.nextDays.removeChild(div))

        } catch (error) {
            return "no templates"
        }
    }
    render() {
        try {
            this.clearTemplates()
            this.setLocationInfo()
            this.setConditions()
            this.setAdditionalInfo()
            this.setNextDays()
        } catch (error) {
            this.locationInfo.querySelector("#location").textContent = this.data
        }
    }
}