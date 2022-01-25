const baseURL = 'https://v6.exchangerate-api.com/v6'
const APIKey = '4ae0ac8af33e442ad4a5e08e'
const defaultCurrencyFrom = 'USD'
const defaultCurrencyTo = 'BRL'

const currencyFromInput = document.querySelector('[data-js="currency-one"]')
const currencyToInput = document.querySelector('[data-js="currency-two"]')
const currencyTimes = document.querySelector('[data-js="currency-one-times"]')
const convertedValue = document.querySelector('[data-js="converted-value"]')
const conversionPrecision = document.querySelector('[data-js="conversion-precision"]')
const errorMessageParagraph = document.querySelector('[data-js="error-message"]')

const getCurrenciesUrl = currencyFrom => 
  `${baseURL}/${APIKey}/latest/${currencyFrom}`

const getConvertedCurrencyPairsUrl = (currencyFrom, currencyTo, amount) => 
  `${baseURL}/${APIKey}/pair/${currencyFrom}/${currencyTo}/${amount}`

const fetchData = async endpoint => {
  try {
    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error('Não foi possível obter os dados da API')
    }

    return response.json()
  } catch ({ name, message }) {
    console.log(name, message)
    renderErrorMessage('Não foi possível obter os dados da API')
  }
}

const renderErrorMessage = message => {
  errorMessageParagraph.textContent = message
  errorMessageParagraph.classList.add('alert', 'alert-danger')
}

const populateInputs = async (currencyFrom, currencyTo) => {
  const { conversion_rates } = await fetchData(getCurrenciesUrl(currencyFrom))

  const currencies = Object.entries(conversion_rates)
  
  currencies.forEach(([currency]) => {
    currencyFromInput.innerHTML += `<option value='${currency}'>${currency}</option>`
    currencyToInput.innerHTML += `<option value='${currency}'>${currency}</option>`
  })

  currencyFromInput.value = currencyFrom
  currencyToInput.value = currencyTo
  convertedValue.textContent = conversion_rates[currencyTo].toFixed(2)
  conversionPrecision.textContent = conversion_rates[currencyTo]
}

const convertCurrency = async (currencyFrom, currencyTo, amount) => {
  const { conversion_result, conversion_rate } = await fetchData(getConvertedCurrencyPairsUrl(currencyFrom, currencyTo, amount))

  convertedValue.textContent = conversion_result.toFixed(2)
  conversionPrecision.textContent = conversion_rate
}

currencyFromInput.addEventListener('input', event => {
  const currencyFrom = event.target.value
  const currencyTo = currencyToInput.value

  convertCurrency(currencyFrom, currencyTo, currencyTimes.value)
});

currencyToInput.addEventListener('input', event => {
  const currencyTo = event.target.value
  const currencyFrom = currencyFromInput.value

  convertCurrency(currencyFrom, currencyTo, currencyTimes.value)
});

currencyTimes.addEventListener('input', event => {
  const conversionPrecisionValue = conversionPrecision.textContent
  const currencyTimes = event.target.value

  convertedValue.textContent = 
    (conversionPrecisionValue * currencyTimes).toFixed(2)
})

populateInputs(defaultCurrencyFrom, defaultCurrencyTo)
