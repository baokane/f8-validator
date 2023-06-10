function Validator(option) {
    var selectorRules = {};

    ////////////////////
    function validate(inputElement, rule) {
        // var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector(option.errorSelector);
        var errorMessage;

        //Lấy ra các rules của selectorRules
        var rules = selectorRules[rule.selector];
        console.log(rules)

        //Lặp qua các rules và kiểm tra giá trị người dùng nhập vào
        //Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
    }

    var formElement = document.querySelector(option.form)

    if (formElement) {
        option.rules.forEach(function (rule) {
            // Lưu lại các rule
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }


            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = function () {
                    //rule.test: hàm , inputElement.value: giá trị input người dùng nhập vào
                    validate(inputElement, rule);
                }
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(option.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })

    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'vui lòng nhập email'
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
//     var formElement = document.querySelector('#form-1')
//     if (formElement) {
//         function validate(inputElement, rule) {
//             var errorMessage = rule.test(inputElement.value);
//             var errorElement = inputElement.parentElement.querySelector(option.errorSelector)

//             if (errorMessage) {
//                 inputElement.parentElement.classList.add('invalid');
//                 errorElement.innerText = errorMessage;
//             } else {
//                 inputElement.parentElement.classList.remove('invalid');
//                 errorElement.innerText = '';
//             }
//         }
//         option.rules.forEach(function (rule) {
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

//     }
// }

// Validator.isRequired = function (selector) {
//     return {
//         selector: selector,
//         test: function (value) {
//             return value.trim() ? undefined : 'vui lòng nhập name'
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