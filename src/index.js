import WeatherAPI from "./weatherApi.js"
import Frontend from "./frontend.js"
import "./index.css"

let api = new WeatherAPI()
let form = document.querySelector("form")
let unitSelection = document.querySelector(".radio-input")
let unit = "us"
let frontend = null

async function render(location) {
    loading()
    let data = await api.getWeather(location, unit)
    frontend = new Frontend(data, unit)
}
unitSelection.addEventListener("change", function() {
    let selectedUnit = document.querySelector("input[type='radio']:checked").value
    unit = selectedUnit
    frontend.changeUnits(unit)
})

function loading() {
    document.querySelector("#current-conditions").classList.add("low-opacity")
    document.querySelector("#next-days").classList.add("low-opacity")
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let form = document.querySelector("form")
    let location = new FormData(form).get("location")
    render(location)
})

render("Komani")