function Validator(options) {
  let formElement = document.querySelector(options.form);
  let selectorRules = {};

  function getParent(element) {
    return element.closest(".form-group").querySelector(".error-msg");
  }

  function Validate(inputElement, rule) {
    let errorMsg;
    let rules = selectorRules[rule.selector];
    let errorElement = getParent(inputElement);

    for (let i = 0; i < rules.length; i++) {
      if (inputElement.tagName === "SELECT") {
        const options = inputElement.querySelectorAll("option");
        let isSelected = false;
        for (let i = 1; i < options.length; i++) {
          if (options[i].selected) isSelected = true;
        }
        errorMsg = isSelected ? undefined : "Vui lòng chọn 1 lựa chọn nào đó!";
      } else if (inputElement.tagName === "TEXTAREA") {
        var editorContent = tinyMCE.get("description").getContent();
        errorMsg = rules[i](editorContent);
      } else {
        switch (inputElement.type) {
          case "checkbox":
            break;
          case "radio":
            let radioList = document.querySelectorAll(rule.selector);
            let isChecked = false;
            radioList.forEach((radio) => {
              if (radio.checked) isChecked = true;
            });
            errorMsg = isChecked
              ? undefined
              : "Vui lòng chọn 1 lựa chọn nào đó bạn muốn!";
            break;
          default:
            errorMsg = rules[i](inputElement.value);
        }
      }
      if (errorMsg) break;
    }

    if (errorMsg) {
      errorElement.textContent = errorMsg;
      if (inputElement.classList.contains("valid")) {
        inputElement.classList.remove("valid");
      }
      inputElement.classList.add("invalid");
    } else {
      errorElement.textContent = "";
      inputElement.classList.remove("invalid");
      inputElement.classList.add("valid");
    }

    return !errorMsg;
  }

  if (formElement) {
    formElement.onsubmit = (e) => {
      e.preventDefault();
      let isFormValid = true;
      options.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = Validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      let enableInputs = formElement.querySelectorAll("[name]:not([disabled])");
      let formValues = {};
      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          Array.from(enableInputs).forEach((node) => {
            let { name, value } = node;
            formValues = {
              ...formValues,
              [name]: value,
            };
          });
          options.onSubmit(formValues);
        } else {
          formElement.submit();
        }
      } else {
        console.log("Error");
      }
    };

    options.rules.forEach((rule) => {
      let inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach((inputElement) => {
        if (Array.isArray(selectorRules[rule.selector])) {
          selectorRules[rule.selector].push(rule.test);
        } else {
          selectorRules[rule.selector] = [rule.test];
        }

        if (inputElement) {
          inputElement.onblur = () => {
            Validate(inputElement, rule);
          };
          inputElement.oninput = () => {
            Validate(inputElement, rule);
          };
          inputElement.onselect = () => {
            Validate(inputElement, rule);
          };
        }
      });
    });
  }
}

Validator.isRequired = function (selector) {
  return {
    selector,
    test: function (value) {
      return value.trim().length > 0
        ? undefined
        : `Không được để trống trường này!`;
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector,
    test: function (value) {
      let regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return regex.test(value) ? undefined : "Truong nay phai la email";
    },
  };
};

Validator.isPassword = function (selector, minLength) {
  return {
    selector,
    test: function (value) {
      return value.trim().length >= minLength
        ? undefined
        : `Do dai password it nhat la ${minLength}`;
    },
  };
};

Validator.isConfirmed = function (selector, needToConfirmSelector, message) {
  return {
    selector,
    test: function (value) {
      return value === document.querySelector(needToConfirmSelector).value
        ? undefined
        : message || "Gia tri nhap vao khong khop";
    },
  };
};

Validator({
  form: "#form",
  rules: [
    Validator.isRequired("#title"),
    Validator.isRequired("#thumbnail"),
    Validator.isRequired("#course_category_id"),
    Validator.isRequired("#description"),
    Validator.isRequired("#price"),
    Validator.isRequired("#discountPercentage"),
  ],
});

Validator({
  form: "#form-edit",
  rules: [
    Validator.isRequired("#title"),
    Validator.isRequired("#course_category_id"),
    Validator.isRequired("#description"),
    Validator.isRequired("#price"),
    Validator.isRequired("#discountPercentage"),
  ],
});

Validator({
  form: "#form-course-category-create",
  rules: [
    Validator.isRequired("#title"),
    Validator.isRequired("#parent_category_id"),
  ],
});

Validator({
  form: "#form-course-category-edit",
  rules: [
    Validator.isRequired("#title"),
    Validator.isRequired("#parent_category_id"),
  ],
});

/* 
    Khong duoc hardcode
    Logic hoạt động
    - Bên sử dụng: truyền vào options{form, rules, onSubmit}
    - Bên xử lí:
    + Định nghĩa Máy kiểm tra (Validator)
        - Định nghĩa chức năng kiểm tra (Validate)
        - Duyệt qua các rules => lấy dữ liệu từ input => đưa vào hàm Validate kiểm tra => trả ra kết quả
        - Nếu có chức năng submit => kiểm tra form đã valid chưa => nếu valid thì gửi dữ liệu lấy từ input về 
        cho bên sử dụng => nếu chưa thì yêu cầu nhập lại
        - Định nghĩa các rules
        - Định nghĩa tìm parent element nhiều cấp => không phải form nào cũng có thể được .form-msg từ .form-control dễ dàng
*/
