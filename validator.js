function Validator(option) {
    var formElement = document.querySelector(option.form)
    if (formElement) {
        option.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    console.log(rule.selector)
                }
            }
        })
    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function () {

        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function () {

        }
    }
}