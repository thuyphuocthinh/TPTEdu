const orderBtn = document.querySelector("[order-btn]");
Validator({
  form: "#form-user-order",
  rules: [
    Validator.isRequired("#email"),
    Validator.isRequired("#address"),
    Validator.isRequired("#phone"),
    Validator.isEmail("#email"),
  ],
});
const order = {
  cart_id: "",
  userInfo: {
    address: "",
    email: "",
    phone: "",
  },
  courses: [],
};
if (orderBtn) {
  orderBtn.addEventListener("click", () => {
    const userInfoForm = document.querySelector("#form-user-order");
    let result = true;
    // check userinfo
    if (userInfoForm) {
      const inputs = userInfoForm.querySelectorAll("input");
      for (const input of inputs) {
        if (!input.value) {
          const div = document.createElement("div");
          div.classList.add("alert");
          div.classList.add("alert-danger");
          div.innerText = "Vui lòng điền tất cả thông tin người dùng";
          userInfoForm.prepend(div);
          result = false;
          break;
        }
      }
    }

    // get order info
    if (result) {
      if (userInfoForm.querySelector(".alert .alert-danger")) {
        userInfoForm.removeChild(
          userInfoForm.querySelector(".alert .alert-danger")
        );
      }
      const inputs = userInfoForm.querySelectorAll("input");
      inputs.forEach((input) => {
        const value = input.value;
        const name = input.name;
        order.userInfo[name] = value;
      });

      let cartInfo = document
        .querySelector("[cart-info]")
        .getAttribute("cart-info");
      cartInfo = JSON.parse(cartInfo);
      order.cart_id = cartInfo._id;
      cartInfo.courses.forEach((item) => {
        order.courses.push({
          course_id: item.course_id,
          quantity: item.quantity,
        });
      });

      const formOrder = document.querySelector("[form-order]");
      const formOrderInput = formOrder.querySelector("[order-input]");
      formOrderInput.value = JSON.stringify(order);
      formOrder.submit();
    }
  });
}
