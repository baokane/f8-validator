function Validator(option) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var selectorRules = {};

    ////////////////////
    function validate(inputElement, rule) {
        // var errorMessage = rule.test(inputElement.value)
        var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector);
        // var errorElement = inputElement.parentElement.querySelector(option.errorSelector);
        var errorMessage;

        //Lấy ra các rules của selectorRules
        var rules = selectorRules[rule.selector];

        //Lặp qua các test và kiểm tra giá trị người dùng nhập vào
        //Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);


            }
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, option.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = '';
            getParent(inputElement, option.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage
    }



    var formElement = document.querySelector(option.form)
    if (formElement) {
        //khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true //ko lỗi là true

            option.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) { //có lỗi là false
                    isFormValid = false  //có lỗi là false
                }
            });
            if (isFormValid) {
                // option.onSubmit({
                //     name: 'sódang'
                // })
                if (typeof option.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]');
                    var formValue = Array.from(enableInput).reduce(function (values, input) {
                        switch (input.type) {
                            case "radio":
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case "checkbox":
                                if (!input.matches(':checked')) {
                                    values[input.name] = [];
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files
                            default:
                                values[input.name] = input.value;
                        }

                        return values
                    }, {})
                    option.onSubmit(formValue);
                } else {
                    formElement.submit()
                }
            }
        }


        option.rules.forEach(function (rule) {
            // Lưu lại các rule
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }



            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement) {
                inputElement.onblur = function () {
                    //rule.test: hàm , inputElement.value: giá trị input người dùng nhập vào
                    validate(inputElement, rule);
                }
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector)
                    errorElement.innerText = '';
                    getParent(inputElement, option.formGroupSelector).classList.remove('invalid')
                }
            })


        })

    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'vui lòng nhập trường này!!!!!'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'vui lòng nhập email'
        }
    }
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {

            return value.length >= min ? undefined : `vui lòng nhập tối thiểu ${min} kí tự `
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {

            return value === getConfirmValue() ? undefined : message || "vui lòng nhập lại password"
        }
    }
}

///////////////////////////////
//isrequired , isEmail,// selector, test // formElement, inputElement, errorMessage, errorElement, value: của test

// function Validator(option) {
//     var selectorRules = {}

//     var formElement = document.querySelector('#form-1')
//     if (formElement) {
//         function validate(inputElement, rule) {
//             var errorMessage;
//             var errorElement = inputElement.parentElement.querySelector(option.errorSelector)

//             var rules = selectorRules[rule.selector];
//             console.log(rules)
//             for (var i = 0; i < rules.length; i++) {
//                 var errorMessage = rules[i](inputElement.value);
//                 console.log(rules[i])
//                 if (errorMessage) break;
//             }

//             if (errorMessage) {
//                 inputElement.parentElement.classList.add('invalid');
//                 errorElement.innerText = errorMessage;
//             } else {
//                 inputElement.parentElement.classList.remove('invalid');
//                 errorElement.innerText = '';
//             }
//         }
//         option.rules.forEach(function (rule) {
//             //Lấy các rule
//             if (Array.isArray(selectorRules[rule.selector])) {
//                 selectorRules[rule.selector].push(rule.test)
//             } else {
//                 selectorRules[rule.selector] = [rule.test]
//             }


//             let inputElement = formElement.querySelector(rule.selector);
//             let errorElement = inputElement.parentElement.querySelector(option.errorSelector)
//             inputElement.onblur = function () {
//                 validate(inputElement, rule)
//             }
//             inputElement.oninput = function () {

//                 inputElement.parentElement.classList.remove('invalid');
//                 errorElement.innerText = '';
//             }
//         })
//         console.log(selectorRules)
//     }
// }

// Validator.isRequired = function (selector, message) {
//     return {
//         selector: selector,
//         test: function (value) {
//             return value.trim() ? undefined : message || 'vui lòng nhập trường này'
//         }
//     }
// }

// Validator.isEmail = function (selector) {
//     return {
//         selector: selector,
//         test: function (value) {
//             var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//             return regex.test(value) ? undefined : 'vui lòng nhập email'
//         }
//     }
// }

// Validator.minLength = function (selector, min) {
//     return {
//         selector: selector,
//         test: function (value) {

//             return value.length >= min ? undefined : `vui lòng nhập tối thiểu ${min} kí tự `
//         }
//     }
// }

// Validator.isConfirmed = function (selector, getConfirmValue, message) {
//     return {
//         selector: selector,
//         test: function (value) {

//             return value === getConfirmValue() ? undefined : message || "vui lòng nhập lại password"
//         }
//     }
// }