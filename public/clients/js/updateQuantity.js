const updatedObj = {
  course_id: "",
  quantity: 0,
};

const inputs = document.querySelectorAll("[form-input-quantity]");
if (inputs.length > 0) {
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const courseId = input.getAttribute("form-input-quantity");
      const { value } = e.target;
      updatedObj.quantity = value;
      updatedObj.course_id = courseId;
    });
  });
}

const updateBtn = document.querySelector("[button-update-quantity]");
if (updateBtn) {
  updateBtn.addEventListener("click", () => {
    if (updatedObj.course_id) {
      const form = document.querySelector("[form-update-quantity]");
      if (form) {
        const input = form.querySelector('[name="updatedObj"]');
        input.value = JSON.stringify(updatedObj);
        form.action = form.action + "?_method=PATCH";
        form.submit();
      }
    } else {
      alert("Vui lòng thay đổi số lượng của một sản phẩm tùy ý");
    }
  });
}
