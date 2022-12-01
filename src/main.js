const rInput = document.querySelectorAll(".r-input")
const form = document.querySelector(".form")
const yInput = document.querySelector("#y-data")
const xInput = document.querySelector(".x-select")
const baseURL = './server.php/'
const resTable = document.querySelector("#result")
const clearFormButton = document.querySelector("#clear-form-button")
const clearTableButton = document.querySelector("#clear-table-button")
const error = document.getElementById('error')
let xValue;
let yValue;
let rValue;

rInput.forEach(button => {
    button.addEventListener('click', (event) => { 
        rInput.forEach(button => button.classList.remove("active"))
        button.classList.add("active")
    })
});


const fetchData = async (url, body, method) => {
    if (method == "POST") {
        const res = await fetch( url, {method: method, body})
        return res.text()
    }
    else if (method == "GET") {
        const res = await fetch( url, {method: method})
        return res.text()
    }
  }
  
form.addEventListener('submit', (event) => {
    event.preventDefault()
    rInput.forEach(button => {
        if (button.classList.contains("active")) {
            rValue = +button.value
        }
    })
    let y = yInput.value
    yValue = +y.replace(',', '.')
    xValue = +xInput.value
    if (yValue >= -3 && yValue <= 3 && [1, 2, 3, 4 ,5].includes(rValue)) {
        error.innerHTML = ""
        ;(async () => {
            let data = new FormData()
            data.append("x", xValue)
            data.append("y", yValue)
            data.append("r", rValue)
            const submitRes = await fetchData(baseURL, data, "POST")
            let resArray = JSON.parse(submitRes)
            let current_time = Date(resArray['current_time'])
            current_time = current_time.split(' ').slice(1, 5).join(' ')
            resTable.insertAdjacentHTML("beforeend", 
                `<tr style='text-align: center;'>
                <td>${resArray['x']}</td>
                <td>${resArray['y']}</td>
                <td>${resArray['r']}</td>
                <td>${resArray['hit']}</td>
                <td>${current_time}</td>
                <td>${resArray['execution_time']} ms</td>
                </tr>`
            )
            sessionStorage.setItem("autosave", sessionStorage.getItem("autosave") + `<tr style='text-align: center;'>
            <td>${resArray['x']}</td>
            <td>${resArray['y']}</td>
            <td>${resArray['r']}</td>
            <td>${resArray['hit']}</td>
            <td>${current_time}</td>
            <td>${resArray['execution_time']} ms</td>
            </tr>`)
        })()
    }
    else {
        error.innerHTML = "Validation error. Y must be in [-3,3]. R must be defined."
    }
})

clearFormButton.addEventListener('click', (event) => {
    rInput.forEach(button => button.classList.remove("active"))
    yInput.value = ""
    xInput.value = -2
})

clearTableButton.addEventListener('click', (event) => {
    resTable.innerHTML = ""
    sessionStorage.setItem("autosave", "")
})

document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault()
    if (sessionStorage.getItem("autosave")) {
        resTable.insertAdjacentHTML("beforeend", sessionStorage.getItem("autosave"))
    }
})
