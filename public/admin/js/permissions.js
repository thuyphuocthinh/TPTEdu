// update
const roleIds = document.querySelectorAll("[role-id]");
const rolesLength = document
  .querySelector("[roles-data]")
  .getAttribute("roles-data");
const inputs = document.querySelectorAll('[name="permissions"]');
const permissions = [];
for (let i = 0; i < rolesLength; i++) {
  permissions.push({
    role_id: roleIds[i].getAttribute("role-id"),
    permissions: [],
  });
}
const form = document.querySelector("#form-update-permissions");
const inputText = form.querySelector('[name="permissionsUpdate"]');
const table = document.querySelector("[table-permissions]");

// display permissions when rendering view
if (table) {
  const roles = JSON.parse(table.getAttribute("table-permissions"));
  const functionRows = table.querySelectorAll("[row-function]");
  functionRows.forEach((row, index) => {
    const tds = row.querySelectorAll("[td-checkbox]");
    tds.forEach((td, index) => {
      const input = td.querySelector("input");
      const value = input.value;
      if (roles[index].permissions.includes(value)) input.checked = true;
    });
  });
}

// set checked values for permissions array
if (table) {
  const functionRows = table.querySelectorAll("[row-function]");
  functionRows.forEach((row) => {
    const tds = row.querySelectorAll("[td-checkbox]");
    tds.forEach((td, index) => {
      const input = td.querySelector("input");
      const value = input.value;
      if (input.checked) {
        permissions[index].permissions.push(value);
      }
    });
  });
}

// listen on click event to update permissions array
if (inputs.length > 0) {
  inputs.forEach((input) => {
    input.addEventListener("click", () => {
      const index = input.getAttribute("data-index");
      const value = input.value;
      const findIndex = permissions[index].permissions.findIndex(
        (item) => item === value
      );
      if (findIndex === -1) permissions[index].permissions.push(value);
      else permissions[index].permissions.splice(findIndex, 1);
      inputText.value = JSON.stringify(permissions);
    });
  });
}
